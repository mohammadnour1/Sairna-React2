import { CircleCheck, Info } from 'lucide-react'
import Icon from './Icon'
import { cn } from '@/utils/cn'

/**
 * Bottom toast (reference `.toast`). Rendered by ToastProvider inside a live region.
 * @param {{ message: string, type: 'info'|'error', visible: boolean }} props
 */
export default function Toast({ message, type, visible }) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed end-6 bottom-6 z-300 flex max-w-[calc(100%-48px)] items-center gap-2.5 rounded-xl px-[19px] py-3.5 text-xs font-extrabold text-white shadow-[0_20px_45px_rgba(0,0,0,.18)] transition-[opacity,transform] duration-250',
        type === 'error' ? 'bg-[#a64645]' : 'bg-[#143c4d]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
    >
      {message && <Icon icon={type === 'error' ? Info : CircleCheck} size={19} />}
      {message}
    </div>
  )
}
