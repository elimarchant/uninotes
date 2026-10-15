import { describe, it, expect } from 'vitest'
import { validateOffer } from '../utils/validation'

describe('validateOffer', () => {
  it('accepts valid counter offer below original price', () => {
    const result = validateOffer(15, 20)
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('rejects offer at zero or below', () => {
    expect(validateOffer(0, 20).valid).toBe(false)
    expect(validateOffer(-5, 20).valid).toBe(false)
  })

  it('rejects offer equal to or above original price', () => {
    expect(validateOffer(20, 20).valid).toBe(false)
    expect(validateOffer(25, 20).valid).toBe(false)
  })

  it('rejects empty or invalid input', () => {
    expect(validateOffer('', 20).valid).toBe(false)
    expect(validateOffer(null, 20).valid).toBe(false)
    expect(validateOffer('abc', 20).valid).toBe(false)
  })
})
