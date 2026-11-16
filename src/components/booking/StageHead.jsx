import Icon from '@/components/ui/Icon'

/**
 * Title + hint at the top of each booking step (reference `.stage-head`).
 * @param {{ title: string, icon: import('react').ComponentType, iconSize?: number, text: string }} props
 */
export default function StageHead({ title, icon, iconSize = 23, text }) {
  return (
    <div className="mb-[21px]">
      <h2 className="m-0 mb-[5px] flex items-center gap-[11px] text-xl max-sm:text-[17px]">
        {title} <Icon icon={icon} size={iconSize} className="text-primary" />
      </h2>
      <p className="m-0 text-xs">{text}</p>
    </div>
  )
}
