import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { firstName, initial } from '@/utils/text'

/**
 * Avatar + first name linking to /account (reference `.user-menu`).
 * @param {{ user: { name: string } }} props
 */
export default function UserMenu({ user }) {
  return (
    <Link to="/account" className="flex items-center gap-2 text-xs font-extrabold" aria-label={`حسابي: ${user.name}`}>
      <span className="grid size-[35px] place-items-center rounded-full bg-soft-teal font-black text-primary max-sm:size-[33px]">
        {initial(user.name)}
      </span>
      <span className="max-sm:hidden">{firstName(user.name)}</span>
      <Icon icon={ChevronDown} size={14} className="max-sm:hidden" />
    </Link>
  )
}
