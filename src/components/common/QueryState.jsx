import { RefreshCw, WifiOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { getErrorMessage } from '@/api/errors'

/**
 * Renders the three standard states of a React Query result:
 * loading → `loading`, error → message + "حاول مرة ثانية", success → `children(data)`.
 * When `isEmpty(data)` is true, `empty` is rendered instead.
 *
 * @param {{ query: import('@tanstack/react-query').UseQueryResult, loading?: import('react').ReactNode,
 *           empty?: import('react').ReactNode, isEmpty?: (data:any) => boolean,
 *           error?: (error, retry) => import('react').ReactNode, children: (data:any) => import('react').ReactNode }} props
 */
export default function QueryState({ query, loading = null, empty = null, isEmpty, error, children }) {
  if (query.isPending) return loading
  if (query.isError && !query.data) {
    if (error) return error(query.error, query.refetch)
    return (
      <EmptyState
        icon={WifiOff}
        title="تعذّر تحميل البيانات"
        text={getErrorMessage(query.error)}
        action={
          <Button onClick={() => query.refetch()} iconStart={RefreshCw} loading={query.isFetching}>
            حاول مرة ثانية
          </Button>
        }
      />
    )
  }
  if (isEmpty?.(query.data)) return empty
  return children(query.data)
}
