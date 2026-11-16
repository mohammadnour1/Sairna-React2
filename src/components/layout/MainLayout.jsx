import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SkipLink from '@/components/ui/SkipLink'
import Spinner from '@/components/ui/Spinner'
import AnnouncementBar from './AnnouncementBar'
import Footer from './Footer'
import Header from './Header'
import ScrollManager from './ScrollManager'

/**
 * App shell: skip link, announcement, header, page, footer.
 * The tracking page has no footer (reference `body.no-footer`).
 * `overflow-x: clip` (instead of the reference `overflow: hidden`) keeps sticky elements working.
 */
export default function MainLayout() {
  const { pathname } = useLocation()
  const hideFooter = pathname.startsWith('/tracking')

  return (
    <div className="overflow-x-clip">
      <ScrollManager />
      <SkipLink />
      <AnnouncementBar />
      <Header />
      <div id="main-content" tabIndex={-1} className="outline-none">
        <Suspense
          fallback={
            <div className="grid min-h-[70vh] place-items-center">
              <Spinner />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}
