import { Plug, Snowflake, Wifi } from 'lucide-react'

// Visual pairs used by the reference company logos (the API has no colours).
export const COMPANY_PALETTE = [
  { color: '#109d9c', bg: '#e7f9f6' },
  { color: '#e69a46', bg: '#fff3df' },
  { color: '#5085e6', bg: '#e9efff' },
  { color: '#9969ce', bg: '#f1eafe' },
]

export function paletteFor(index) {
  const i = Number.isFinite(index) && index >= 0 ? index : 0
  return COMPANY_PALETTE[i % COMPANY_PALETTE.length]
}

/** Icon shown in a service pill. */
export function featureIcon(feature) {
  if (feature === 'Wi-Fi') return Wifi
  if (feature === 'مكيّف') return Snowflake
  return Plug
}
