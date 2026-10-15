import { Bell, Check, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import useNotifications from '../hooks/useNotifications'
import { updateOfferStatus } from '../services/offersService'
import { createNotification, markAllAsRead as markAllRead } from '../services/notificationsService'

function timeAgo(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function NotificationsPage() {
  const { currentUser } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  async function handleMarkAllRead() {
    try {
      await markAllAsRead()
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark notifications as read')
    }
  }

  async function handleAcceptOffer(notification) {
    try {
      await updateOfferStatus(notification.offerId, 'accepted')

      // Notify buyer their offer was accepted, include seller email
      await createNotification({
        userId: notification.buyerId || null,
        type: 'offer_accepted',
        message: `Your offer was accepted! The seller's contact email is: ${currentUser.email}. Reach out to arrange the exchange.`,
        offerId: notification.offerId,
        listingId: notification.listingId,
        buyerEmail: notification.buyerEmail,
      })

      await markAsRead(notification.id)
      toast.success('Offer accepted! The buyer has been notified.')
    } catch {
      toast.error('Failed to accept offer. Please try again.')
    }
  }

  async function handleDeclineOffer(notification) {
    try {
      await updateOfferStatus(notification.offerId, 'rejected')

      // Notify buyer their offer was declined
      if (notification.buyerEmail) {
        await createNotification({
          userId: null, // We don't have buyerId directly on the notification; best effort
          type: 'offer_rejected',
          message: `Your counter offer was declined by the seller.`,
          offerId: notification.offerId,
          listingId: notification.listingId,
        })
      }

      await markAsRead(notification.id)
      toast.success('Offer declined.')
    } catch {
      toast.error('Failed to decline offer. Please try again.')
    }
  }

  async function handleNotificationClick(notification) {
    if (!notification.read) {
      await markAsRead(notification.id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-sm text-blue-800 font-medium hover:underline"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-5 rounded-full mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">You'll see activity here when buyers or sellers interact with your listings.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                  !notification.read
                    ? 'border-blue-300 border-l-4 border-l-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Counter offer */}
                {notification.type === 'counter_offer' && (
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Counter Offer Received</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                      )}
                    </div>
                    {notification.offerId && !notification.read && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={e => { e.stopPropagation(); handleAcceptOffer(notification) }}
                          className="flex-1 bg-emerald-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeclineOffer(notification) }}
                          className="flex-1 bg-red-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{timeAgo(notification.createdAt)}</p>
                  </div>
                )}

                {/* Offer accepted */}
                {notification.type === 'offer_accepted' && (
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-700 mb-1">Offer Accepted</p>
                        <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                        {notification.buyerEmail && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm font-semibold text-emerald-700">{notification.buyerEmail}</span>
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{timeAgo(notification.createdAt)}</p>
                  </div>
                )}

                {/* Offer rejected */}
                {notification.type === 'offer_rejected' && (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-600 mb-1">Counter Offer Declined</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{timeAgo(notification.createdAt)}</p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                )}

                {/* Contact info */}
                {notification.type === 'contact_info' && (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 mb-1">Contact Information</p>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      {notification.buyerEmail && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm font-semibold text-emerald-700">{notification.buyerEmail}</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{timeAgo(notification.createdAt)}</p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                )}

                {/* Generic / fallback */}
                {!['counter_offer', 'offer_accepted', 'offer_rejected', 'contact_info'].includes(notification.type) && (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.createdAt)}</p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default NotificationsPage
