import { Plus } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * One question using native <details> (keyboard + screen-reader friendly by default).
 * @param {{ question: string, answer: string }} props
 */
export default function FaqItem({ question, answer }) {
  return (
    <details className="faq-item rounded-xl border border-border bg-surface px-5 py-[3px]">
      <summary className="flex cursor-pointer list-none items-center justify-between py-[15px] text-[13px] font-extrabold">
        {question}
        <Icon icon={Plus} size={18} className="transition-transform duration-200" />
      </summary>
      <p className="border-t border-border pt-3.5 pb-[5px] text-xs leading-[2.2]">{answer}</p>
    </details>
  )
}
