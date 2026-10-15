import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { createListing } from '../services/listingsService'
import { COURSES } from '../utils/courses'
import { validateListing } from '../utils/validation'

const STEPS = ['Select Course', 'Type', 'Details & Price', 'Review']

export function SellPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [courseSearch, setCourseSearch] = useState('')
  const [course, setCourse] = useState('')
  const [courseFullName, setCourseFullName] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  const filteredCourses = COURSES.filter(c =>
    c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.name.toLowerCase().includes(courseSearch.toLowerCase())
  )

  function handleCourseSelect(c) {
    setCourse(c.code)
    setCourseFullName(c.name)
    setStep(2)
  }

  function handleTypeSelect(selectedType) {
    setType(selectedType)
    setStep(3)
  }

  function handleStep3Next() {
    const result = validateListing({ course, type, description, price })
    if (!result.valid) {
      setErrors(result.errors)
      return
    }
    setErrors([])
    setStep(4)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      await createListing({
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email,
        sellerName: currentUser.displayName || currentUser.email.split('@')[0],
        course,
        courseFullName,
        type,
        description,
        price: Number(price),
      })
      toast.success('Listing created successfully!')
      navigate('/my-listings')
    } catch {
      toast.error('Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sell Your Notes</h1>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => {
            const n = i + 1
            const active = step === n
            const done = step > n
            return (
              <div key={n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                      done
                        ? 'bg-blue-800 border-blue-800 text-white'
                        : active
                        ? 'bg-white border-blue-800 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {done ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      n
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs hidden sm:block ${
                      active ? 'text-blue-800 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {n < STEPS.length && (
                  <div
                    className={`flex-1 h-0.5 mx-1 ${done ? 'bg-blue-800' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

          {/* Step 1: Select Course */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Select Course</h2>
              <p className="text-gray-500 text-sm mb-5">Which course are you selling notes for?</p>
              <input
                type="text"
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
                placeholder="Search by code or name..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg">
                {filteredCourses.length === 0 ? (
                  <p className="text-sm text-gray-400 px-4 py-3">No courses match your search</p>
                ) : (
                  filteredCourses.map(c => (
                    <button
                      key={c.code}
                      onClick={() => handleCourseSelect(c)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-800 transition-colors"
                    >
                      <span className="font-semibold text-blue-800">{c.code}</span>
                      <span className="text-gray-500"> — {c.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Type */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">What type?</h2>
              <p className="text-gray-500 text-sm mb-5">
                Selling for <span className="font-semibold text-blue-800">{course}</span> — {courseFullName}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleTypeSelect('notes')}
                  className="text-left border-2 border-gray-200 rounded-xl p-5 hover:border-blue-600 hover:bg-blue-50 transition-colors group"
                >
                  <p className="font-semibold text-gray-800 group-hover:text-blue-800 mb-1">Class Notes</p>
                  <p className="text-xs text-gray-500">Lecture notes, summaries, study guides</p>
                </button>
                <button
                  onClick={() => handleTypeSelect('mock_test')}
                  className="text-left border-2 border-gray-200 rounded-xl p-5 hover:border-purple-500 hover:bg-purple-50 transition-colors group"
                >
                  <p className="font-semibold text-gray-800 group-hover:text-purple-700 mb-1">Mock Test / Past Exam</p>
                  <p className="text-xs text-gray-500">Practice exams, past tests, answer sheets</p>
                </button>
              </div>
              <button
                onClick={() => setStep(1)}
                className="mt-5 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 3: Description & Price */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Describe & Price</h2>
              <p className="text-gray-500 text-sm mb-5">
                <span className="font-semibold text-blue-800">{course}</span> —{' '}
                {type === 'notes' ? 'Class Notes' : 'Mock Test / Past Exam'}
              </p>

              {errors.length > 0 && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  {errors.map((err, i) => (
                    <p key={i} className="text-red-600 text-sm">{err}</p>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe what you're selling
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    placeholder="e.g. Comprehensive notes covering chapters 1-8, including diagrams and practice problems..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">Set to $0 to give it away for free</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setErrors([]); setStep(2) }}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleStep3Next}
                  className="flex-1 bg-blue-800 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Review & Submit</h2>
              <p className="text-gray-500 text-sm mb-6">Check your listing details before submitting.</p>

              <dl className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-sm text-gray-500">Course</dt>
                  <dd className="text-sm font-semibold text-gray-800">{course} — {courseFullName}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-sm text-gray-500">Type</dt>
                  <dd className="text-sm font-semibold text-gray-800">
                    {type === 'notes' ? 'Class Notes' : 'Mock Test / Past Exam'}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-sm text-gray-500">Price</dt>
                  <dd className="text-sm font-semibold text-gray-800">
                    {Number(price) === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `$${Number(price).toFixed(2)}`
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 mb-1">Description</dt>
                  <dd className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {description}
                  </dd>
                </div>
              </dl>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-800 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loading && (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  )}
                  Submit Listing
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SellPage
