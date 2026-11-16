// Header links. `match` lists extra path prefixes that make a link active
// (reference: "احجز رحلة" is active on results and booking).
export const MAIN_NAV = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/results', label: 'احجز رحلة', match: ['/results', '/booking'] },
  { to: '/companies', label: 'شركات النقل' },
  { to: '/trips', label: 'حجوزاتي' },
  { to: '/tracking', label: 'تتبّع الرحلة' },
]

export const FOOTER_COLUMNS = [
  {
    title: 'استكشف',
    links: [
      { to: '/', label: 'الرئيسية' },
      { to: '/results', label: 'احجز رحلتك' },
      { to: '/companies', label: 'شركات النقل' },
      { to: '/tracking', label: 'تتبّع رحلتك' },
    ],
  },
  {
    title: 'حسابك',
    links: [
      { to: '/login', label: 'تسجيل الدخول' },
      { to: '/register', label: 'إنشاء حساب' },
      { to: '/trips', label: 'حجوزاتي' },
      { to: '/account', label: 'الملف الشخصي' },
    ],
  },
  {
    title: 'نحن هون لمساعدتك',
    links: [
      { to: '/about', label: 'عن سيرنا' },
      { to: '/support', label: 'مركز المساعدة' },
    ],
  },
]

export const CONTACT_EMAIL = 'hello@sairna.example'
