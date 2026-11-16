import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Bus, ShieldCheck, Ticket } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import InfoNote from '@/components/ui/InfoNote'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import AdminBrand from '../components/layout/AdminBrand'
import AdminLoginForm from '../components/auth/AdminLoginForm'

const POINTS = [
  { icon: Building2, text: 'إدارة شركات النقل وتفعيلها أو إيقافها' },
  { icon: Bus, text: 'إضافة الرحلات وتعديل مواعيدها وأسعارها' },
  { icon: Ticket, text: 'متابعة الحجوزات وإلغاؤها عند الحاجة' },
]

/** `/admin/login` — dark brand panel + form card, same visual language as the passenger auth page. */
export default function AdminLoginPage() {
  useDocumentTitle('دخول لوحة الإدارة')
  return (
    <main id="main-content" tabIndex={-1} className="grid min-h-dvh grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-bg outline-none max-md:grid-cols-1">
      <section className="relative flex flex-col justify-between overflow-hidden bg-sidebar px-12 py-10 text-white max-md:px-6 max-md:py-7">
        <span className="pointer-events-none absolute -bottom-40 -start-40 size-[420px] rounded-full border-[60px] border-white/[.03]" aria-hidden="true" />
        <AdminBrand />
        <div className="relative my-10 max-md:my-6">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/[.08] px-3 py-1 text-[11px] font-bold text-[#9fe3d9]">
            <Icon icon={ShieldCheck} size={15} />
            للمشرفين فقط
          </span>
          <h1 className="m-0 text-[34px] leading-[1.45] font-black text-white max-md:text-[25px]">
            كل تشغيل سيرنا
            <br />
            <span className="text-primary">في مكان واحد.</span>
          </h1>
          <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0 max-md:hidden">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-[13px] text-[#c4dbe1]">
                <span className="grid size-9 place-items-center rounded-[11px] bg-white/[.07] text-primary">
                  <Icon icon={p.icon} size={18} />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
        <small className="text-[10px] text-[#7fa5b0] max-md:hidden">مشروع تدريبي — البيانات من خادم المشروع وليست تشغيلاً حقيقياً.</small>
      </section>

      <section className="flex flex-col px-12 py-8 max-md:px-5 max-md:py-7">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary">
            <Icon icon={ArrowRight} size={16} />
            العودة إلى الموقع
          </Link>
          <ThemeToggle />
        </div>
        <div className="mx-auto my-auto w-full max-w-[400px] py-10">
          <h2 className="mb-1 text-[26px]">تسجيل دخول المشرف</h2>
          <p className="mb-7 text-xs">استخدم حساب الإدارة الذي زوّدك به فريق سيرنا.</p>
          <AdminLoginForm />
          <InfoNote variant="auth" className="mt-6">
            لا يمكن إنشاء حساب أو استعادة كلمة المرور من هنا، إذ تُضاف حسابات الإدارة من الخادم فقط.
          </InfoNote>
        </div>
      </section>
    </main>
  )
}
