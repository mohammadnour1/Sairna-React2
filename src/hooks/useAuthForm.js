import { useState } from 'react'
import { useToast } from '@/context/ToastContext'
import { getErrorMessage, getFieldErrors, getStatus } from '@/api/errors'
import { validateAuth } from '@/utils/validation'

const FIELD_ORDER = ['name', 'email', 'password', 'terms']

/**
 * Shared state for the login and register forms:
 * values, client validation, server error → field mapping, focusing the first invalid field.
 *
 * @param {'login'|'register'} mode
 * @param {import('@tanstack/react-query').UseMutationResult} mutation
 */
export function useAuthForm(mode, mutation, initial) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  // Plain Map (not a ref) holding the input elements, used to focus the first invalid field.
  const [fields] = useState(() => new Map())
  const { showToast } = useToast()

  const register = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    ref: (el) => (el ? fields.set(name, el) : fields.delete(name)),
    onChange: (event) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
      setValues((v) => ({ ...v, [name]: value }))
      if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
    },
  })

  const focusFirst = (errs) => {
    const first = FIELD_ORDER.find((f) => errs[f])
    if (first) fields.get(first)?.focus()
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const clientErrors = validateAuth(values, mode)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) {
      focusFirst(clientErrors)
      return
    }
    mutation.mutate(values, {
      onError: (error) => {
        const serverErrors = getFieldErrors(error)
        const status = getStatus(error)
        if (status === 409) serverErrors.email = getErrorMessage(error)
        if (status === 401) serverErrors.password = getErrorMessage(error)
        setErrors(serverErrors)
        focusFirst(serverErrors)
        showToast(getErrorMessage(error), 'error')
      },
    })
  }

  return { values, errors, register, onSubmit }
}
