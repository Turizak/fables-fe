import { describe, it, expect } from 'vitest'
import { validate } from '../utils/create-account-validation'
import type { FormType } from '~/types/types'

describe('Form Validation', () => {
  const createFormState = (overrides = {}): FormType => ({
    email: '',
    createPassword: '',
    confirmPassword: '',
    ...overrides
  })

  it('should return all required field errors when form is empty', () => {
    const state = createFormState()
    const errors = validate(state)

    expect(errors).toHaveLength(5)
    expect(errors).toContainEqual({ path: 'email', message: 'Required' })
    expect(errors).toContainEqual({ path: 'createPassword', message: 'Required' })
    expect(errors).toContainEqual({ path: 'confirmPassword', message: 'Required' })
  })

  it('should validate email format', () => {
    // Invalid email
    const invalidState = createFormState({ email: 'invalid-email' })
    const invalidErrors = validate(invalidState)
    expect(invalidErrors).toContainEqual({ path: 'email', message: 'Invalid email address' })

    // Valid email
    const validState = createFormState({ email: 'test@example.com' })
    const validErrors = validate(validState)
    expect(validErrors).not.toContainEqual({ path: 'email', message: 'Invalid email address' })
  })

  it('should validate password requirements', () => {
    // Invalid password (too short)
    const shortPasswordState = createFormState({ createPassword: 'Weak1!' })
    const shortPasswordErrors = validate(shortPasswordState)
    expect(shortPasswordErrors).toContainEqual({
      path: 'createPassword',
      message: 'Password does not meet requirements'
    })

    // Valid password
    const validPasswordState = createFormState({
      createPassword: 'StrongPass123!@#'
    })
    const validPasswordErrors = validate(validPasswordState)
    expect(validPasswordErrors).not.toContainEqual({
      path: 'createPassword',
      message: 'Password does not meet requirements'
    })
  })

  it('should validate password confirmation match', () => {
    // Mismatched passwords
    const mismatchedState = createFormState({
      createPassword: 'StrongPass123!@#',
      confirmPassword: 'DifferentPass123!@#'
    })
    const mismatchedErrors = validate(mismatchedState)
    expect(mismatchedErrors).toContainEqual({
      path: 'confirmPassword',
      message: 'Passwords do not match'
    })

    // Matching passwords
    const matchingState = createFormState({
      createPassword: 'StrongPass123!@#',
      confirmPassword: 'StrongPass123!@#'
    })
    const matchingErrors = validate(matchingState)
    expect(matchingErrors).not.toContainEqual({
      path: 'confirmPassword',
      message: 'Passwords do not match'
    })
  })

  it('should validate a completely valid form with no errors', () => {
    const validState = createFormState({
      email: 'test@example.com',
      createPassword: 'StrongPass123!@#',
      confirmPassword: 'StrongPass123!@#'
    })
    const errors = validate(validState)
    expect(errors).toHaveLength(0)
  })

  it('should validate various email formats', () => {
    const testCases = [
      { email: 'test@example.com', valid: true },
      { email: 'test.name@example.co.uk', valid: true },
      { email: 'test+label@example.com', valid: true },
      { email: 'invalid@email', valid: false },
      { email: '@example.com', valid: false },
      { email: 'test@.com', valid: false }
    ]

    testCases.forEach(({ email, valid }) => {
      const state = createFormState({ email })
      const errors = validate(state)
      const hasEmailFormatError = errors.some(
        error => error.path === 'email' && error.message === 'Invalid email address'
      )
      expect(hasEmailFormatError).toBe(!valid)
    })
  })
})