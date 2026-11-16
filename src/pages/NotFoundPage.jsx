import { ArrowRight, MapPinOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/** `*` — unknown URLs no longer silently show Home (bug B20). */
export default function NotFoundPage() {
  useDocumentTitle('الصفحة مو موجودة')
  return (
    <main className="site-container min-h-[70vh] py-20">
      <EmptyState
        as="h1"
        icon={MapPinOff}
        title="الصفحة مو موجودة"
        text="يمكن الرابط غلط أو الصفحة انشالت."
        action={
          <Button to="/" iconStart={ArrowRight}>
            رجوع للرئيسية
          </Button>
        }
      />
    </main>
  )
}
