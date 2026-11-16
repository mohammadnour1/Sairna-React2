import { useImageFallback } from '@/hooks/useImageFallback'

/**
 * <img> that walks a chain of photo URLs (see data/cityPhotos.js) and ends on a local SVG,
 * so a broken-image icon never appears (bug B21).
 *
 * @param {{ photoKey: string, alt: string, className?: string, loading?: 'lazy'|'eager',
 *           fetchPriority?: 'high'|'low'|'auto', decoding?: 'async'|'sync'|'auto' }} props
 */
export default function SmartImage({ photoKey, alt, className, loading = 'lazy', fetchPriority, decoding = 'async' }) {
  const { src, onLoad, onError } = useImageFallback(photoKey)
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      referrerPolicy="no-referrer"
      onLoad={onLoad}
      onError={onError}
    />
  )
}
