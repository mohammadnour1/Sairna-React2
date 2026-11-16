import { Link } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import { cn } from '@/utils/cn'

/**
 * Brand mark + wordmark (reference `.brand`). `onDark` is the footer colouring.
 * @param {{ onDark?: boolean }} props
 */
export default function Logo({ onDark = false }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center gap-2.5" aria-label="سيرنا - الرئيسية">
      <span className="grid size-12 place-items-center max-sm:size-[39px]">
        <img src={logo} alt="" className="size-full" />
      </span>
      <span className="flex flex-col leading-[1.2]">
        <strong
          className={cn(
            'text-[30px] font-black tracking-[-1.5px] max-sm:text-[25px]',
            onDark ? 'text-white' : 'text-dark-deep dark:text-text',
          )}
        >
          سيرنا<span className="text-primary">.</span>
        </strong>
        <small
          className={cn(
            'mt-[7px] text-[9px] font-bold whitespace-nowrap max-sm:mt-[5px] max-sm:text-[8px]',
            onDark ? 'text-[#9ac4cd]' : 'text-muted',
          )}
        >
          رحلتك بتبلّش من هون
        </small>
      </span>
    </Link>
  )
}
