import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Trash2, PlusCircle, Package } from 'lucide-react'
import Navbar from '../components/Navbar'
import ListingCard from '../components/ListingCard'
import { useAuth } from '../context/AuthContext'
import { getUserListings, deleteListing } from '../services/listingsService'

function StatusBadge({ status }) {
  const styles = {
    active: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    sold: 'bg-gray-100 text-gray-600 border border-gray-300',
    negotiating: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  }
  const labels = {
    active: 'Active',
    sold: 'Sold',
    negotiating: 'Negotiating',
  }
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        styles[status] || styles.active
      }`}
    >
      {labels[status] || status}
    </span>
  )
}

export function MyListingsPage() {
  const { currentUser } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  async function fetchListings() {
    if (!currentUser) return
    setLoading(true)
    try {
      const data = await getUserListings(currentUser.uid)
      setListings(data)
    } catch {
      toast.error('Failed to load your listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [currentUser])

  async function handleDelete(listing) {
    const confirmed = window.confirm(
      `Are you sure you want to delete this listing?\n\n${listing.course} — ${
        listing.type === 'notes' ? 'Class Notes' : 'Mock Test/Past Exam'
      }\n\nThis action cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(listing.id)
    try {
      await deleteListing(listing.id)
      toast.success('Listing deleted')
      setListings(prev => prev.filter(l => l.id !== listing.id))
    } catch {
      toast.error('Failed to delete listing. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <Link
            to="/sell"
            className="flex items-center gap-2 bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Listing
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="bg-gray-100 p-5 rounded-full mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">You haven't listed anything yet</p>
            <p className="text-gray-400 text-sm mb-5">
              Start selling your notes and reach students who need them.
            </p>
            <Link
              to="/sell"
              className="bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Create Your First Listing
            </Link>
          </div>
        )}

        {/* Listings grid */}
        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {listings.map(listing => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} showActions={true} />

                {/* Extra controls overlay */}
                <div className="mt-2 flex items-center justify-between px-1">
                  <StatusBadge status={listing.status} />

                  <button
                    onClick={() => handleDelete(listing)}
                    disabled={deletingId === listing.id}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-1 px-2 rounded hover:bg-red-50"
                    aria-label="Delete listing"
                  >
                    {deletingId === listing.id ? (
                      <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-500"></span>
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    {deletingId === listing.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MyListingsPage
