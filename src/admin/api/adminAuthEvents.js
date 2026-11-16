// Separate from the passenger `authEvents`: an expired ADMIN token must never sign out a passenger.
const listeners = new Set()

export const adminAuthEvents = {
  /** Subscribe to "the admin token was rejected". Returns an unsubscribe function. */
  onUnauthorized(handler) {
    listeners.add(handler)
    return () => listeners.delete(handler)
  },
  emitUnauthorized() {
    listeners.forEach((handler) => handler())
  },
}
