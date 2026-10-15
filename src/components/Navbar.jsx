import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useNotifications from '../hooks/useNotifications'
import { Bell, LogOut, BookOpen, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    try {
      await logout()
      toast.success('Signed out successfully')
      navigate('/')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const displayEmail = currentUser?.email
    ? currentUser.email.length > 24
      ? currentUser.email.slice(0, 24) + '...'
      : currentUser.email
    : ''

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-blue-800 font-bold text-lg hover:text-blue-700 transition-colors"
          >
            <BookOpen className="w-6 h-6" />
            <span>UniNotes</span>
          </Link>

          {/* Middle: Nav links (hidden on small screens) */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/sell"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors"
            >
              Sell
            </Link>
            <Link
              to="/buy"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors"
            >
              Browse
            </Link>
            <Link
              to="/my-listings"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors"
            >
              My Listings
            </Link>
          </div>

          {/* Right: Notifications, email, logout */}
          <div className="flex items-center gap-3">
            <Link
              to="/notifications"
              className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[180px]">
              {displayEmail}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-2 flex flex-col gap-1">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/sell"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors"
          >
            Sell
          </Link>
          <Link
            to="/buy"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors"
          >
            Browse
          </Link>
          <Link
            to="/my-listings"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors"
          >
            My Listings
          </Link>
        </div>
      )}
    </nav>
  )
}
