import PageBanner from '@/components/ui/PageBanner'
import FaqList from '@/components/support/FaqList'
import SupportAside from '@/components/support/SupportAside'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/** `/support` — FAQ + help box (reference `supportPage()`). */
export default function SupportPage() {
  useDocumentTitle('مركز المساعدة')
  return (
    <main className="min-h-[70vh]">
      <PageBanner eyebrow="نحن معك" title="شو حابب" highlight="تعرف؟" text="أسئلة بتساعدك تستخدم نموذج سيرنا بسهولة." />
      <section className="site-container grid grid-cols-[minmax(0,1fr)_300px] gap-[21px] pt-[53px] pb-[90px] max-md:grid-cols-1 max-sm:pt-[30px] max-sm:pb-[55px]">
        <FaqList />
        <SupportAside />
      </section>
    </main>
  )
}
