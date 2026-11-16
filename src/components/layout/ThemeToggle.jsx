import { Moon, Sun } from 'lucide-react'
import IconButton from '@/components/ui/IconButton'
import Icon from '@/components/ui/Icon'
import { useTheme } from '@/context/ThemeContext'

/** Moon/sun button that switches light/dark (reference `.theme-switch`). */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <IconButton label="تبديل المظهر" onClick={toggleTheme} className="max-sm:size-[35px]">
      <Icon icon={theme === 'light' ? Moon : Sun} size={19} />
    </IconButton>
  )
}
