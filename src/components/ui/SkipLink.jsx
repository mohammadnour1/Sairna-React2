/**
 * Keyboard users can jump past the header. Hidden until focused.
 * @param {{ label?: string }} props — the admin area passes its own (Modern Standard Arabic) text.
 */
export default function SkipLink({ label = 'تخطّى إلى المحتوى' }) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-400 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:text-xs focus:font-extrabold focus:text-white"
    >
      {label}
    </a>
  )
}
