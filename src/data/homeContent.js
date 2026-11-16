import { Bus, Search, Ticket } from 'lucide-react'

export const HERO_POINTS = ['حجز سهل', 'خيارات متنوعة', 'متابعة رحلتك']

export const PROOF_AVATARS = ['م', 'س', 'ع', 'ر']

// Static metrics. City/company counts are injected from the API (bug B12).
export const STATIC_METRICS = [
  { value: '+30', label: 'خيار رحلة باليوم' },
  { value: '24/7', label: 'سهولة الوصول للموقع' },
]

// Destination cards: matched to API cities by name. Cities not returned by the API are hidden.
export const FEATURED_DESTINATIONS = [
  { slug: 'damascus', name: 'دمشق', description: 'مدينة الياسمين' },
  { slug: 'aleppo', name: 'حلب', description: 'عاصمة الشهباء' },
  { slug: 'latakia', name: 'اللاذقية', description: 'نسمة من البحر' },
  { slug: 'homs', name: 'حمص', description: 'قلب سوريا' },
]

export const PROCESS_STEPS = [
  { icon: Search, number: '01', title: 'اختار وجهتك', text: 'حدّد من وين لوين وتاريخ الرحلة المناسب إلك.' },
  { icon: Bus, number: '02', title: 'لاقي رحلتك', text: 'قارن الشركات والمواعيد والأسعار واختر الأفضل.' },
  { icon: Ticket, number: '03', title: 'احجز مقعدك', text: 'اختار مقعدك وأكّد الحجز، وتذكرتك بتصير جاهزة.' },
]

export const TRACKING_FEATURES = ['عرض المسار على الخريطة', 'وقت وصول تقديري ومحطات الطريق']

// Default search route (reference): Aleppo → Damascus.
export const DEFAULT_ORIGIN_NAME = 'حلب'
export const DEFAULT_DESTINATION_NAME = 'دمشق'
// When a destination shortcut equals the current origin, the first different city from this list is used (bug B1).
export const FALLBACK_ORIGIN_NAMES = ['حلب', 'دمشق', 'حمص']
