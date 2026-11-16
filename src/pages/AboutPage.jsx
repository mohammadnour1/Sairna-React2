import PageBanner from '@/components/ui/PageBanner'
import AboutContent from '@/components/about/AboutContent'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/** `/about` (reference `aboutPage()`). */
export default function AboutPage() {
  useDocumentTitle('عن سيرنا')
  return (
    <main className="min-h-[70vh]">
      <PageBanner
        eyebrow="قصتنا"
        title="سيرنا."
        highlight="رحلة أبسط لكل حدا."
        text="فكرة موقع لحجز الرحلات البرية بين المحافظات السورية، انبنت كنموذج لتعليم تصميم وتطوير الويب."
      />
      <AboutContent />
    </main>
  )
}
