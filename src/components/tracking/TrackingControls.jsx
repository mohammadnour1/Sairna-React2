import { Pause, Play, RefreshCw } from 'lucide-react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

/**
 * Play/pause + restart buttons (reference `.track-controls`).
 * @param {{ playing: boolean, onToggle: () => void, onReset: () => void }} props
 */
export default function TrackingControls({ playing, onToggle, onReset }) {
  return (
    <div className="mt-[18px] flex gap-[9px]">
      <Button onClick={onToggle} iconStart={playing ? Pause : Play} className="flex-1" aria-pressed={!playing}>
        {playing ? 'إيقاف الحركة' : 'متابعة الحركة'}
      </Button>
      <Button
        variant="outline"
        size="custom"
        onClick={onReset}
        aria-label="إعادة المحاكاة"
        title="إعادة المحاكاة"
        className="min-h-[49px] w-[49px] rounded-xl p-0"
      >
        <Icon icon={RefreshCw} size={18} />
      </Button>
    </div>
  )
}
