import Skeleton from '@/components/ui/Skeleton'

/** Same shape as MyTripCard while bookings load. */
export default function MyTripCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[19px] border border-border bg-surface" aria-hidden="true">
      <div className="flex items-center gap-2.5 bg-surface-alt px-[25px] py-[19px]">
        <Skeleton className="size-[41px] rounded-xl" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="grid grid-cols-[1.1fr_1fr] gap-[25px] px-[25px] py-[30px] max-sm:grid-cols-1">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}
