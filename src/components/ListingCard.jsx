import { Link } from 'react-router-dom'

export function ListingCard({ listing, showActions }) {
  const {
    id,
    sellerName,
    course,
    courseFullName,
    type,
    description,
    price,
    status,
  } = listing

  const isActive = status === 'active'

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
      {/* Sold/Negotiating overlay badge */}
      {!isActive && (
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              status === 'sold'
                ? 'bg-gray-100 text-gray-600 border border-gray-300'
                : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
            }`}
          >
            {status === 'sold' ? 'Sold' : 'Negotiating'}
          </span>
        </div>
      )}

      {/* Badges row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md">
          {course}
        </span>
        <span
          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-md ${
            type === 'mock_test'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {type === 'mock_test' ? 'Mock Test / Past Exam' : 'Class Notes'}
        </span>
      </div>

      {/* Course full name */}
      {courseFullName && (
        <p className="text-xs text-gray-400 mb-2">{courseFullName}</p>
      )}

      {/* Price */}
      <div className="mb-2">
        {price === 0 ? (
          <span className="text-2xl font-bold text-emerald-600">Free</span>
        ) : (
          <span className="text-2xl font-bold text-gray-900">${Number(price).toFixed(2)}</span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-3 overflow-hidden line-clamp-2 flex-1">
        {description}
      </p>

      {/* Seller */}
      <p className="text-xs text-gray-400 mb-4">
        by {sellerName || 'Unknown'}
      </p>

      {/* View details button */}
      <Link
        to={`/listing/${id}`}
        className="mt-auto block text-center bg-blue-800 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Details
      </Link>
    </div>
  )
}

export default ListingCard
