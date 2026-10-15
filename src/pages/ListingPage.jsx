import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { getListingById } from '../services/listingsService'
import { createOffer, getBuyerOfferForListing, updateOfferStatus } from '../services/offersService'
import { createNotification } from '../services/notificationsService'
import { validateOffer } from '../utils/validation'

function formatDate(timestamp) {
  if (!timestamp) return 'Unknown date'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function ListingPage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [listing, setListing] = useState(null)
  const [loadingListing, setLoadingListing] = useState(true)
  const [existingOffer, setExistingOffer] = useState(null)

  const [actionLoading, setActionLoading] = useState(false)
  const [successModal, setSuccessModal] = useState(null) // { title, message }

  const [counterOpen, setCounterOpen] = useState(false)
  const [counterPrice, setCounterPrice] = useState('')
  const [counterLoading, setCounterLoading] = useState(false)
  const [counterError, setCounterError] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoadingListing(true)
      try {
        const data = await getListingById(id)
        setListing(data)
        if (data && currentUser && data.sellerId !== currentUser.uid) {
          const offer = await getBuyerOfferForListing(currentUser.uid, id)
          setExistingOffer(offer)
        }
      } catch {
        toast.error('Failed to load listing')
      } finally {
        setLoadingListing(false)
      }
    }
    fetchData()
  }, [id, currentUser])

  const isSeller = listing && currentUser && listing.sellerId === currentUser.uid
  const buyerName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'A buyer'

  async function handleBuyOrRequest() {
    if (!listing) return
    setActionLoading(true)
    try {
      const offeredPrice = listing.price
      const offerStatus = 'accepted'

      const offerRef = await createOffer({
        listingId: listing.id,
        buyerId: currentUser.uid,
        buyerEmail: currentUser.email,
        buyerName,
        sellerId: listing.sellerId,
        originalPrice: listing.price,
        offeredPrice,
      })

      // Update offer to accepted
      await updateOfferStatus(offerRef.id, offerStatus)

      // Notify seller
      const actionWord = listing.price === 0 ? 'requested' : 'purchased'
      await createNotification({
        userId: listing.sellerId,
        type: 'offer_accepted',
        message: `${buyerName} (${currentUser.email}) has ${actionWord} your listing: ${listing.course} — ${
          listing.type === 'notes' ? 'Class Notes' : 'Mock Test/Past Exam'
        }. Contact them at: ${currentUser.email}`,
        offerId: offerRef.id,
        listingId: listing.id,
        buyerEmail: currentUser.email,
      })

      setExistingOffer({ id: offerRef.id, status: 'accepted', offeredPrice })
      setSuccessModal({
        title: listing.price === 0 ? 'Request Sent!' : 'Purchase Complete!',
        message: `The seller will be notified with your email (${currentUser.email}) and will contact you shortly.`,
      })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCounterOffer(e) {
    e.preventDefault()
    setCounterError('')

    const validation = validateOffer(counterPrice, listing.price)
    if (!validation.valid) {
      setCounterError(validation.error)
      return
    }

    setCounterLoading(true)
    try {
      const offerRef = await createOffer({
        listingId: listing.id,
        buyerId: currentUser.uid,
        buyerEmail: currentUser.email,
        buyerName,
        sellerId: listing.sellerId,
        originalPrice: listing.price,
        offeredPrice: Number(counterPrice),
      })

      // Notify seller about counter offer
      await createNotification({
        userId: listing.sellerId,
        type: 'counter_offer',
        message: `${buyerName} has made a counter offer of $${Number(counterPrice).toFixed(2)} for your listing: ${listing.course} — ${
          listing.type === 'notes' ? 'Class Notes' : 'Mock Test/Past Exam'
        }. Buyer email: ${currentUser.email}`,
        offerId: offerRef.id,
        listingId: listing.id,
        buyerEmail: currentUser.email,
      })

      setExistingOffer({ id: offerRef.id, status: 'pending', offeredPrice: Number(counterPrice) })
      setCounterOpen(false)
      setCounterPrice('')
      toast.success('Counter offer sent! The seller will be notified.')
    } catch {
      toast.error('Failed to send counter offer. Please try again.')
    } finally {
      setCounterLoading(false)
    }
  }

  if (loadingListing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800"></div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 text-lg mb-4">Listing not found.</p>
          <Link to="/buy" className="text-blue-800 underline text-sm">Browse listings</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{successModal.title}</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{successModal.message}</p>
            <button
              onClick={() => setSuccessModal(null)}
              className="bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Listing detail card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md">
              {listing.course}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                listing.type === 'mock_test'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {listing.type === 'mock_test' ? 'Mock Test / Past Exam' : 'Class Notes'}
            </span>
            {listing.status !== 'active' && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  listing.status === 'sold'
                    ? 'bg-gray-100 text-gray-600 border border-gray-300'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                }`}
              >
                {listing.status === 'sold' ? 'Sold' : 'Negotiating'}
              </span>
            )}
          </div>

          {/* Course full name */}
          {listing.courseFullName && (
            <p className="text-sm text-gray-400 mb-3">{listing.courseFullName}</p>
          )}

          {/* Price */}
          <div className="mb-4">
            {listing.price === 0 ? (
              <span className="text-4xl font-bold text-emerald-600">Free</span>
            ) : (
              <span className="text-4xl font-bold text-gray-900">${Number(listing.price).toFixed(2)}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-5">{listing.description}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{listing.sellerName || 'Unknown seller'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Posted {formatDate(listing.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Seller actions */}
        {isSeller && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="text-blue-800 font-medium text-sm mb-3">This is your listing.</p>
            <Link
              to="/my-listings"
              className="inline-block bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage My Listings
            </Link>
          </div>
        )}

        {/* Buyer actions */}
        {!isSeller && listing.status === 'active' && (
          <div className="space-y-4">
            {/* Existing offer status */}
            {existingOffer && (
              <div
                className={`rounded-xl border p-4 text-sm font-medium ${
                  existingOffer.status === 'accepted'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : existingOffer.status === 'rejected'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                }`}
              >
                {existingOffer.status === 'accepted' &&
                  `Your offer of $${Number(existingOffer.offeredPrice).toFixed(2)} was accepted!`}
                {existingOffer.status === 'pending' &&
                  `Counter offer of $${Number(existingOffer.offeredPrice).toFixed(2)} is pending seller review.`}
                {existingOffer.status === 'rejected' &&
                  'Your counter offer was declined.'}
              </div>
            )}

            {/* Primary action button */}
            {!existingOffer && (
              <button
                onClick={handleBuyOrRequest}
                disabled={actionLoading}
                className="w-full bg-blue-800 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading && (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                )}
                {listing.price === 0 ? 'Request for Free' : `Buy at $${Number(listing.price).toFixed(2)}`}
              </button>
            )}

            {/* Counter offer section — only show if price > 0 and no pending/accepted offer */}
            {listing.price > 0 && (!existingOffer || existingOffer.status === 'rejected') && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setCounterOpen(!counterOpen)}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Make a Counter Offer</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${counterOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {counterOpen && (
                  <form onSubmit={handleCounterOffer} className="px-5 pb-5 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mt-3 mb-3">
                      Listed at ${Number(listing.price).toFixed(2)}. Your offer must be lower.
                    </p>
                    {counterError && (
                      <p className="text-red-600 text-xs mb-2">{counterError}</p>
                    )}
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={counterPrice}
                          onChange={e => setCounterPrice(e.target.value)}
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={counterLoading}
                        className="bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {counterLoading && (
                          <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                        )}
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Listing inactive for buyer */}
        {!isSeller && listing.status !== 'active' && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-gray-500 text-sm">
              This listing is no longer available.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default ListingPage
