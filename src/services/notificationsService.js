const KEY = 'uninotes_notifications'
const CHANGE_EVENT = 'uninotes_notification_change'

function getAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
function saveAll(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}
function generateId() {
  return 'notif_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

export async function createNotification({ userId, type, message, offerId, listingId, buyerEmail, sellerEmail }) {
  const items = getAll()
  const notif = {
    id: generateId(),
    userId,
    type,
    message,
    offerId: offerId || null,
    listingId: listingId || null,
    buyerEmail: buyerEmail || null,
    sellerEmail: sellerEmail || null,
    read: false,
    createdAt: Date.now(),
  }
  saveAll([notif, ...items])
  return notif
}

export async function getUserNotifications(userId) {
  return getAll()
    .filter(n => n.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function subscribeToNotifications(userId, callback) {
  function load() {
    const items = getAll()
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
    callback(items)
  }
  load()
  const interval = setInterval(load, 1500)
  window.addEventListener(CHANGE_EVENT, load)
  return () => {
    clearInterval(interval)
    window.removeEventListener(CHANGE_EVENT, load)
  }
}

export async function markAsRead(id) {
  const items = getAll()
  const idx = items.findIndex(n => n.id === id)
  if (idx !== -1) {
    items[idx] = { ...items[idx], read: true }
    saveAll(items)
  }
}

export async function markAllAsRead(userId) {
  const items = getAll().map(n => n.userId === userId ? { ...n, read: true } : n)
  saveAll(items)
}
