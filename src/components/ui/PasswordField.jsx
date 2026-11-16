import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import Icon from './Icon'
import TextField from './TextField'

/**
 * TextField for passwords with a show/hide toggle (reference `.show-password`).
 * Accepts every TextField prop.
 */
export default function PasswordField(props) {
  const [visible, setVisible] = useState(false)
  return (
    <TextField
      icon={Lock}
      dir="ltr"
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          aria-pressed={visible}
          className="grid place-items-center border-0 bg-transparent p-[5px] text-muted"
        >
          <Icon icon={visible ? EyeOff : Eye} size={19} />
        </button>
      }
    />
  )
}
