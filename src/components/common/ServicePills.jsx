import Icon from '@/components/ui/Icon'
import { featureIcon } from '@/data/companyPalette'

/**
 * Small grey pills for company services (reference `.service-pill`). Renders nothing when empty.
 * @param {{ features: string[] }} props
 */
export default function ServicePills({ features }) {
  if (!features?.length) return null
  return features.map((feature) => (
    <span
      key={feature}
      className="inline-flex items-center gap-[5px] rounded-md bg-surface-alt px-[9px] py-[5px] text-[10px] font-bold text-muted"
    >
      <Icon icon={featureIcon(feature)} size={13} /> {feature}
    </span>
  ))
}
