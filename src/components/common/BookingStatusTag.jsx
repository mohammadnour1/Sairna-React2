import { Ban, CircleCheck, Clock, Info } from 'lucide-react'
import Tag from '@/components/ui/Tag'

/**
 * Status pill for a booking. Real statuses: CONFIRMED, CANCELLED (docs/api/API_NOTES.md).
 * A confirmed booking whose trip already left is shown as finished.
 * @param {{ booking: { status: string, isCancelled: boolean }, departed?: boolean }} props
 */
export default function BookingStatusTag({ booking, departed = false }) {
  if (booking.isCancelled)
    return (
      <Tag tone="danger" icon={Ban}>
        ملغى
      </Tag>
    )
  if (booking.status === 'CONFIRMED' && departed)
    return (
      <Tag tone="muted" icon={Clock}>
        رحلة منتهية
      </Tag>
    )
  if (booking.status === 'CONFIRMED')
    return (
      <Tag tone="success" icon={CircleCheck}>
        تم تأكيد الحجز
      </Tag>
    )
  return (
    <Tag tone="muted" icon={Info}>
      {booking.status}
    </Tag>
  )
}
