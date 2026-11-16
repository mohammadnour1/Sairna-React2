import { LayoutDashboard, SearchX } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

/** Unknown `/admin/*` path, inside the dashboard layout. */
export default function AdminNotFoundPage() {
  return (
    <EmptyState
      icon={SearchX}
      title="الصفحة غير موجودة"
      text="ربما يكون الرابط غير صحيح، أو أن الصفحة أُزيلت."
      action={
        <Button to="/admin" iconStart={LayoutDashboard}>
          العودة إلى النظرة العامة
        </Button>
      }
    />
  )
}
