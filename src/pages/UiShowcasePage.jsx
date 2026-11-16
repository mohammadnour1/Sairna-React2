import { useState } from 'react'
import { ArrowLeft, Bus, CircleCheck, Info, Mail, Plus, Ticket, User } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import Eyebrow from '@/components/ui/Eyebrow'
import Icon from '@/components/ui/Icon'
import IconButton from '@/components/ui/IconButton'
import InfoNote from '@/components/ui/InfoNote'
import PageBanner from '@/components/ui/PageBanner'
import PasswordField from '@/components/ui/PasswordField'
import ProgressBar from '@/components/ui/ProgressBar'
import RadioList from '@/components/ui/RadioList'
import SectionHeading from '@/components/ui/SectionHeading'
import Skeleton from '@/components/ui/Skeleton'
import Spinner from '@/components/ui/Spinner'
import Stepper from '@/components/ui/Stepper'
import Tag from '@/components/ui/Tag'
import TextField from '@/components/ui/TextField'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { useToast } from '@/context/ToastContext'

function Block({ title, children }) {
  return (
    <section className="min-w-0 rounded-[20px] border border-border bg-surface p-6">
      <h2 className="mb-4 text-sm text-muted">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  )
}

/** Dev-only page (/__ui) that shows every UI kit component for visual review. */
export default function UiShowcasePage() {
  const { showToast } = useToast()
  const [radio, setRadio] = useState('all')
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <main>
      <PageBanner
        breadcrumb={[{ label: 'الرئيسية', to: '/' }, { label: 'UI kit' }]}
        eyebrow="Dev only"
        title="مكوّنات"
        highlight="الواجهة."
        text="كل مكوّنات components/ui بمكان واحد للمراجعة بالوضع الفاتح والغامق."
      />
      <div className="site-container grid gap-5 py-10">
        <Block title="Theme">
          <ThemeToggle />
        </Block>
        <Block title="Button — variants">
          <Button iconEnd={ArrowLeft}>Primary</Button>
          <Button variant="dark">Dark</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <div className="rounded-xl bg-dark p-3">
            <Button variant="white" iconEnd={ArrowLeft}>White</Button>
          </div>
          <Button size="sm" iconStart={Plus}>Small</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button to="/results" variant="outline">Link</Button>
        </Block>
        <Block title="IconButton / Eyebrow / Tag">
          <IconButton label="مثال">
            <Icon icon={Info} size={19} />
          </IconButton>
          <Eyebrow>أهلاً فيك بسيرنا</Eyebrow>
          <div className="rounded-xl bg-dark p-3">
            <Eyebrow tone="onDark">جاهز تغير جو؟</Eyebrow>
          </div>
          <Tag tone="success" icon={CircleCheck}>تم تأكيد الحجز</Tag>
          <Tag tone="muted">ملغى</Tag>
          <Tag tone="danger">ملغى</Tag>
          <Tag tone="demo" icon={Info}>حجز توضيحي</Tag>
        </Block>
        <Block title="Fields">
          <div className="grid w-full grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <TextField label="الاسم الكامل" icon={User} required placeholder="مثال: أحمد خالد" />
            <TextField label="البريد الإلكتروني" icon={Mail} dir="ltr" error="أدخل بريد إلكتروني صحيح." defaultValue="bad@" />
            <PasswordField label="كلمة المرور" size="lg" placeholder="8 أحرف على الأقل" />
            <Checkbox label="تذكرني" />
          </div>
        </Block>
        <Block title="RadioList">
          <RadioList
            name="demo"
            legend="شركة النقل"
            value={radio}
            onChange={setRadio}
            options={[
              { value: 'all', label: 'كل الشركات', count: 9 },
              { value: 'a', label: 'الشام للنقل', count: 3 },
              { value: 'b', label: 'الفرات للسياحة', count: 0 },
            ]}
          />
        </Block>
        <Block title="Notes">
          <InfoNote variant="soft">لتكمل، اختار عدد مقاعد مساوي لعدد المسافرين.</InfoNote>
          <InfoNote variant="notice">ملاحظة بالأسفل.</InfoNote>
          <InfoNote variant="review">بتأكيد الحجز، رح تنضاف التذكرة لقائمة «حجوزاتي» بحسابك.</InfoNote>
          <InfoNote variant="warning" as="p">هذه محاكاة تعليمية فوق خريطة جغرافية حقيقية، وليست تتبع GPS.</InfoNote>
          <InfoNote variant="auth">هاد مشروع تدريبي.</InfoNote>
        </Block>
        <Block title="Breadcrumb / Stepper / Progress">
          <Breadcrumb items={[{ label: 'الرئيسية', to: '/' }, { label: 'الرحلات', to: '/results' }, { label: 'إتمام الحجز' }]} />
          <div className="w-full">
            <Stepper
              current="passengers"
              steps={[
                { key: 'seats', label: 'اختيار المقاعد' },
                { key: 'passengers', label: 'بيانات المسافرين' },
                { key: 'review', label: 'المراجعة والتأكيد' },
              ]}
            />
          </div>
          <div className="w-full">
            <ProgressBar value={0.48} label="تقدّم الرحلة" />
          </div>
        </Block>
        <Block title="Loading">
          <Spinner />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="size-12 rounded-full" />
        </Block>
        <Block title="Toast / ConfirmDialog">
          <Button variant="outline" onClick={() => showToast('تم نسخ رقم الحجز.')}>Toast info</Button>
          <Button variant="outline" onClick={() => showToast('مسموح تختار 2 مقعد فقط.', 'error')}>Toast error</Button>
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>Confirm dialog</Button>
          <ConfirmDialog
            open={confirmOpen}
            title="أكيد بدك تلغي هالحجز؟"
            text="المقاعد رح ترجع متاحة لغيرك."
            confirmLabel="إلغاء الحجز"
            onConfirm={() => setConfirmOpen(false)}
            onCancel={() => setConfirmOpen(false)}
          />
        </Block>
        <SectionHeading eyebrow="اكتشف سوريا" title="على وين حابب" highlight="تسافر؟" text="عنوان قسم." action={<Button variant="outline" iconStart={Bus}>Action</Button>} />
        <EmptyState icon={Ticket} title="ما عندك حجوزات لسا." text="ابحث عن رحلة واحجز أول مقعد إلك." action={<Button to="/results">احجز رحلة</Button>} />
      </div>
    </main>
  )
}
