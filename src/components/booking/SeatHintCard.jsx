import { Armchair } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * Side card with the selection counter and seat tags (reference `.seat-hint-card`).
 * @param {{ seats: number[], people: number }} props — `seats` is already sorted
 */
export default function SeatHintCard({ seats, people }) {
  return (
    <div className="rounded-[17px] border border-border p-[22px] max-sm:p-[15px]">
      <span className="mb-[13px] grid size-[50px] place-items-center rounded-[15px] bg-soft-teal text-primary">
        <Icon icon={Armchair} size={24} />
      </span>
      <h3 className="mt-0 mb-[5px] text-base">مكانك، راحتك.</h3>
      <p className="text-[11px] leading-[2]">اختار مقعدك حسب تفضيلك. المكان عند الشباك أو بالممر، الخيار إلك.</p>
      <div className="flex items-center justify-between border-t border-border pt-[17px] text-[11px]">
        <span>المقاعد المختارة</span>
        <strong className="text-base text-primary" aria-live="polite">
          {seats.length} / {people}
        </strong>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {seats.length ? (
          seats.map((n) => (
            <span key={n} className="rounded-[7px] bg-soft-teal px-2.5 py-[5px] text-[10px] font-extrabold text-primary-deep">
              مقعد {n}
            </span>
          ))
        ) : (
          <span className="text-muted">لسا ما اخترت مقعد</span>
        )}
      </div>
    </div>
  )
}
