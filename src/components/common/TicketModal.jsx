import { useId, useRef } from 'react'
import { ArrowLeft, Ban, Copy, Ticket, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import IconButton from '@/components/ui/IconButton'
import Modal from '@/components/ui/Modal'
import BookingStatusTag from './BookingStatusTag'
import { useToast } from '@/context/ToastContext'
import { formatDate, formatMoney, formatSeats, formatTime } from '@/utils/format'

/**
 * Ticket details dialog (reference `showTicket()`), built on the accessible Modal (bug B15).
 * @param {{ booking: object|null, open: boolean, onClose: () => void, cancellable: boolean,
 *           departed: boolean, onCancel: () => void }} props
 */
export default function TicketModal({ booking, open, onClose, cancellable, departed, onCancel }) {
  const titleId = useId()
  const closeRef = useRef(null)
  const { showToast } = useToast()
  if (!booking) return null
  const { trip } = booking

  const copyCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(booking.code)
        .then(() => showToast('تم نسخ رقم الحجز.'))
        .catch(() => showToast(`رقم الحجز: ${booking.code}`))
    } else showToast(`رقم الحجز: ${booking.code}`)
  }

  const meta = [
    ['شركة النقل', trip?.company.name ?? '—'],
    ['التاريخ', formatDate(trip?.date)],
    ['الموعد', formatTime(trip?.departureTime), true],
    ['المقاعد', booking.isCancelled ? '—' : formatSeats(booking.seatNumbers)],
    ['الإجمالي', formatMoney(booking.total)],
  ]

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} initialFocusRef={closeRef}>
      <IconButton ref={closeRef} label="إغلاق" onClick={onClose} sizeClass="size-[33px]" className="absolute end-3.5 top-[13px] z-2">
        <Icon icon={X} size={22} />
      </IconButton>
      <div className="flex items-center gap-2.5 bg-[linear-gradient(110deg,#0d4655,#0b9286)] p-[30px] text-white">
        <Icon icon={Ticket} size={30} />
        <span id={titleId} className="text-base font-black">
          تذكرتك مع سيرنا
        </span>
        <strong dir="ltr" className="ms-auto text-sm opacity-55">
          SAIRNA
        </strong>
      </div>
      <div className="p-7">
        <div className="flex items-center justify-between">
          <small className="text-muted">رقم الحجز</small>
          <strong dir="ltr" className="text-[19px]">
            {booking.code}
          </strong>
        </div>
        <div className="mt-2 flex justify-end">
          <BookingStatusTag booking={booking} departed={departed} />
        </div>
        <div className="my-[23px] flex items-center justify-between gap-2.5 text-[22px] font-black text-text max-sm:text-lg">
          <span>{trip?.origin.name}</span>
          <Icon icon={ArrowLeft} size={24} className="text-primary" />
          <span>{trip?.destination.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-[15px] border-y border-dashed border-border py-[19px]">
          {meta.map(([label, value, ltr]) => (
            <span key={label} className="flex flex-col text-[10px] text-muted">
              {label}
              <b className="mt-[3px] text-xs text-text" dir={ltr ? 'ltr' : undefined}>
                <span className={ltr ? 'block text-end' : undefined}>{value}</span>
              </b>
            </span>
          ))}
        </div>
        <p className="my-[17px] text-center text-[10px]">تذكرة توضيحية — غير صالحة للسفر أو الدفع.</p>
        <Button variant="outline" fullWidth iconStart={Copy} onClick={copyCode}>
          نسخ رقم الحجز
        </Button>
        {cancellable && (
          <Button variant="dangerOutline" fullWidth iconStart={Ban} onClick={onCancel} className="mt-2.5">
            إلغاء الحجز
          </Button>
        )}
      </div>
    </Modal>
  )
}
