import { useState } from 'react'
import { Building2, Image, Save } from 'lucide-react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import InfoNote from '@/components/ui/InfoNote'
import TextField from '@/components/ui/TextField'
import { mapCompany } from '@/api/mappers/company.mapper'
import { getAdminFieldErrors } from '../../api/adminErrors'
import { useSaveCompany } from '../../hooks/mutations/useAdminMutations'
import { diff, validateCompany } from '../../utils/validation'
import CompanyAvatar from '../companies/CompanyAvatar'
import Drawer from '../ui/Drawer'

const FORM_ID = 'company-form'

/**
 * Create (company = null) or edit a company. Fields follow CompanyDto / UpdateCompanyDto:
 * name*, logoUrl?, and isActive (edit only). Rendered with a `key` so each opening starts fresh.
 * @param {{ company: object|null, onClose: () => void }} props
 */
export default function CompanyFormDrawer({ company, onClose }) {
  const isEdit = Boolean(company)
  const initial = { name: company?.fullName ?? '', logoUrl: company?.logoUrl ?? '', isActive: company?.isActive ?? true }
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const save = useSaveCompany()

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
    if (errors[field]) setErrors((all) => ({ ...all, [field]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validateCompany(values)
    setErrors(found)
    if (Object.keys(found).length) return
    const clean = { name: values.name.trim(), logoUrl: values.logoUrl.trim() }
    let body
    if (isEdit) {
      body = diff({ ...clean, isActive: values.isActive }, initial)
      if (body.logoUrl === '') delete body.logoUrl // clearing a logo is not supported by the DTO
      if (!Object.keys(body).length) return onClose()
    } else {
      body = { name: clean.name, ...(clean.logoUrl && { logoUrl: clean.logoUrl }) }
    }
    save.mutate({ id: company?.id, body }, { onSuccess: onClose, onError: (error) => setErrors(getAdminFieldErrors(error)) })
  }

  const preview = mapCompany({ id: company?.id ?? 1, name: values.name || 'ش', logoUrl: values.logoUrl.trim() || null })

  return (
    <Drawer
      open
      onClose={onClose}
      busy={save.isPending}
      title={isEdit ? 'تعديل الشركة' : 'إضافة شركة نقل'}
      description={isEdit ? `رقم الشركة #${company.id}` : 'الحقول المطلوبة مُعلَّمة بـ *'}
      footer={
        <>
          <Button type="submit" form={FORM_ID} loading={save.isPending} iconStart={Save}>
            {isEdit ? 'حفظ التعديلات' : 'إضافة الشركة'}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={save.isPending}>
            إلغاء
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-[14px] bg-surface-alt p-3.5">
          <CompanyAvatar company={preview} size="lg" />
          <div className="min-w-0">
            <strong className="block truncate text-sm">{values.name.trim() || 'اسم الشركة'}</strong>
            <small className="text-[11px] text-muted">معاينة الشعار كما سيظهر في الجداول</small>
          </div>
        </div>
        <TextField label="اسم الشركة" icon={Building2} value={values.name} onChange={set('name')} error={errors.name} required maxLength={120} placeholder="مثال: الشام للنقل" />
        <TextField
          label="رابط الشعار (اختياري)"
          icon={Image}
          type="url"
          dir="ltr"
          value={values.logoUrl}
          onChange={set('logoUrl')}
          error={errors.logoUrl}
          placeholder="https://example.com/logo.png"
        />
        {isEdit && (
          <div className="rounded-[14px] border border-border p-3.5">
            <Checkbox label="الشركة فعّالة وتظهر للمسافرين" checked={values.isActive} onChange={set('isActive')} />
            <p className="mt-1.5 mb-0 text-[10px]">إيقاف الشركة يخفيها من الموقع دون حذف سجلّها.</p>
          </div>
        )}
        {isEdit && company.logoUrl && (
          <InfoNote variant="auth">إفراغ حقل الشعار لا يحذف الشعار الحالي، إذ لا توضّح واجهة الـ API طريقة حذفه؛ ويمكنك استبداله برابط آخر.</InfoNote>
        )}
      </form>
    </Drawer>
  )
}
