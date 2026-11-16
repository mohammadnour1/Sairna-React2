import { QueryClient } from '@tanstack/react-query'
import { getStatus } from './errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // One retry for network/server problems; never retry a 4xx (it will fail again).
      retry: (failureCount, error) => {
        const status = getStatus(error)
        if (status && status >= 400 && status < 500) return false
        return failureCount < 1
      },
    },
    mutations: { retry: false },
  },
})
