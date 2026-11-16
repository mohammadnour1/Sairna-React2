import { RefreshCw, WifiOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { getAdminErrorMessage } from '../../api/adminErrors'

/**
 * Error state with retry for an admin query. Renders nothing while there is no error,
 * so pages can do: <AdminQueryError query={q} /> and handle loading/data themselves.
 * @param {{ query: import('@tanstack/react-query').UseQueryResult, title?: string, className?: string }} props
 */
export default function AdminQueryError({ query, title = 'تعذّر تحميل البيانات', className }) {
  if (!query.isError || query.data) return null
  return (
    <EmptyState
      className={className}
      icon={WifiOff}
      title={title}
      text={getAdminErrorMessage(query.error)}
      action={
        <Button onClick={() => query.refetch()} iconStart={RefreshCw} loading={query.isFetching}>
          حاول مرة أخرى
        </Button>
      }
    />
  )
}
