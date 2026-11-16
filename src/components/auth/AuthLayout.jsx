import AuthVisual from './AuthVisual'

/** Two-column card used by login and register (reference `.auth-main` + `.auth-grid`). */
export default function AuthLayout({ children }) {
  return (
    <main className="bg-bg pt-[54px] pb-[78px] max-sm:pt-[26px] max-sm:pb-12">
      <div className="site-container grid min-h-[610px] grid-cols-2 overflow-hidden rounded-[25px] border border-border bg-surface shadow-card max-sm:grid-cols-1">
        {children}
        <AuthVisual />
      </div>
    </main>
  )
}
