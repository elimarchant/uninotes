import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ListingCard from '../components/ListingCard'
import { COURSES } from '../utils/courses'
import { getListingsByCourseAndType } from '../services/listingsService'

export function BuyPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [courseSearch, setCourseSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedType, setSelectedType] = useState('')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)

  const filteredCourses = COURSES.filter(c =>
    c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.name.toLowerCase().includes(courseSearch.toLowerCase())
  )

  function handleCourseSelect(c) {
    setSelectedCourse(c)
    setStep(2)
  }

  async function handleTypeSelect(type) {
    setSelectedType(type)
    setLoading(true)
    try {
      const results = await getListingsByCourseAndType(selectedCourse.code, type)
      setListings(results)
    } catch {
      setListings([])
    } finally {
      setLoading(false)
      setStep(3)
    }
  }

  function handleBackToStep1() {
    setCourseSearch('')
    setSelectedCourse(null)
    setStep(1)
  }

  function handleBackToStep2() {
    setSelectedType('')
    setListings([])
    setStep(2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Step 1: Select course */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Notes for Your Course</h1>
            <p className="text-gray-500 text-sm mb-6">Search and select the course you need notes for.</p>

            <input
              type="text"
              value={courseSearch}
              onChange={e => setCourseSearch(e.target.value)}
              placeholder="Search by course code or name..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCourses.length === 0 ? (
                <p className="text-sm text-gray-400 col-span-2 py-4 text-center">No courses match your search</p>
              ) : (
                filteredCourses.map(c => (
                  <button
                    key={c.code}
                    onClick={() => handleCourseSelect(c)}
                    className="text-left border border-gray-200 bg-white rounded-xl px-4 py-3 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800 transition-colors shadow-sm group"
                  >
                    <span className="block font-semibold text-sm group-hover:text-blue-800 text-blue-800">{c.code}</span>
                    <span className="block text-xs text-gray-500 group-hover:text-blue-600">{c.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select type */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">What are you looking for?</h1>
            {selectedCourse && (
              <p className="text-sm text-blue-800 font-medium mb-5">
                {selectedCourse.code} — {selectedCourse.name}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleTypeSelect('notes')}
                className="text-left border-2 border-gray-200 bg-white rounded-xl p-5 hover:border-blue-600 hover:bg-blue-50 transition-colors group"
              >
                <p className="font-semibold text-gray-800 group-hover:text-blue-800 mb-1">Class Notes</p>
                <p className="text-xs text-gray-500">Lecture notes, summaries, study guides</p>
              </button>
              <button
                onClick={() => handleTypeSelect('mock_test')}
                className="text-left border-2 border-gray-200 bg-white rounded-xl p-5 hover:border-purple-500 hover:bg-purple-50 transition-colors group"
              >
                <p className="font-semibold text-gray-800 group-hover:text-purple-700 mb-1">Mock Test / Past Exams</p>
                <p className="text-xs text-gray-500">Practice exams, past tests, answer sheets</p>
              </button>
            </div>

            <button
              onClick={handleBackToStep1}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Back to courses
            </button>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}
              </h1>
              {selectedCourse && selectedType && (
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium text-blue-800">{selectedCourse.code}</span>
                  {' '}&mdash;{' '}
                  {selectedType === 'notes' ? 'Class Notes' : 'Mock Test / Past Exam'}
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-gray-500 font-medium mb-1">No listings yet for this course.</p>
                <p className="text-gray-400 text-sm">Check back later or list your own notes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            <button
              onClick={handleBackToStep2}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Back to type selection
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default BuyPage
