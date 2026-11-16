import heroSvg from '@/assets/hero.svg'
import damascusSvg from '@/assets/city-damascus.svg'
import aleppoSvg from '@/assets/city-aleppo.svg'
import latakiaSvg from '@/assets/city-latakia.svg'
import homsSvg from '@/assets/city-homs.svg'

// Licensed photos from Wikimedia Commons (copied exactly from the reference PHOTO_SOURCES).
// Each chain is tried in order: wsrv.nl proxy → Wikimedia thumb → original → Special:Redirect.
// A local SVG is the final offline fallback (bug B21).
export const PHOTO_SOURCES = {
  hero: [
    'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/6/68/Syria%2C_Damascus%2C_The_Umayyad_Mosque.jpg&w=1100&q=85',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Syria,_Damascus,_The_Umayyad_Mosque.jpg/960px-Syria,_Damascus,_The_Umayyad_Mosque.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/68/Syria,_Damascus,_The_Umayyad_Mosque.jpg',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Syria,_Damascus,_The_Umayyad_Mosque.jpg',
    heroSvg,
  ],
  damascus: [
    'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/6/68/Syria%2C_Damascus%2C_The_Umayyad_Mosque.jpg&w=1100&q=85',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Syria,_Damascus,_The_Umayyad_Mosque.jpg/960px-Syria,_Damascus,_The_Umayyad_Mosque.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/68/Syria,_Damascus,_The_Umayyad_Mosque.jpg',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Syria,_Damascus,_The_Umayyad_Mosque.jpg',
    damascusSvg,
  ],
  aleppo: [
    'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/5/59/Citadel_of_Aleppo%2C_Gates%2C_Aleppo%2C_Syria.jpg&w=1100&q=85',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Citadel_of_Aleppo,_Gates,_Aleppo,_Syria.jpg/960px-Citadel_of_Aleppo,_Gates,_Aleppo,_Syria.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/59/Citadel_of_Aleppo,_Gates,_Aleppo,_Syria.jpg',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Citadel_of_Aleppo,_Gates,_Aleppo,_Syria.jpg',
    aleppoSvg,
  ],
  latakia: [
    'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/d/d3/Beach_Latakia_1.jpg&w=1100&q=85',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Beach_Latakia_1.jpg/960px-Beach_Latakia_1.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d3/Beach_Latakia_1.jpg',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Beach_Latakia_1.jpg',
    latakiaSvg,
  ],
  homs: [
    'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/e/eb/Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg&w=1100&q=85',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg/960px-Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/eb/Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg',
    homsSvg,
  ],
}

/** Footer credits (verbatim from the reference footer). */
export const PHOTO_CREDITS = [
  {
    href: 'https://commons.wikimedia.org/wiki/File:Syria,_Damascus,_The_Umayyad_Mosque.jpg',
    label: 'دمشق / الهيرو — Vyacheslav Argenberg (CC BY 4.0)',
  },
  {
    href: 'https://commons.wikimedia.org/wiki/File:Citadel_of_Aleppo,_Gates,_Aleppo,_Syria.jpg',
    label: 'حلب — Vyacheslav Argenberg (CC BY 4.0)',
  },
  { href: 'https://commons.wikimedia.org/wiki/File:Beach_Latakia_1.jpg', label: 'اللاذقية — Ahmad Ahmad (CC BY-SA 3.0)' },
  {
    href: 'https://commons.wikimedia.org/wiki/File:Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg',
    label: 'حمص — Dosseman (CC BY-SA 4.0)',
  },
]
