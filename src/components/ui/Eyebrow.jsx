import { Sparkles } from 'lucide-react'
import Icon from './Icon'
import { cn } from '@/utils/cn'

const tones = {
  default: { pill: 'bg-soft-teal text-primary-deep', star: 'text-primary' },
  onDark: { pill: 'bg-white/10 text-[#c7f6e8]', star: 'text-[#e2ffba]' },
}

/**
 * Small pill above headings with a sparkle (reference `.eyebrow` + `.mini-star`).
 * @param {{ children: import('react').ReactNode, tone?: 'default'|'onDark', className?: string }} props
 */
export default function Eyebrow({ children, tone = 'default', className }) {
  const t = tones[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3.5 py-[5px] text-[11px] font-black tracking-[.12px]',
        t.pill,
        className,
      )}
    >
      <span className={cn('inline-flex items-center justify-center', t.star)}>
        <Icon icon={Sparkles} size={13} />
      </span>
      {children}
    </span>
  )
}
