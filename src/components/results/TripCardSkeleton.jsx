import Skeleton from '@/components/ui/Skeleton'

/** Placeholder with the same shape as TripCard while trips load. */
export default function TripCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[17px] border border-border bg-surface" aria-hidden="true">
      <div className="flex items-center gap-[11px] px-[23px] pt-[19px] pb-[13px]">
        <Skeleton className="size-[49px] rounded-[14px]" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_180px] items-center gap-3.5 px-[23px] pt-3.5 pb-[23px] max-sm:grid-cols-1">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="border-t border-border px-[23px] py-[11px]">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}
