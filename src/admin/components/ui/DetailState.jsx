import { ArrowRight, SearchX } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { getStatus } from '../../api/adminErrors'
import AdminQueryError from './AdminQueryError'

/**
 * Loading / not-found / error states for a details page. Returns null when the data is ready.
 * @param {{ query: import('@tanstack/react-query').UseQueryResult, invalid?: boolean,
 *           notFoundTitle: string, backTo: string, backLabel: string }} props
 */
export default function DetailState({ query, invalid = false, notFoundTitle, backTo, backLabel }) {
  if (!invalid && query.data) return null
  if (invalid || (query.isError && getStatus(query.error) === 404)) {
    return (
      <EmptyState
        icon={SearchX}
        title={notFoundTitle}
        text="ربما حُذف، أو أن الرابط غير صحيح."
        action={
          <Button to={backTo} iconStart={ArrowRight}>
            {backLabel}
          </Button>
        }
      />
    )
  }
  if (query.isError) return <AdminQueryError query={query} />
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <Spinner label="جارٍ التحميل..." />
    </div>
  )
}
