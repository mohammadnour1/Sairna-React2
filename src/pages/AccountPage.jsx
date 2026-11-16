import { useNavigate } from 'react-router-dom'
import { Hand } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import PageBanner from '@/components/ui/PageBanner'
import AccountDetails from '@/components/account/AccountDetails'
import ProfileCard from '@/components/account/ProfileCard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useMyBookings } from '@/hooks/queries/useAuthQueries'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { firstName } from '@/utils/text'

/** `/account` (protected). User data comes from GET /auth/me. */
export default function AccountPage() {
  useDocumentTitle('حسابي')
  const { user, signOut } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const bookings = useMyBookings()
  // Only non-cancelled bookings of this user count (bug B26).
  const activeCount = bookings.data ? bookings.data.filter((b) => !b.isCancelled).length : null

  const logout = () => {
    signOut()
    showToast('تم تسجيل الخروج.')
    navigate('/', { replace: true })
  }

  return (
    <main className="min-h-[70vh]">
      <PageBanner
        eyebrow="ملفك الشخصي"
        title={`أهلاً ${firstName(user.name)}`}
        highlight={<Icon icon={Hand} size={28} className="align-baseline" />}
        text="هون كل التفاصيل المتعلقة بحسابك التجريبي."
      />
      <section className="site-container py-[86px] max-sm:py-[58px]">
        <div className="grid grid-cols-[300px_1fr] gap-5 max-sm:grid-cols-1">
          <ProfileCard user={user} activeCount={activeCount} onLogout={logout} />
          <AccountDetails user={user} />
        </div>
      </section>
    </main>
  )
}
