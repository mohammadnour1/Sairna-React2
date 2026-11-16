import { useEffect, useRef, useState } from 'react'
import { interpolate, midpoint } from '@/utils/geo'

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const WATCHDOG_MS = 9500
const SOURCE_ID = 'sairna-trip'

const hasCoords = (c) => c && Number.isFinite(c.lat) && Number.isFinite(c.lng)
const lngLat = (c) => [c.lng, c.lat]

let webglCache = null
function webglSupported() {
  if (webglCache !== null) return webglCache
  try {
    const canvas = document.createElement('canvas')
    webglCache = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    webglCache = false
  }
  return webglCache
}

/**
 * Creates a MapLibre map inside `containerRef` (section 12 of CLAUDE.md).
 * - MapLibre is imported dynamically → separate chunk, not in the initial bundle.
 * - Falls back ('fallback' status) on: missing coordinates, no WebGL, failed import,
 *   map error before load, or no load after 9.5s.
 * - Callers give RouteMap a `key` per route, so a new route remounts with a fresh 'loading' state.
 * - The map is created once per route (origin/destination/mode). Progress and theme changes
 *   never recreate it (bugs B8/B25): the bus marker is exposed through `busMarkerRef`.
 *
 * @returns {{ status: 'loading'|'ready'|'fallback', busMarkerRef: import('react').RefObject }}
 */
export function useMapLibre(containerRef, { origin, destination, mode = 'preview', initialProgress = 0.48 }) {
  const [status, setStatus] = useState('loading')
  const busMarkerRef = useRef(null)
  const initialProgressRef = useRef(initialProgress)

  const oLat = origin?.lat
  const oLng = origin?.lng
  const dLat = destination?.lat
  const dLng = destination?.lng
  const oName = origin?.name
  const dName = destination?.name

  // No coordinates or no WebGL → straight to the Google fallback (derived, no effect needed).
  const supported = hasCoords(origin) && hasCoords(destination) && webglSupported()

  useEffect(() => {
    if (!supported) return undefined
    const o = { lat: oLat, lng: oLng, name: oName }
    const d = { lat: dLat, lng: dLng, name: dName }
    const preview = mode === 'preview'
    let map = null
    let cancelled = false
    let ready = false
    let watchdog = null

    const fail = () => {
      if (cancelled || ready) return
      setStatus('fallback')
      map?.remove()
      map = null
    }

    import('maplibre-gl')
      .then((maplibregl) => {
        if (cancelled || !containerRef.current) return
        const center = midpoint(o, d)
        map = new maplibregl.Map({
          container: containerRef.current,
          style: STYLE_URL,
          center: lngLat(center),
          zoom: 6,
          attributionControl: false,
          scrollZoom: !preview,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          cooperativeGestures: false,
          fadeDuration: 0,
        })
        map.addControl(new maplibregl.AttributionControl({ compact: preview }), 'bottom-left')
        if (preview) {
          map.scrollZoom.disable()
          map.dragPan.disable()
          map.touchZoomRotate.disable()
          map.doubleClickZoom.disable()
          map.keyboard.disable()
        } else {
          map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
        }
        map.fitBounds(new maplibregl.LngLatBounds(lngLat(o), lngLat(o)).extend(lngLat(d)), {
          padding: preview ? 38 : 82,
          maxZoom: 8,
          duration: 0,
        })

        watchdog = setTimeout(fail, WATCHDOG_MS)
        map.on('error', () => {
          if (!ready) fail()
        })
        map.on('load', () => {
          if (cancelled || !map) return
          try {
            map.addSource(SOURCE_ID, {
              type: 'geojson',
              data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [lngLat(o), lngLat(d)] } },
            })
            map.addLayer({
              id: 'sairna-route-line',
              type: 'line',
              source: SOURCE_ID,
              layout: { 'line-cap': 'round', 'line-join': 'round' },
              paint: { 'line-color': '#0aa99b', 'line-width': 4, 'line-opacity': 0.95, 'line-dasharray': [2, 2] },
            })
            ;[o, d].forEach((city, i) => {
              new maplibregl.Marker({ color: i === 0 ? '#0aa99b' : '#153c52', scale: 0.85 })
                .setLngLat(lngLat(city))
                .setPopup(new maplibregl.Popup({ offset: 20 }).setText(`${i === 0 ? 'الانطلاق: ' : 'الوصول: '}${city.name}`))
                .addTo(map)
            })
            if (!preview) {
              const el = document.createElement('div')
              el.className = 'sairna-moving-bus'
              busMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
                .setLngLat(lngLat(interpolate(o, d, initialProgressRef.current)))
                .setPopup(new maplibregl.Popup({ offset: 24 }).setText('موقع تجريبي تقريبي'))
                .addTo(map)
            }
            ready = true
            clearTimeout(watchdog)
            setStatus('ready')
            map.resize()
          } catch {
            fail()
          }
        })
      })
      .catch(fail)

    return () => {
      cancelled = true
      clearTimeout(watchdog)
      busMarkerRef.current = null
      map?.remove()
      map = null
    }
  }, [supported, containerRef, mode, oLat, oLng, dLat, dLng, oName, dName])

  return { status: supported ? status : 'fallback', busMarkerRef }
}
