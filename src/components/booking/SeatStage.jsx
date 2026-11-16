import { Armchair } from 'lucide-react'
import InfoNote from '@/components/ui/InfoNote'
import Skeleton from '@/components/ui/Skeleton'
import QueryState from '@/components/common/QueryState'
import SeatHintCard from './SeatHintCard'
import SeatMap from './SeatMap'
import StageHead from './StageHead'

/**
 * Step 1: choose seats (reference `seatStage()`).
 * @param {{ seatsQuery: object, selected: number[], selectedSorted: number[], people: number,
 *           onToggle: (n:number) => void }} props
 */
export default function SeatStage({ seatsQuery, selected, selectedSorted, people, onToggle }) {
  return (
    <>
      <StageHead
        title="اختار مكانك المفضّل"
        icon={Armchair}
        text={`اختار ${people} ${people === 1 ? 'مقعد' : 'مقاعد'} من المخطط. المقاعد الرمادية محجوزة مسبقاً.`}
      />
      <div className="grid grid-cols-[minmax(270px,1fr)_minmax(190px,.8fr)] gap-[26px] max-lg:gap-3.5 max-sm:grid-cols-1">
        <QueryState query={seatsQuery} loading={<Skeleton className="mx-auto h-[560px] w-full max-w-[353px] rounded-[100px_100px_26px_26px]" />}>
          {(seatMap) => <SeatMap seatMap={seatMap} selected={selected} onToggle={onToggle} />}
        </QueryState>
        <div className="max-sm:grid max-sm:grid-cols-1">
          <SeatHintCard seats={selectedSorted} people={people} />
          <InfoNote variant="soft">لتكمل، اختار عدد مقاعد مساوي لعدد المسافرين.</InfoNote>
        </div>
      </div>
    </>
  )
}
