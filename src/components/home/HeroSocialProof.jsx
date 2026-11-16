import { Star } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { PROOF_AVATARS } from '@/data/homeContent'

const avatarColors = ['bg-[#f3d2a6]', 'bg-[#c2dadb]', 'bg-[#e4bed1]', 'bg-[#b9d2ed]']

/** Avatars + stars under the hero text (reference `.hero-social-proof`). Hidden on phones. */
export default function HeroSocialProof() {
  return (
    <div className="mt-10 flex items-center gap-3.5 max-md:mt-6 max-sm:hidden">
      <div className="flex flex-row" aria-hidden="true">
        {PROOF_AVATARS.map((letter, i) => (
          <span
            key={letter}
            className={`-ml-[7px] grid size-[35px] place-items-center rounded-full border-[3px] border-surface font-black text-[#5e3a36] ${avatarColors[i]}`}
          >
            {letter}
          </span>
        ))}
      </div>
      <div>
        <div className="flex items-center gap-[3px] text-[13px] leading-normal text-[#f7b843]">
          {Array.from({ length: 5 }, (_, i) => (
            <Icon key={i} icon={Star} size={14} fill="currentColor" />
          ))}
          <b className="ms-[7px] text-xs text-text">4.9/5</b>
        </div>
        <small className="text-[10px] font-bold text-muted">تجربة سفر بتستاهل تجرّبها</small>
      </div>
    </div>
  )
}
