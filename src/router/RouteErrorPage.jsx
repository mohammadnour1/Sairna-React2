import { useRouteError } from 'react-router-dom'

/**
 * Last-resort error screen (router `errorElement`). It renders outside the layout and
 * providers may be unavailable, so it uses plain markup + the design tokens only.
 */
export default function RouteErrorPage() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)
  return (
    <main className="grid min-h-screen place-items-center bg-bg p-6 text-center text-text">
      <div className="max-w-md rounded-[20px] border border-dashed border-border bg-surface px-6 py-[70px]">
        <h1 className="mb-1 text-xl">صار خطأ غير متوقع</h1>
        <p className="mb-5">جرّب تحدّث الصفحة، وإذا تكررت المشكلة ارجع للرئيسية.</p>
        <a
          href="/"
          className="inline-flex min-h-[49px] items-center rounded-xl bg-primary px-[22px] text-[13px] font-extrabold text-white"
        >
          رجوع للرئيسية
        </a>
      </div>
    </main>
  )
}
