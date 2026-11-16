/**
 * Green live dot + status line + booking code (reference `.tracking-status`).
 * @param {{ arrived: boolean, code: string }} props
 */
export default function TrackingStatus({ arrived, code }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#10966f] max-md:col-span-full">
      <span className="size-[9px] animate-pulse rounded-full bg-[#13b98d] shadow-[0_0_0_4px_#e3f7ee]" aria-hidden="true" />
      {arrived ? 'انتهت الرحلة التجريبية' : 'الرحلة قيد العرض التجريبي'}
      <small dir="ltr" className="ms-auto font-bold text-muted">
        {code}
      </small>
    </div>
  )
}
