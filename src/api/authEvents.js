// A tiny event emitter so the axios layer (no React) can tell AuthContext that the session expired.
const listeners = new Map()

export const authEvents = {
  on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set())
    listeners.get(event).add(handler)
    return () => listeners.get(event)?.delete(handler)
  },
  emit(event, payload) {
    listeners.get(event)?.forEach((handler) => handler(payload))
  },
}
