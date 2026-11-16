import { Fragment } from 'react'
import { Check } from 'lucide-react'
import Icon from './Icon'
import { cn } from '@/utils/cn'

/**
 * Horizontal step indicator (reference `.stepper`).
 * @param {{ steps: { key: string, label: string }[], current: string }} props
 */
export default function Stepper({ steps, current }) {
  const index = steps.findIndex((s) => s.key === current)
  return (
    <ol className="mt-[34px] mb-[26px] flex items-center justify-center max-sm:mt-[23px] max-sm:mb-[18px]">
      {steps.map((step, i) => {
        const done = i < index
        const active = i === index
        return (
          <Fragment key={step.key}>
            <li
              aria-current={active ? 'step' : undefined}
              className={cn('flex items-center gap-[9px]', done || active ? 'text-primary-deep' : 'text-muted')}
            >
              <span
                className={cn(
                  'grid size-[30px] place-items-center rounded-full border text-[11px] font-black max-sm:size-[26px]',
                  done || active ? 'border-primary bg-primary text-white' : 'border-border bg-surface-alt',
                )}
              >
                {done ? <Icon icon={Check} size={17} /> : i + 1}
              </span>
              <b className="text-[11px] whitespace-nowrap max-sm:text-[9px]">{step.label}</b>
            </li>
            {i < steps.length - 1 && (
              <li aria-hidden="true" className="mx-[17px] h-px w-[89px] bg-border max-sm:mx-2 max-sm:w-5" />
            )}
          </Fragment>
        )
      })}
    </ol>
  )
}
