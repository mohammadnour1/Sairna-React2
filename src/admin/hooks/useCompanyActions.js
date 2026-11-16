import { useState } from 'react'
import { useArchiveCompany, useSaveCompany } from './mutations/useAdminMutations'

/**
 * Which drawer/dialog is open on the companies page, and the confirmed actions.
 * dialog: null | { type: 'form', company: object|null } | { type: 'archive'|'activate', company: object }
 *
 * - archive  → DELETE /companies/{id} (server archives: isActive becomes false)
 * - activate → PATCH  /companies/{id} { isActive: true }
 */
export function useCompanyActions() {
  const [dialog, setDialog] = useState(null)
  const archive = useArchiveCompany()
  const save = useSaveCompany()
  const close = () => setDialog(null)

  return {
    dialog,
    close,
    openCreate: () => setDialog({ type: 'form', company: null }),
    openEdit: (company) => setDialog({ type: 'form', company }),
    askArchive: (company) => setDialog({ type: 'archive', company }),
    askActivate: (company) => setDialog({ type: 'activate', company }),
    busy: archive.isPending || save.isPending,
    confirm: () => {
      const { type, company } = dialog
      if (type === 'archive') archive.mutate({ id: company.id }, { onSuccess: close })
      if (type === 'activate') {
        save.mutate({ id: company.id, body: { isActive: true }, successMessage: 'تم تفعيل الشركة وعادت تظهر للمسافرين.' }, { onSuccess: close })
      }
    },
  }
}
