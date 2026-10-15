import { describe, it, expect } from 'vitest'
import { isValidUniversityEmail } from '../utils/validation'

describe('isValidUniversityEmail', () => {
  it('accepts valid .edu emails', () => {
    expect(isValidUniversityEmail('student@university.edu')).toBe(true)
    expect(isValidUniversityEmail('john.doe@college.edu')).toBe(true)
    expect(isValidUniversityEmail('user123@state.edu')).toBe(true)
  })

  it('rejects non-.edu emails', () => {
    expect(isValidUniversityEmail('user@gmail.com')).toBe(false)
    expect(isValidUniversityEmail('user@hotmail.com')).toBe(false)
    expect(isValidUniversityEmail('user@university.com')).toBe(false)
  })

  it('rejects malformed emails', () => {
    expect(isValidUniversityEmail('')).toBe(false)
    expect(isValidUniversityEmail(null)).toBe(false)
    expect(isValidUniversityEmail(undefined)).toBe(false)
    expect(isValidUniversityEmail('notanemail')).toBe(false)
    expect(isValidUniversityEmail('@university.edu')).toBe(false)
  })
})
