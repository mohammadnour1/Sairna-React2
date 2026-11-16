/**
 * Top of every admin page: short description + primary actions (the title lives in the header).
 * @param {{ text?: string, actions?: import('react').ReactNode, children?: import('react').ReactNode }} props
 */
export default function PageIntro({ text, actions, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        {text && <p className="m-0 max-w-[620px] text-xs leading-[1.9]">{text}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
