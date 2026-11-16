import { useEffect } from 'react'

const HOME_TITLE = 'سيرنا | الرحلة بتبلّش من هون'

/** Sets the tab title: 'سيرنا | <page>' — or the home title when no page name is given. */
export function useDocumentTitle(pageName) {
  useEffect(() => {
    document.title = pageName ? `سيرنا | ${pageName}` : HOME_TITLE
  }, [pageName])
}
