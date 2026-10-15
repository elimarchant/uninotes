import { MOCK_LISTINGS } from '../utils/mockData'

const KEY = 'uninotes_listings'

function getAll() {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored) return JSON.parse(stored)
    // Seed with mock data on first load
    localStorage.setItem(KEY, JSON.stringify(MOCK_LISTINGS))
    return MOCK_LISTINGS
  } catch {
    return MOCK_LISTINGS
  }
}

function saveAll(listings) {
  localStorage.setItem(KEY, JSON.stringify(listings))
}

function generateId() {
  return 'listing_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

export async function createListing(data) {
  const listings = getAll()
  const listing = {
    id: generateId(),
    sellerId: data.sellerId,
    sellerEmail: data.sellerEmail,
    sellerName: data.sellerName,
    course: data.course,
    courseFullName: data.courseFullName,
    type: data.type,
    description: data.description,
    price: Number(data.price),
    status: 'active',
    createdAt: Date.now(),
  }
  saveAll([listing, ...listings])
  return listing
}

export async function getListingsByCourse(course) {
  return getAll().filter(l => l.course === course && l.status === 'active')
}

export async function getListingsByCourseAndType(course, type) {
  return getAll().filter(l => l.course === course && l.type === type && l.status === 'active')
}

export async function getUserListings(userId) {
  return getAll()
    .filter(l => l.sellerId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function getListingById(id) {
  return getAll().find(l => l.id === id) || null
}

export async function updateListingStatus(id, status) {
  const listings = getAll()
  const idx = listings.findIndex(l => l.id === id)
  if (idx !== -1) {
    listings[idx] = { ...listings[idx], status }
    saveAll(listings)
  }
}

export async function deleteListing(id) {
  saveAll(getAll().filter(l => l.id !== id))
}
