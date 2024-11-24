import { describe, it, expect } from 'vitest'
import { loginValidate } from '../utils/validation/login-validation';
import type { FormData } from '~/types/types'
import type { FormError } from "#ui/types";

describe('validate function', () => {
  it('should return errors when email and password are missing', () => {
    const formData: FormData = { email: '', password: '' }
    const errors: FormError[] = loginValidate(formData)
    expect(errors).toEqual([
      { path: 'email', message: 'Required' },
      { path: 'email', message: 'Invalid email address' },
      { path: 'password', message: 'Required' }
    ])
  })

  it('should return an error for invalid email format', () => {
    const formData: FormData = { email: 'invalid-email', password: 'Testing123!@' }
    const errors: FormError[] = loginValidate(formData)
    expect(errors).toEqual([
      { path: 'email', message: 'Invalid email address' }
    ])
  })

  it('should return an error when password is missing', () => {
    const formData: FormData = { email: 'test@example.com', password: '' }
    const errors: FormError[] = loginValidate(formData)
    expect(errors).toEqual([
      { path: 'password', message: 'Required' }
    ])
  })

  it('should return no errors for valid email and password', () => {
    const formData: FormData = { email: 'test@example.com', password: 'Testing123!@' }
    const errors: FormError[] = loginValidate(formData)
    expect(errors).toEqual([])
  })
})
