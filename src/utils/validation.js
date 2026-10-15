export function isValidUniversityEmail(email) {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim().toLowerCase()
  return /^[^@\s]+@[^@\s]+\.edu$/.test(trimmed)
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6
}

export function validateListing(data) {
  const errors = []
  if (!data.course) errors.push('Course is required')
  if (!data.type) errors.push('Type is required')
  if (!data.description || data.description.trim().length < 10)
    errors.push('Description must be at least 10 characters')
  if (data.price === undefined || data.price === null || isNaN(Number(data.price)))
    errors.push('Price is required')
  if (Number(data.price) < 0) errors.push('Price cannot be negative')
  return { valid: errors.length === 0, errors }
}

export function validateOffer(offeredPrice, originalPrice) {
  const offered = Number(offeredPrice)
  if (!offeredPrice || isNaN(offered)) return { valid: false, error: 'Enter a valid price' }
  if (offered <= 0) return { valid: false, error: 'Offer must be greater than 0' }
  if (offered >= originalPrice) return { valid: false, error: 'Counter offer must be lower than the listed price' }
  return { valid: true, error: null }
}
