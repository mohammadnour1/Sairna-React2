import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTripSeats } from '@/hooks/queries/useTrips'
import { useCreateBooking } from '@/hooks/mutations/useBookingMutations'
import { useBookingFlow } from '@/hooks/useBookingFlow'
import { validatePassenger } from '@/utils/validation'
import BookingControls from './BookingControls'
import BookingHeader from './BookingHeader'
import BookingSummary from './BookingSummary'
import PassengerStage from './PassengerStage'
import ReviewStage from './ReviewStage'
import SeatStage from './SeatStage'

/**
 * The 3-step booking wizard for one trip. Rendered with `key={tripId}` so each trip gets fresh state.
 * @param {{ trip: object, requestedPeople: number, backTo: string }} props
 */
export default function BookingFlow({ trip, requestedPeople, backTo }) {
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const flow = useBookingFlow(trip.id, { requestedPeople, maxSeats: trip.availableSeats })
  const seatsQuery = useTripSeats(trip.id, { live: flow.step === 'seats' })
  const [errors, setErrors] = useState([])
  const [fields] = useState(() => new Map()) // passenger inputs, to focus the first invalid one

  const createBooking = useCreateBooking({
    tripId: trip.id,
    onSuccessCleanup: flow.clearDraft,
    onSeatConflict: () => flow.goTo('seats'),
  })

  // Seats taken by someone else (fresh seat map) are removed from the selection.
  // If that happens after the seats step, the traveller is sent back to pick replacements.
  // Skipped once our own booking succeeded: the refreshed map then shows OUR seats as booked.
  const { dropSeats, goTo, selectedSeats, step } = flow
  const bookingDone = createBooking.isSuccess
  useEffect(() => {
    if (bookingDone) return
    const booked = new Set(seatsQuery.data?.seats.filter((s) => s.status === 'booked').map((s) => s.number) ?? [])
    const lost = selectedSeats.filter((s) => booked.has(s))
    if (!lost.length) return
    dropSeats(lost)
    if (step !== 'seats') {
      showToast('في مقعد انحجز قبل شوي، اختار مقعد بديل.', 'error')
      goTo('seats')
    }
  }, [seatsQuery.data, selectedSeats, step, bookingDone, dropSeats, goTo, showToast])

  const toggleSeat = (seat) => {
    if (!flow.selectedSeats.includes(seat) && flow.selectedSeats.length >= flow.people) {
      showToast(`مسموح تختار ${flow.people} مقعد فقط.`, 'error')
      return
    }
    flow.toggleSeat(seat)
  }

  const validatePassengers = () => {
    const all = flow.passengers.map(validatePassenger)
    setErrors(all)
    const i = all.findIndex((e) => Object.keys(e).length)
    if (i === -1) return true
    const field = all[i].name ? 'name' : 'phone'
    fields.get(`${i}.${field}`)?.focus()
    showToast(field === 'name' ? 'أدخل اسم كل مسافر (3 أحرف على الأقل).' : 'أدخل رقم هاتف صحيح لكل مسافر.', 'error')
    return false
  }

  const next = () => {
    // Safety net: never move forward (or submit) with fewer seats than travellers.
    if (flow.step !== 'seats' && flow.selectedSeats.length !== flow.people) {
      showToast(`لازم تختار ${flow.people} مقعد قبل المتابعة.`, 'error')
      flow.goTo('seats')
      return
    }
    if (flow.step === 'seats') {
      if (flow.selectedSeats.length !== flow.people) {
        showToast(`لازم تختار ${flow.people} مقعد قبل المتابعة.`, 'error')
        return
      }
      flow.goTo('passengers', user?.name)
    } else if (flow.step === 'passengers') {
      if (validatePassengers()) flow.goTo('review')
    } else if (!isAuthenticated) {
      showToast('سجّل دخولك أولاً لإتمام الحجز.')
      navigate('/login', { state: { from: location } })
    } else {
      createBooking.mutate({
        tripId: trip.id,
        seats: flow.seatsSorted.map((seatNumber, i) => ({
          seatNumber,
          passengerName: flow.passengers[i].name.trim(),
          passengerPhone: flow.passengers[i].phone.trim(),
        })),
      })
    }
  }

  const back = () => flow.goTo(flow.step === 'review' ? 'passengers' : 'seats')

  return (
    <main className="min-h-[70vh]">
      <BookingHeader step={flow.step} backTo={backTo} />
      <section className="site-container grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[21px] pb-[90px] max-lg:grid-cols-[minmax(0,1fr)_282px] max-md:grid-cols-1 max-sm:gap-[13px] max-sm:pb-[55px]">
        <div className="min-w-0 rounded-[20px] border border-border bg-surface p-[29px] shadow-card max-sm:rounded-[15px] max-sm:p-[17px]">
          {flow.step === 'seats' && (
            <SeatStage
              seatsQuery={seatsQuery}
              selected={flow.selectedSeats}
              selectedSorted={flow.seatsSorted}
              people={flow.people}
              onToggle={toggleSeat}
            />
          )}
          {flow.step === 'passengers' && (
            <PassengerStage
              seats={flow.seatsSorted}
              passengers={flow.passengers}
              errors={errors}
              onChange={(i, field, value) => {
                flow.setPassenger(i, field, value)
                if (errors[i]?.[field]) setErrors((all) => all.map((e, j) => (j === i ? { ...e, [field]: undefined } : e)))
              }}
              registerRef={(i, field, el) => (el ? fields.set(`${i}.${field}`, el) : fields.delete(`${i}.${field}`))}
            />
          )}
          {flow.step === 'review' && <ReviewStage seats={flow.seatsSorted} passengers={flow.passengers} />}
          <BookingControls step={flow.step} backTo={backTo} onBack={back} onNext={next} loading={createBooking.isPending} />
        </div>
        <BookingSummary trip={trip} people={flow.people} seats={flow.seatsSorted} />
      </section>
    </main>
  )
}
