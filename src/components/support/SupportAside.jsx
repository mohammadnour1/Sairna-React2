import { Headphones } from 'lucide-react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

/** Teal help box next to the FAQ (reference `.support-aside`). */
export default function SupportAside() {
  return (
    <aside className="self-start rounded-[18px] bg-soft-teal p-[30px]">
      <Icon icon={Headphones} size={32} className="text-primary" />
      <h2 className="my-[15px] text-xl">بحاجة لمساعدة؟</h2>
      <p className="text-[11px]">هاد الموقع نموذج واجهات تعليمية، وممكن تطوّرو لاحقاً لتضيفوا نظام دعم حقيقي.</p>
      <Button to="/">رجوع للرئيسية</Button>
    </aside>
  )
}
