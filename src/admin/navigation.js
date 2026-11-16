import { Building2, Bus, LayoutDashboard, MapPin, Ticket, Users } from 'lucide-react'

/** Sidebar items. `end` = active only on the exact path (the overview index). */
export const ADMIN_NAV = [
  { to: '/admin', label: 'نظرة عامة', icon: LayoutDashboard, end: true },
  { to: '/admin/companies', label: 'شركات النقل', icon: Building2 },
  { to: '/admin/trips', label: 'الرحلات', icon: Bus },
  { to: '/admin/bookings', label: 'الحجوزات', icon: Ticket },
  { to: '/admin/users', label: 'المستخدمون', icon: Users },
  { to: '/admin/cities', label: 'المدن', icon: MapPin },
]
