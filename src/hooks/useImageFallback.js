import { useCallback, useState } from 'react'
import { PHOTO_SOURCES } from '@/data/cityPhotos'

// First URL that loaded for each photo key, shared by all images (no reload on re-render).
const workingUrl = new Map()

/**
 * Walks the URL chain for a photo key until one loads. The last entry is a local SVG,
 * so an image is always shown (never a broken-image icon).
 *
 * @returns {{ src: string, onLoad: () => void, onError: () => void, isFallback: boolean }}
 */
export function useImageFallback(photoKey) {
  const chain = PHOTO_SOURCES[photoKey] ?? []
  const cached = workingUrl.get(photoKey)
  const [index, setIndex] = useState(() => (cached ? Math.max(0, chain.indexOf(cached)) : 0))

  const src = chain[index] ?? ''

  const onLoad = useCallback(() => {
    if (src) workingUrl.set(photoKey, src)
  }, [photoKey, src])

  const onError = useCallback(() => {
    setIndex((i) => (i < chain.length - 1 ? i + 1 : i))
  }, [chain.length])

  return { src, onLoad, onError, isFallback: index === chain.length - 1 }
}
