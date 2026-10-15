import { describe, it, expect } from 'vitest'
import { isValidPassword } from '../utils/validation'

describe('isValidPassword', () => {
  it('accepts passwords of 6 or more characters', () => {
    expect(isValidPassword('abc123')).toBe(true)
    expect(isValidPassword('verylongpassword')).toBe(true)
  })

  it('rejects passwords shorter than 6 characters', () => {
    expect(isValidPassword('ab12')).toBe(false)
    expect(isValidPassword('')).toBe(false)
  })
})
