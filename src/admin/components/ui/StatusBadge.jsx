import { Ban, CircleCheck, CircleDashed, Clock3, PauseCircle, ShieldCheck, User } from 'lucide-react'
import Tag from '@/components/ui/Tag'

// Every badge pairs color with an icon + Arabic word (never color alone).
const BADGES = {
  booking: {
    CONFIRMED: { tone: 'success', icon: CircleCheck, label: 'مؤكد' },
    CANCELLED: { tone: 'danger', icon: Ban, label: 'ملغى' },
  },
  trip: {
    AVAILABLE: { tone: 'success', icon: CircleCheck, label: 'متاحة' },
    CANCELLED: { tone: 'danger', icon: Ban, label: 'ملغاة' },
    DEPARTED: { tone: 'muted', icon: Clock3, label: 'انطلقت' },
  },
  company: {
    ACTIVE: { tone: 'success', icon: CircleCheck, label: 'فعّالة' },
    INACTIVE: { tone: 'muted', icon: PauseCircle, label: 'موقوفة' },
  },
  role: {
    ADMIN: { tone: 'teal', icon: ShieldCheck, label: 'مشرف' },
    USER: { tone: 'muted', icon: User, label: 'مسافر' },
  },
}

/**
 * Status tag for bookings, trips, companies and user roles.
 * Unknown values from the API are shown as-is (never hidden or renamed by guess).
 * @param {{ type: 'booking'|'trip'|'company'|'role', value: string|null }} props
 */
export default function StatusBadge({ type, value }) {
  if (!value) return <span className="text-muted">—</span>
  const badge = BADGES[type]?.[String(value).toUpperCase()]
  if (!badge) {
    return (
      <Tag tone="muted" icon={CircleDashed} iconSize={13}>
        <bdi>{value}</bdi>
      </Tag>
    )
  }
  return (
    <Tag tone={badge.tone} icon={badge.icon} iconSize={13}>
      {badge.label}
    </Tag>
  )
}
