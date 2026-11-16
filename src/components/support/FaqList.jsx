import { FAQ_ITEMS } from '@/data/faq'
import FaqItem from './FaqItem'

/** All FAQ entries (reference `.faq-list`). */
export default function FaqList() {
  return (
    <div className="flex flex-col gap-[11px]">
      {FAQ_ITEMS.map((item) => (
        <FaqItem key={item.q} question={item.q} answer={item.a} />
      ))}
    </div>
  )
}
