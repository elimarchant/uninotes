import { describe, it, expect } from 'vitest'
import { validateListing } from '../utils/validation'

describe('validateListing', () => {
  const validListing = {
    course: 'MATH101',
    type: 'notes',
    description: 'Complete set of lecture notes for the semester',
    price: 10,
  }

  it('accepts a valid listing', () => {
    const result = validateListing(validListing)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects listing with no course', () => {
    const result = validateListing({ ...validListing, course: '' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Course is required')
  })

  it('rejects listing with short description', () => {
    const result = validateListing({ ...validListing, description: 'short' })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('Description'))).toBe(true)
  })

  it('rejects listing with negative price', () => {
    const result = validateListing({ ...validListing, price: -5 })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Price cannot be negative')
  })

  it('accepts price of 0 (free listing)', () => {
    const result = validateListing({ ...validListing, price: 0 })
    expect(result.valid).toBe(true)
  })
})
