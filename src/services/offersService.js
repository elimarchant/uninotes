const KEY = 'uninotes_offers'

function getAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
function saveAll(offers) {
  localStorage.setItem(KEY, JSON.stringify(offers))
}
function generateId() {
  return 'offer_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

export async function createOffer(data) {
  const offers = getAll()
  const offer = {
    id: generateId(),
    listingId: data.listingId,
    buyerId: data.buyerId,
    buyerEmail: data.buyerEmail,
    buyerName: data.buyerName,
    sellerId: data.sellerId,
    originalPrice: data.originalPrice,
    offeredPrice: data.offeredPrice,
    status: 'pending',
    createdAt: Date.now(),
  }
  saveAll([offer, ...offers])
  return offer
}

export async function getOffersByListing(listingId) {
  return getAll().filter(o => o.listingId === listingId)
}

export async function getOffersByBuyer(buyerId) {
  return getAll().filter(o => o.buyerId === buyerId)
}

export async function getOfferById(id) {
  return getAll().find(o => o.id === id) || null
}

export async function updateOfferStatus(id, status) {
  const offers = getAll()
  const idx = offers.findIndex(o => o.id === id)
  if (idx !== -1) {
    offers[idx] = { ...offers[idx], status }
    saveAll(offers)
  }
}

export async function getBuyerOfferForListing(buyerId, listingId) {
  return getAll().find(o => o.buyerId === buyerId && o.listingId === listingId) || null
}
