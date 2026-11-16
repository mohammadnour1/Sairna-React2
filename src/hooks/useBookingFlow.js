import { useCallback, useEffect, useReducer } from 'react'
import { readJSON, remove, writeJSON } from '@/utils/storage'
import { MAX_PEOPLE } from '@/utils/validation'

export const BOOKING_STEPS = [
  { key: 'seats', label: 'اختيار المقاعد' },
  { key: 'passengers', label: 'بيانات المسافرين' },
  { key: 'review', label: 'المراجعة والتأكيد' },
]

const draftKey = (tripId) => `sairna-booking-draft:${tripId}`
const emptyPassenger = () => ({ name: '', phone: '' })

/** Sorted COPY of the seat numbers — never sorts state in place (bug B5). */
export const sortedSeats = (seats) => [...seats].sort((a, b) => a - b)

function clampPeople(n, maxSeats) {
  const max = Math.min(MAX_PEOPLE, maxSeats ?? MAX_PEOPLE)
  return Math.max(1, Math.min(Number(n) || 1, Math.max(1, max)))
}

function reducer(state, action) {
  switch (action.type) {
    case 'setPeople': {
      const people = action.people
      return {
        ...state,
        people,
        // Keep only the first N chosen seats when the number of travellers drops.
        selectedSeats: state.selectedSeats.slice(0, people),
        passengers: Array.from({ length: people }, (_, i) => state.passengers[i] ?? emptyPassenger()),
      }
    }
    case 'toggleSeat': {
      const has = state.selectedSeats.includes(action.seat)
      if (has) return { ...state, selectedSeats: state.selectedSeats.filter((s) => s !== action.seat) }
      if (state.selectedSeats.length >= state.people) return state
      return { ...state, selectedSeats: [...state.selectedSeats, action.seat] }
    }
    case 'dropSeats': {
      const drop = new Set(action.seats)
      const kept = state.selectedSeats.filter((s) => !drop.has(s))
      return kept.length === state.selectedSeats.length ? state : { ...state, selectedSeats: kept }
    }
    case 'setPassenger': {
      const passengers = state.passengers.map((p, i) => (i === action.index ? { ...p, [action.field]: action.value } : p))
      return { ...state, passengers }
    }
    case 'goTo': {
      let { passengers } = state
      // Prefill the first traveller with the signed-in user's name the first time.
      if (action.step === 'passengers' && action.prefillName && !passengers[0]?.name) {
        passengers = passengers.map((p, i) => (i === 0 ? { ...p, name: action.prefillName } : p))
      }
      return { ...state, step: action.step, passengers }
    }
    default:
      return state
  }
}

function init({ tripId, people }) {
  const draft = readJSON(draftKey(tripId), null, 'session')
  const base = draft ?? { step: 'seats', selectedSeats: [], passengers: [] }
  return reducer({ ...base, people: base.people ?? people, passengers: base.passengers ?? [] }, { type: 'setPeople', people })
}

/**
 * Booking wizard state (seats → passengers → review) for one trip.
 * Saved as a sessionStorage draft so going back, refreshing, or a detour through /login
 * never loses the chosen seats or typed passenger data (bugs B6/B7).
 *
 * @param {number} tripId
 * @param {{ requestedPeople: number, maxSeats: number|null }} options
 */
export function useBookingFlow(tripId, { requestedPeople, maxSeats }) {
  const people = clampPeople(requestedPeople, maxSeats)
  const [state, dispatch] = useReducer(reducer, { tripId, people }, init)

  // The ?people= param or the available seats can change after mount.
  useEffect(() => {
    if (people !== state.people) dispatch({ type: 'setPeople', people })
  }, [people, state.people])

  useEffect(() => {
    writeJSON(draftKey(tripId), state, 'session')
  }, [tripId, state])

  const clearDraft = useCallback(() => remove(draftKey(tripId), 'session'), [tripId])

  // `dispatch` is stable, so these callbacks are too (safe in effect dependencies).
  const toggleSeat = useCallback((seat) => dispatch({ type: 'toggleSeat', seat }), [])
  const dropSeats = useCallback((seats) => dispatch({ type: 'dropSeats', seats }), [])
  const setPassenger = useCallback((index, field, value) => dispatch({ type: 'setPassenger', index, field, value }), [])
  const goTo = useCallback((step, prefillName) => dispatch({ type: 'goTo', step, prefillName }), [])

  return {
    ...state,
    seatsSorted: sortedSeats(state.selectedSeats),
    toggleSeat,
    dropSeats,
    setPassenger,
    goTo,
    clearDraft,
  }
}
