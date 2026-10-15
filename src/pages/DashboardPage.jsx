import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Tag, ListChecks, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export function DashboardPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const displayName =
    currentUser?.displayName ||
    currentUser?.email?.split('@')[0] ||
    'there'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-500 mt-2 text-lg">What would you like to do today?</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Sell Card */}
          <div className="bg-blue-700 rounded-2xl p-8 flex flex-col items-start shadow-lg">
            <div className="bg-blue-600 p-4 rounded-xl mb-5">
              <Tag className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sell Your Notes</h2>
            <p className="text-blue-200 text-sm mb-6 leading-relaxed">
              List your class notes, papers, or past exams for sale and earn money from your hard work.
            </p>
            <button
              onClick={() => navigate('/sell')}
              className="bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              Start Selling
            </button>
          </div>

          {/* Buy Card */}
          <div className="bg-emerald-600 rounded-2xl p-8 flex flex-col items-start shadow-lg">
            <div className="bg-emerald-500 p-4 rounded-xl mb-5">
              <ShoppingCart className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Find Notes</h2>
            <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
              Browse class notes and past exams from other students to help you study smarter.
            </p>
            <button
              onClick={() => navigate('/buy')}
              className="bg-white text-emerald-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors text-sm"
            >
              Browse Now
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/my-listings"
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-800 shadow-sm transition-colors"
          >
            <ListChecks className="w-4 h-4" />
            View My Listings
          </Link>
          <Link
            to="/notifications"
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-800 shadow-sm transition-colors"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </Link>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
