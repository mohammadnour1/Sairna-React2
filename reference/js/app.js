/* سيرنا — مشروع واجهات تعليمي. البيانات والحجوزات والتتبع تجريبية، ولا توجد خدمات دفع أو GPS حقيقي. */
(() => {
  'use strict';
  const $ = (s, parent = document) => parent.querySelector(s);
  const app = $('#app');
  const CITY_DATA = [
    ['damascus','دمشق',33.5138,36.2765],['aleppo','حلب',36.2021,37.1343],
    ['homs','حمص',34.7324,36.7137],['hama','حماة',35.1318,36.7578],
    ['latakia','اللاذقية',35.5317,35.7901],['tartus','طرطوس',34.8959,35.8866],
    ['idlib','إدلب',35.9306,36.6339],['deir','دير الزور',35.3359,40.1408],
    ['raqqa','الرقة',35.95,39.0167],['hasakah','الحسكة',36.5024,40.7477],
    ['daraa','درعا',32.6189,36.1021],['sweida','السويداء',32.7081,36.5695],
    ['quneitra','القنيطرة',33.1265,35.8246],['rif-damascus','ريف دمشق',33.63,36.46]
  ];
  const cities = CITY_DATA.map(([id,name,lat,lng]) => ({id,name,lat,lng}));
  const cityById = id => cities.find(c => c.id === id) || cities[0];
  const companies = [
    {id:'sham',name:'الشام للنقل',short:'ش',color:'#109d9c',bg:'#e7f9f6',rating:'4.9',tag:'الأعلى تقييماً',features:['مكيّف','Wi-Fi','شحن USB'],about:'رحلات منتظمة بين المحافظات وتجربة سفر مريحة.'},
    {id:'furat',name:'الفرات للسياحة',short:'ف',color:'#e69a46',bg:'#fff3df',rating:'4.8',tag:'الأكثر حجزاً',features:['مكيّف','مقاعد واسعة'],about:'أسطول حديث ومواعيد متنوعة على مدار الأسبوع.'},
    {id:'nawras',name:'النورس إكسبرس',short:'ن',color:'#5085e6',bg:'#e9efff',rating:'4.7',tag:'سعر مميّز',features:['مكيّف','Wi-Fi'],about:'رحلات يومية وخيارات مناسبة لكل المسافرين.'},
    {id:'ittihad',name:'الاتحاد للنقل',short:'ا',color:'#9969ce',bg:'#f1eafe',rating:'4.6',tag:'مواعيد مرنة',features:['مكيّف','شحن USB'],about:'ربط المدن السورية بمواعيد مرنة وسهلة الحجز.'}
  ];
  const ICONS = {
    'search':'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    'pin':'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.7"/>',
    'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    'clock':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'arrow-right':'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    'arrow-left':'<path d="M19 12H5m6-6-6 6 6 6"/>',
    'chevron-down':'<path d="m6 9 6 6 6-6"/>',
    'chevron-left':'<path d="m14 6-6 6 6 6"/>',
    'chevron-right':'<path d="m10 6 6 6-6 6"/>',
    'swap':'<path d="M4 7h16m-5-4 5 4-5 4M20 17H4m5-4-5 4 5 4"/>',
    'user':'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    'users':'<path d="M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1m17-12a4 4 0 0 1 0 8m3 4v-1a4 4 0 0 0-3-3.9"/><circle cx="9" cy="7" r="4"/>',
    'ticket':'<path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a3 3 0 0 0 0-6Z"/><path d="M13 3v3m0 3v2m0 3v2m0 3v2"/>',
    'bus':'<rect x="4" y="3" width="16" height="16" rx="3"/><path d="M4 11h16M8 19v2m8-2v2M8 15h.01M16 15h.01"/>',
    'route':'<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8"/>',
    'shield':'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    'headphones':'<path d="M4 14v-3a8 8 0 0 1 16 0v3m-16 0h3v6H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Zm16 0h-3v6h3a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"/>',
    'check':'<path d="m5 12 5 5L20 7"/>',
    'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    'star':'<path d="m12 2 3.2 6.5 7.2 1-5.2 5.1 1.2 7.1L12 18.4l-6.4 3.3 1.2-7.1L1.6 9.5l7.2-1Z"/>',
    'heart':'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    'hand':'<path d="M8 13V5a2 2 0 0 1 4 0v6-8a2 2 0 1 1 4 0v8-6a2 2 0 1 1 4 0v9a8 8 0 0 1-8 8h-1a8 8 0 0 1-6.5-3.4L2.5 16a2 2 0 0 1 3-2.6L8 16"/>',
    'steering':'<path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 0v7m-9 2 6 2m12-2-6 2m-6 0 3 7m3-7-3 7"/>',
    'wifi':'<path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0m-9 4a4 4 0 0 1 6 0M12 20h.01"/>',
    'snow':'<path d="M12 2v20M4 6l16 12M20 6 4 18M8 4l4 4 4-4M8 20l4-4 4 4"/>',
    'plug':'<path d="M7 3v5m10-5v5M6 8h12v4a6 6 0 0 1-12 0V8Zm6 10v4"/>',
    'filter':'<path d="M4 5h16M7 12h10m-7 7h4"/>',
    'seat':'<path d="M7 11V6a4 4 0 0 1 8 0v5M5 11h12a2 2 0 0 1 2 2v4H3v-4a2 2 0 0 1 2-2Zm-1 6v4m14-4v4"/>',
    'wallet':'<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18m-5 5h3"/>',
    'info':'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    'navigation':'<path d="m3 11 18-8-8 18-2-8-8-2Z"/>',
    'phone':'<path d="M6 3h4l1 5-2 2a15 15 0 0 0 5 5l2-2 5 1v4c0 2-2 3-4 3A16 16 0 0 1 3 7c0-2 1-4 3-4Z"/>',
    'mail':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    'lock':'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
    'eye':'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off':'<path d="m3 3 18 18M10 5.3a10 10 0 0 1 2-.3c6 0 10 7 10 7a17 17 0 0 1-3 3.6M6 6C3.6 8 2 12 2 12s4 7 10 7c1.5 0 3-.4 4.2-1.1"/>',
    'card':'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/>',
    'logout':'<path d="M10 17l5-5-5-5m5 5H3m9-9h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
    'menu':'<path d="M4 7h16M4 12h16M4 17h16"/>',
    'x':'<path d="M5 5 19 19M19 5 5 19"/>',
    'sun':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'moon':'<path d="M20.4 15.1A9 9 0 0 1 8.9 3.6 9 9 0 1 0 20.4 15.1Z"/>',
    'sparkle':'<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z"/>',
    'globe':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/>',
    'briefcase':'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    'help':'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-1.5 1-2 1.5-2 3m0 3h.01"/>',
    'refresh':'<path d="M20 11a8 8 0 0 0-14-5L3 9m0-6v6h6M4 13a8 8 0 0 0 14 5l3-3m0 6v-6h-6"/>',
    'copy':'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    'play':'<path d="m8 5 11 7-11 7V5Z"/>',
    'pause':'<path d="M8 5v14m8-14v14"/>',
    'minus':'<path d="M5 12h14"/>',
    'plus':'<path d="M5 12h14M12 5v14"/>'
  };
  // Lucide Icons (vanilla JS): when the CDN is available, the library replaces
  // each placeholder with its official vector SVG. The original lightweight
  // vector is kept inside the placeholder as an offline fallback, never emoji.
  const LUCIDE_NAMES = {
    pin:'map-pin', swap:'arrow-left-right', 'check-circle':'circle-check',
    snow:'snowflake', seat:'armchair', card:'credit-card', logout:'log-out',
    sparkle:'sparkles', shield:'shield-check', help:'circle-help',
    steering:'gauge', hand:'hand', 'star-fill':'star'
  };
  const icon = (name, size = 20) => {
    const lucideName = LUCIDE_NAMES[name] || name;
    const fallbackPath = ICONS[name] || ICONS.info;
    return `<i class="sairna-icon" data-lucide="${lucideName}" aria-hidden="true" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${fallbackPath}</svg></i>`;
  };
  const refreshIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons({attrs:{'stroke-width':1.85}}); }
      catch (err) { console.warn('تعذّر تهيئة Lucide، تم استخدام الأيقونات المحلية البديلة.', err); }
    }
  };
  // The library is loaded asynchronously. This also covers late CDN loading.
  window.sairnaRefreshIcons = refreshIcons;
  const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stored = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { console.warn('Local storage unavailable'); } };
  const nextDate = () => { const d = new Date(); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const money = n => Number(n).toLocaleString('en-US') + ' ل.س';
  const dateText = s => new Intl.DateTimeFormat('ar-SY',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${s}T12:00:00`));
  const state = {
    theme: stored('sairna-theme','light'), user: stored('sairna-user',null), bookings:stored('sairna-bookings',[]),
    search:{origin:'aleppo',destination:'damascus',date:nextDate(),people:1},
    company:'all', time:'all', sort:'earliest', selectedTrip:null, selectedSeats:[], bookingStep:'seats', passengers:[], payment:'office',
    lastBooking:null, afterAuth:null, trackId:null, progress:.48, playing:true, timer:null, map:null, mapLayer:null, marker:null, menuOpen:false
  };
  document.documentElement.dataset.theme = state.theme;
  const pickCity = (id, name) => `<option value="${id}" ${state.search[name]===id?'selected':''}>${escapeHTML(cityById(id).name)}</option>`;
  const optionsCities = selected => cities.map(c => `<option value="${c.id}" ${selected===c.id?'selected':''}>${c.name}</option>`).join('');
  const logo = () => `<a href="#home" class="brand" aria-label="سيرنا - الرئيسية"><span class="brand-icon"><img src="assets/logo.svg" alt="" /></span><span class="brand-text"><strong>سيرنا<span class="brand-dot">.</span></strong><small>رحلتك بتبلّش من هون</small></span></a>`;
  const avatar = () => `<span class="avatar">${escapeHTML((state.user?.name || 'م').trim()[0])}</span>`;
  function header() {
    const page = location.hash.replace('#','') || 'home';
    const links = [['home','الرئيسية'],['results','احجز رحلة'],['companies','شركات النقل'],['trips','حجوزاتي'],['tracking','تتبّع الرحلة']];
    return `<div class="announcement"><span class="announcement-dot"></span> رحلات بين المدن السورية، بخطوات بسيطة وواضحة <span class="ann-star">${icon('sparkle',13)}</span></div>
      <header class="site-header"><div class="container header-inner">${logo()}
      <nav class="desktop-nav" aria-label="التنقل الرئيسي">${links.map(([id,label]) => `<a href="#${id}" class="nav-link ${page===id || (id==='results' && page==='booking') ? 'active':''}">${label}</a>`).join('')}</nav>
      <div class="header-actions"><button class="icon-button theme-switch" type="button" data-action="theme" aria-label="تبديل المظهر" title="تبديل المظهر">${icon(state.theme==='light'?'moon':'sun',19)}</button>${state.user ? `<a href="#account" class="user-menu">${avatar()}<span class="user-name">${escapeHTML(state.user.name.split(' ')[0])}</span>${icon('chevron-down',14)}</a>` : `<a href="#login" class="login-link">دخول</a><a href="#register" class="btn btn-dark btn-sm">إنشاء حساب ${icon('arrow-left',16)}</a>`}<button type="button" class="mobile-toggle icon-button" data-action="menu" aria-label="فتح القائمة">${icon(state.menuOpen?'x':'menu',24)}</button></div></div>
      <div class="mobile-panel ${state.menuOpen?'open':''}">${links.map(([id,label]) => `<a href="#${id}" class="mobile-link ${page===id?'active':''}">${label}${icon('chevron-left',16)}</a>`).join('')}${state.user ? `<a href="#account" class="mobile-link">حسابي</a>` : `<a href="#login" class="mobile-link">تسجيل الدخول</a><a href="#register" class="mobile-link">إنشاء حساب</a>`}</div></header>`;
  }
  function footer() {
    return `<footer class="footer"><div class="container footer-main"><div class="footer-brand">${logo()}<p>طريقة أجمل وأسهل للسفر بين المحافظات السورية. ابحث، اختار، واحجز بكل راحة.</p><div class="footer-social"><span>${icon('globe',17)}</span><span>${icon('mail',17)}</span><span>${icon('phone',17)}</span></div></div><div class="footer-col"><h4>استكشف</h4><a href="#home">الرئيسية</a><a href="#results">احجز رحلتك</a><a href="#companies">شركات النقل</a><a href="#tracking">تتبّع رحلتك</a></div><div class="footer-col"><h4>حسابك</h4><a href="#login">تسجيل الدخول</a><a href="#register">إنشاء حساب</a><a href="#trips">حجوزاتي</a><a href="#account">الملف الشخصي</a></div><div class="footer-col"><h4>نحن هون لمساعدتك</h4><a href="#about">عن سيرنا</a><a href="#support">مركز المساعدة</a><div class="footer-contact">${icon('mail',16)} hello@sairna.example</div></div></div><div class="container footer-bottom"><span>© 2026 سيرنا — نموذج تعليمي لتصميم الواجهات، ليس خدمة حجوزات فعلية.</span><span>صُمّم بحب لسوريا <span class="heart">${icon('heart',13)}</span></span></div></footer>`;
  }
  const eyebrow = text => `<span class="eyebrow"><span class="mini-star">${icon('sparkle',13)}</span> ${text}</span>`;
  const field = (label, inner, extra='') => `<label class="search-field ${extra}"><span class="field-label">${label}</span>${inner}</label>`;
  function searchForm(context='home') {
    return `<form class="search-form ${context==='home'?'home-search':''}" data-form="search">
      ${field('من وين؟',`${icon('pin',19)}<select name="origin" aria-label="محافظة الانطلاق" required>${optionsCities(state.search.origin)}</select>`,'from-field')}
      <button class="swap-button" type="button" data-action="swap" aria-label="تبديل المحافظات">${icon('swap',19)}</button>
      ${field('لوين؟',`${icon('pin',19)}<select name="destination" aria-label="محافظة الوصول" required>${optionsCities(state.search.destination)}</select>`,'to-field')}
      ${field('تاريخ الرحلة',`${icon('calendar',19)}<input name="date" type="date" value="${state.search.date}" min="${new Date().toISOString().slice(0,10)}" required />`,'date-field')}
      ${field('المسافرين',`${icon('users',19)}<select name="people" aria-label="عدد المسافرين">${[1,2,3,4].map(n=>`<option value="${n}" ${+state.search.people===n?'selected':''}>${n} ${n===1?'مسافر':'مسافرين'}</option>`).join('')}</select>`,'people-field')}
      <button type="submit" class="btn btn-primary search-submit">${icon('search',19)} ابحث عن رحلات</button>
    </form>`;
  }
  function tripSeed() {
    const o = cityById(state.search.origin), d=cityById(state.search.destination);
    const latDist = (o.lat-d.lat)*110, lonDist=(o.lng-d.lng)*88;
    const dist = Math.max(75,Math.round(Math.sqrt(latDist*latDist+lonDist*lonDist)*1.20));
    const duration = Math.max(90,Math.round(dist/63*60)+15);
    const base = Math.max(35000,Math.round((dist*265+19000)/5000)*5000);
    const rows = [
      {company:companies[0],departure:'07:30',diff:0,price:base+15000,seats:18},
      {company:companies[1],departure:'09:00',diff:18,price:base,seats:12},
      {company:companies[2],departure:'11:30',diff:6,price:base-5000,seats:23},
      {company:companies[3],departure:'14:15',diff:22,price:base+5000,seats:9},
      {company:companies[0],departure:'17:00',diff:0,price:base+12000,seats:15},
      {company:companies[1],departure:'20:30',diff:18,price:base-2000,seats:8}
    ];
    return rows.map((t,i) => {
      const start = Number(t.departure.slice(0,2))*60 + Number(t.departure.slice(3));
      const mins = start+duration+t.diff;
      return { ...t, id:`${o.id}-${d.id}-${i}`, origin:o, destination:d, duration:duration+t.diff, arrive:`${String(Math.floor(mins/60)%24).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`,distance:dist,date:state.search.date };
    });
  }
  const durationText = m => `${Math.floor(m/60)} س ${m%60} د`;
  const companyLogo = (company, size='normal') => `<span class="company-logo ${size}" style="--logo-color:${company.color};--logo-bg:${company.bg}">${company.short}</span>`;
  const serviceBadges = company => company.features.map(f => `<span class="service-pill">${f==='Wi-Fi'?icon('wifi',13):f==='مكيّف'?icon('snow',13):icon('plug',13)} ${f}</span>`).join('');
  function homePage() {
    return `<main><section class="hero-section"><div class="container"><div class="hero-grid"><div class="hero-copy">
      ${eyebrow('أهلاً فيك بسيرنا')}<h1>المحطة الجاية؟<br><span class="gradient-text">على كيفك.</span></h1>
      <p>من حلب لدمشق، ومن الساحل للجزيرة. لاقي الرحلة اللي بتناسبك، اختار مقعدك، وخلّي الطريق علينا.</p>
      <div class="hero-points"><span>${icon('check-circle',17)} حجز سهل</span><span>${icon('check-circle',17)} خيارات متنوعة</span><span>${icon('check-circle',17)} متابعة رحلتك</span></div>
      <div class="hero-social-proof"><div class="proof-avatars"><span>م</span><span>س</span><span>ع</span><span>ر</span></div><div><div class="proof-stars">${Array.from({length:5},()=>icon('star',14)).join('')} <b>4.9/5</b></div><small>تجربة سفر بتستاهل تجرّبها</small></div></div>
    </div><div class="hero-visual"><div class="hero-image-wrap"><img src="assets/hero.svg" alt="حافلة سيرنا حديثة على طريق بين المدن السورية"/><div class="floating-stat stat-top">${icon('pin',18)} <div><b>14 محافظة</b><small>وجهات بتجمعنا</small></div></div><div class="floating-stat stat-bottom"><span class="floating-circle">${icon('shield',20)}</span><div><b>سافر براحة</b><small>من أول حجز لآخر محطة</small></div></div></div><div class="hero-orbit orbit-a"></div><div class="hero-orbit orbit-b"></div></div></div>
      <div class="search-shell"><div class="search-shell-heading"><div><span class="search-small-dot"></span> <strong>وين رحلتك الجاية؟</strong><span>اختار وجهتك وباقي التفاصيل علينا</span></div><div class="steps-tag">${icon('sparkle',16)} الحجز بـ 3 خطوات</div></div>${searchForm('home')}</div>
    </div></section>
    <section class="metrics-strip"><div class="container metrics-inner"><div><strong>14</strong><span>محافظة سورية</span></div><span class="metrics-divider"></span><div><strong>4</strong><span>شركات نقل تجريبية</span></div><span class="metrics-divider"></span><div><strong>+30</strong><span>خيار رحلة باليوم</span></div><span class="metrics-divider"></span><div><strong>24/7</strong><span>سهولة الوصول للموقع</span></div></div></section>
    <section class="section destinations"><div class="container"><div class="section-title-row"><div>${eyebrow('اكتشف سوريا')}<h2>على وين حابب <span>تسافر؟</span></h2><p>وجهات مختلفة، ونفس الشعور الحلو لما تكون بالطريق.</p></div><a href="#results" class="text-link">استكشف الرحلات ${icon('arrow-left',18)}</a></div><div class="destination-grid">
      ${[['damascus','دمشق','مدينة الياسمين','city-damascus.svg'],['aleppo','حلب','عاصمة الشهباء','city-aleppo.svg'],['latakia','اللاذقية','نسمة من البحر','city-latakia.svg'],['homs','حمص','قلب سوريا','city-homs.svg']].map(([id,name,desc,file],i) => `<button type="button" class="destination-card destination-${i}" data-action="destination" data-dest="${id}"><img src="assets/${file}" alt="رسمة لمدينة ${name}"/><span class="destination-overlay"><span><strong>${name}</strong><small>${desc}</small></span><span class="destination-arrow">${icon('arrow-left',18)}</span></span></button>`).join('')}
    </div></div></section>
    <section class="section process-section"><div class="container"><div class="section-centered">${eyebrow('السفر صار أبسط')}<h2>3 خطوات... <span>وتكون بالطريق</span></h2><p>ما في داعي للتعقيد. كل شي مرتب بواجهة وحدة.</p></div><div class="process-grid">
      ${[['search','01','اختار وجهتك','حدّد من وين لوين وتاريخ الرحلة المناسب إلك.'],['bus','02','لاقي رحلتك','قارن الشركات والمواعيد والأسعار واختر الأفضل.'],['ticket','03','احجز مقعدك','اختار مقعدك وأكّد الحجز، وتذكرتك بتصير جاهزة.']].map(([ic,n,t,d])=>`<div class="process-card"><span class="process-number">${n}</span><div class="process-icon">${icon(ic,28)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div></div></section>
    <section class="section"><div class="container"><div class="split-feature"><div class="feature-content">${eyebrow('وين وصلت الرحلة؟')}<h2>الطريق قدامك.<br><span>لحظة بلحظة؟</span></h2><p>بصفحة التتبّع بتشوف خط سير الرحلة ومحطاتها وحالتها ضمن نموذج تفاعلي سهل وواضح.</p><div class="feature-check">${icon('check-circle',18)} عرض المسار على الخريطة</div><div class="feature-check">${icon('check-circle',18)} وقت وصول تقديري ومحطات الطريق</div><a href="#tracking" class="btn btn-primary">جرّب تتبّع رحلة ${icon('arrow-left',18)}</a><small class="demo-note">* الخريطة وحركة الحافلة في هذا النموذج توضيحية وليست GPS مباشر.</small></div><div class="feature-map-preview"><div class="map-preview-top"><span class="live-indicator"></span> معاينة مسار رحلة <b>حلب ← دمشق</b></div>${miniRouteGraphic()}<div class="map-preview-footer"><span>${icon('pin',15)} حلب</span><div class="preview-line"><span></span></div><span>${icon('pin',15)} دمشق</span></div></div></div></div></section>
    <section class="cta-wrap"><div class="container"><div class="cta-banner"><div>${eyebrow('جاهز تغير جو؟')}<h2>الطريق الجاي بيناديك.</h2><p>دوّر على رحلة، واحجز أول مقعد إلك.</p></div><a href="#results" class="btn btn-white">يلا نلاقي رحلة ${icon('arrow-left',18)}</a><div class="cta-decor d1"></div><div class="cta-decor d2"></div></div></div></section></main>`;
  }
  function miniRouteGraphic() {
    return `<svg class="mini-map-svg" viewBox="0 0 560 310" role="img" aria-label="معاينة خط سير حلب إلى دمشق"><defs><pattern id="dots" width="23" height="23" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#bcd8cf"/></pattern></defs><rect width="560" height="310" rx="24" fill="#eaf5f1"/><rect width="560" height="310" fill="url(#dots)"/><path d="M30 251Q180 189 230 249T530 179M20 78Q183 127 270 52T530 82" fill="none" stroke="#d4e9e2" stroke-width="38"/><path d="M100 47Q183 127 270 52T530 82M20 250Q180 189 230 249T530 179" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="9 7"/><path d="M130 84C230 114 200 212 339 205S435 175 461 246" fill="none" stroke="#11a997" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 0"/><circle cx="130" cy="84" r="13" fill="#fff" stroke="#16ac9d" stroke-width="6"/><circle cx="461" cy="246" r="13" fill="#fff" stroke="#183e54" stroke-width="6"/><g transform="translate(315 199)"><circle r="28" fill="#fff"/><path d="M-15-10h30v20h-30Z" fill="#0d998f" rx="3"/><circle cx="-9" cy="11" r="4" fill="#143e51"/><circle cx="9" cy="11" r="4" fill="#143e51"/></g><g font-family="Cairo,Arial" font-size="18" font-weight="800" fill="#173c52"><text x="105" y="54">حلب</text><text x="421" y="280">دمشق</text></g></svg>`;
  }
  function resultsPage() {
    const all = tripSeed();
    let filtered = all.filter(t => (state.company==='all'||t.company.id===state.company) && (state.time==='all'|| (state.time==='morning'?+t.departure.slice(0,2)<12:state.time==='evening'?+t.departure.slice(0,2)>=17:+t.departure.slice(0,2)>=12&&+t.departure.slice(0,2)<17)));
    filtered = [...filtered].sort((a,b) => state.sort==='cheap'? a.price-b.price : state.sort==='quick'? a.duration-b.duration : a.departure.localeCompare(b.departure));
    return `<main class="inner-main"><section class="page-banner"><div class="container"><div class="breadcrumb"><a href="#home">الرئيسية</a>${icon('chevron-left',14)} <span>نتائج البحث</span></div><div class="banner-heading"><div>${eyebrow('لنكمل الطريق')}<h1>اختار الرحلة <span>اللي بتشبهك.</span></h1><p>قارن بين الشركات والأوقات، واحجز مقعدك بكل سهولة.</p></div><div class="banner-art">${icon('bus',70)}</div></div></div></section><section class="container results-content"><div class="compact-search">${searchForm('results')}</div><div class="company-pick-section"><div class="pick-heading"><div><span class="pick-step">01</span><div><h3>اختار شركة النقل</h3><p>حدد الشركة اللي بتفضّلها، ومنعرضلك مواعيدها المتاحة.</p></div></div><span class="pick-next">02 ${icon('arrow-left',15)} اختار الوقت والمقعد</span></div><div class="company-pick-grid"><button class="company-pick ${state.company==='all'?'active':''}" data-action="choosecompany" data-company="all"><span class="company-pick-all">${icon('bus',24)}</span><span>كل الشركات</span><small>قارن الخيارات</small></button>${companies.map(c=>`<button class="company-pick ${state.company===c.id?'active':''}" data-action="choosecompany" data-company="${c.id}">${companyLogo(c,'tiny')}<span>${c.name}</span><small class="company-pick-rating">${icon('star',12)} <span>${c.rating}</span></small></button>`).join('')}</div></div><div class="results-heading"><div><h2>${filtered.length} رحلات متاحة <span class="result-counter">${cityById(state.search.origin).name} ${icon('arrow-left',17)} ${cityById(state.search.destination).name}</span></h2><p>${icon('calendar',15)} ${dateText(state.search.date)} · ${state.search.people} ${state.search.people===1?'مسافر':'مسافرين'}</p></div><div class="sort-box"><label for="sort-select">ترتيب حسب</label><select id="sort-select" data-filter="sort"><option value="earliest" ${state.sort==='earliest'?'selected':''}>وقت الانطلاق</option><option value="cheap" ${state.sort==='cheap'?'selected':''}>أقل سعر</option><option value="quick" ${state.sort==='quick'?'selected':''}>أقصر مدة</option></select></div></div>
    <div class="results-layout"><aside class="filters-panel"><div class="filters-top"><h3>${icon('filter',19)} تصفية النتائج</h3><button class="quiet-button" data-action="clearfilters">إعادة ضبط</button></div><div class="filter-group"><h4>شركة النقل</h4><div class="radio-list"><label><input type="radio" name="company-filter" value="all" ${state.company==='all'?'checked':''}> كل الشركات <span>6</span></label>${companies.map(c=>`<label><input type="radio" name="company-filter" value="${c.id}" ${state.company===c.id?'checked':''}> ${c.name} <span>${all.filter(t=>t.company.id===c.id).length}</span></label>`).join('')}</div></div><div class="filter-group"><h4>وقت الانطلاق</h4><div class="radio-list">${[['all','كل الأوقات'],['morning','صباحاً (قبل 12)'],['afternoon','ظهراً (12–17)'],['evening','مساءً (بعد 17)']].map(([v,t])=>`<label><input type="radio" name="time-filter" value="${v}" ${state.time===v?'checked':''}> ${t}</label>`).join('')}</div></div><div class="filter-info">${icon('shield',22)}<p><b>الحجز بشكل واضح</b><br>كل تفاصيل الرحلة قدامك قبل التأكيد.</p></div></aside>
    <div class="trip-list">${filtered.length? filtered.map(tripCard).join('') : `<div class="empty-state">${icon('search',42)}<h3>ما في رحلات مطابقة</h3><p>جرّب تغيّر الشركة أو وقت الانطلاق.</p><button class="btn btn-primary" data-action="clearfilters">عرض كل الرحلات</button></div>`}</div></div></section></main>`;
  }
  function tripCard(t) {
    return `<article class="trip-card"><div class="trip-card-header"><div class="trip-company">${companyLogo(t.company)}<div><strong>${t.company.name}</strong><span class="rating">${icon('star',14)} ${t.company.rating} <i>·</i> ${t.company.tag}</span></div></div><span class="trip-type">${icon('bus',16)} حافلة سياحية</span></div><div class="trip-card-body"><div class="trip-timing"><div class="timing-point"><b>${t.departure}</b><span>${t.origin.name}</span></div><div class="timing-route"><span>${durationText(t.duration)}</span><div class="route-line"><i></i>${icon('bus',18)}<i></i></div><small>مباشرة</small></div><div class="timing-point"><b>${t.arrive}</b><span>${t.destination.name}</span></div></div><div class="trip-booking"><small>السعر للشخص</small><b>${money(t.price)}</b><span class="seats-left">${icon('seat',15)} ${t.seats} مقعد متاح</span><button class="btn btn-primary" data-action="selecttrip" data-id="${t.id}">اختيار المقاعد ${icon('arrow-left',16)}</button></div></div><div class="trip-card-footer">${serviceBadges(t.company)}<span class="trip-distance">${icon('route',15)} ~${t.distance} كم</span></div></article>`;
  }
  function companiesPage() {
    return `<main class="inner-main"><section class="page-banner"><div class="container"><div class="breadcrumb"><a href="#home">الرئيسية</a>${icon('chevron-left',14)} <span>شركات النقل</span></div>${eyebrow('شركاء الطريق')}<h1 class="page-title">شركات بتوصلك <span>لوين ما بدك.</span></h1><p>تعرّف على شركات النقل الموجودة في النموذج واختار الأنسب إلك.</p></div></section><section class="container section"><div class="companies-grid">${companies.map(c=>`<article class="company-card"><div class="company-card-head">${companyLogo(c,'large')}<span class="tag teal-tag">${icon('star',14)} ${c.rating} / 5</span></div><h2>${c.name}</h2><p>${c.about}</p><div class="company-amenities">${serviceBadges(c)}</div><div class="company-meta"><div><b>+12</b><small>وجهة تجريبية</small></div><div><b>يومياً</b><small>مواعيد متاحة</small></div></div><button class="btn btn-outline full" data-action="company-routes" data-company="${c.id}">عرض رحلات الشركة ${icon('arrow-left',17)}</button></article>`).join('')}</div><p class="disclaimer-line">ملاحظة: أسماء الشركات وتقييماتها وأوقات الرحلات المعروضة بيانات توضيحية ضمن مشروع التدريب.</p></section></main>`;
  }
  function bookingPage() {
    if (!state.selectedTrip) { state.selectedTrip = tripSeed()[0]; }
    const t = state.selectedTrip, people=+state.search.people;
    const steps=[['seats','اختيار المقاعد'],['passengers','بيانات المسافرين'],['review','المراجعة والتأكيد']];
    const index=steps.findIndex(s=>s[0]===state.bookingStep);
    return `<main class="inner-main booking-page"><section class="container booking-head"><div class="breadcrumb"><a href="#home">الرئيسية</a>${icon('chevron-left',14)}<a href="#results">الرحلات</a>${icon('chevron-left',14)}<span>إتمام الحجز</span></div><div class="booking-title-row"><div>${eyebrow('باقي شوي وتوصل')}<h1>كمّل حجز <span>رحلتك.</span></h1></div><a href="#results" class="quiet-back">${icon('arrow-right',17)} تغيير الرحلة</a></div><div class="stepper">${steps.map(([key,label],i)=>`<div class="step ${i===index?'current':''} ${i<index?'done':''}"><span>${i<index?icon('check',17):i+1}</span><b>${label}</b></div>${i<2?'<div class="step-connector"></div>':''}`).join('')}</div></section><section class="container booking-layout"><div class="booking-main-card">
      ${state.bookingStep==='seats'?seatStage(t,people):state.bookingStep==='passengers'?passengerStage(people):reviewStage(t)}
      <div class="booking-controls">${state.bookingStep==='seats'?`<a href="#results" class="btn btn-subtle">${icon('arrow-right',17)} رجوع للرحلات</a>`:`<button class="btn btn-subtle" data-action="bookingback">${icon('arrow-right',17)} السابق</button>`}<button class="btn btn-primary" data-action="bookingnext">${state.bookingStep==='review'?'تأكيد الحجز':'متابعة الحجز'} ${icon('arrow-left',17)}</button></div>
    </div><aside class="summary-card"><div class="summary-title">${icon('ticket',21)} <h3>ملخص الحجز</h3></div><div class="summary-company">${companyLogo(t.company)}<div><strong>${t.company.name}</strong><small>رحلة مباشرة</small></div></div><div class="summary-route"><div><small>الانطلاق</small><b>${t.origin.name}</b><span>${t.departure}</span></div><span class="summary-arrow">${icon('arrow-left',21)}</span><div><small>الوصول</small><b>${t.destination.name}</b><span>${t.arrive}</span></div></div><div class="summary-details"><div><span>تاريخ الرحلة</span><strong>${dateText(t.date)}</strong></div><div><span>المسافرين</span><strong>${people}</strong></div><div><span>المقاعد</span><strong>${state.selectedSeats.length?state.selectedSeats.sort((a,b)=>a-b).join('، '):'لم تُحدّد بعد'}</strong></div><div><span>السعر للمسافر</span><strong>${money(t.price)}</strong></div></div><div class="summary-total"><span>السعر الإجمالي</span><b>${money(t.price*people)}</b></div><p class="summary-trust">${icon('shield',17)} لا يوجد دفع حقيقي ضمن المشروع التعليمي.</p></aside></section></main>`;
  }
  function seatStage(t,people) {
    const unavailable = new Set([2,7,10,16,21,29,30,38,43]);
    const rows = Array.from({length:11},(_,i) => {
      const number=i*4+1;
      return `<div class="seat-row"><span class="seat-row-index">${String(i+1).padStart(2,'0')}</span>${[number,number+1].map(n => seat(n,unavailable)).join('')}<span class="seat-aisle"></span>${[number+2,number+3].map(n => seat(n,unavailable)).join('')}</div>`;
    }).join('');
    return `<div class="stage-head"><h2>اختار مكانك المفضّل ${icon('seat',23)}</h2><p>اختار ${people} ${people===1?'مقعد':'مقاعد'} من المخطط. المقاعد الرمادية محجوزة مسبقاً.</p></div><div class="seat-stage"><div class="seat-map-card"><div class="bus-driver"><span>${icon('bus',20)} مقدمة الحافلة</span><span class="steering-wheel">${icon('steering',27)}</span></div><div class="bus-cabin">${rows}</div><div class="seat-legend"><span><i class="legend-available"></i> متاح</span><span><i class="legend-selected"></i> مختار</span><span><i class="legend-busy"></i> محجوز</span></div></div><div class="seat-stage-aside"><div class="seat-hint-card"><span class="hint-icon">${icon('seat',24)}</span><h3>مكانك، راحتك.</h3><p>اختار مقعدك حسب تفضيلك. المكان عند الشباك أو بالممر، الخيار إلك.</p><div class="seat-counter"><span>المقاعد المختارة</span><strong>${state.selectedSeats.length} / ${people}</strong></div><div class="seat-selection-tags">${state.selectedSeats.length?state.selectedSeats.map(n=>`<span>مقعد ${n}</span>`).join(''):'<span class="muted">لسا ما اخترت مقعد</span>'}</div></div><div class="soft-info">${icon('info',19)} <span>لتكمل، اختار عدد مقاعد مساوي لعدد المسافرين.</span></div></div></div>`;
    function seat(n,busy) { return `<button type="button" data-action="seat" data-seat="${n}" ${busy.has(n)?'disabled':''} class="seat-btn ${busy.has(n)?'busy':state.selectedSeats.includes(n)?'selected':''}" aria-label="مقعد ${n}" aria-pressed="${state.selectedSeats.includes(n)}">${icon('seat',24)}<small>${n}</small></button>`; }
  }
  function passengerStage(people) {
    return `<div class="stage-head"><h2>مين مسافر معنا؟ ${icon('users',23)}</h2><p>دخل بيانات المسافرين حسب عدد المقاعد المختارة.</p></div><div class="passengers-list">${Array.from({length:people},(_,i)=>`<div class="passenger-card"><div class="passenger-heading"><span class="passenger-index">${i+1}</span><b>المسافر ${i+1}</b><small>مقعد رقم ${state.selectedSeats[i]??'-'}</small></div><div class="input-grid"><label class="form-group"><span>الاسم الكامل <em>*</em></span><div class="field-control">${icon('user',18)}<input data-passenger="${i}" name="name" placeholder="مثال: أحمد خالد" value="${escapeHTML(state.passengers[i]?.name|| (i===0?state.user?.name||'':''))}" required minlength="3" autocomplete="off"></div></label><label class="form-group"><span>رقم الموبايل <em>*</em></span><div class="field-control">${icon('phone',18)}<input data-passenger="${i}" name="phone" type="tel" inputmode="tel" dir="ltr" placeholder="09xxxxxxxx" value="${escapeHTML(state.passengers[i]?.phone||'')}" required minlength="9" autocomplete="off"></div></label></div></div>`).join('')}</div><div class="soft-info">${icon('info',19)} <span>هذه بيانات تجريبية فقط. لا تدخل معلوماتك الحساسة في نسخة التدريب.</span></div>`;
  }
  function reviewStage(t) {
    return `<div class="stage-head"><h2>كل شي جاهز؟ ${icon('check-circle',24)}</h2><p>راجع معلومات الرحلة قبل ما تثبّت الحجز.</p></div><div class="review-panel"><h3>تفاصيل المسافرين</h3>${state.passengers.map((p,i)=>`<div class="review-passenger"><span class="review-avatar">${icon('user',19)}</span><div><b>${escapeHTML(p.name)}</b><span dir="ltr">${escapeHTML(p.phone)}</span></div><small>المقعد ${state.selectedSeats[i]}</small></div>`).join('')}</div><div class="review-panel"><h3>طريقة تأكيد الحجز</h3><label class="payment-choice"><input type="radio" name="payment" value="office" ${state.payment==='office'?'checked':''}><span class="payment-icon">${icon('wallet',22)}</span><span><b>الدفع في مكتب الشركة</b><small>ادفع عند الحضور لمكتب الشركة قبل الرحلة — عرض تجريبي.</small></span></label><label class="payment-choice"><input type="radio" name="payment" value="demo" ${state.payment==='demo'?'checked':''}><span class="payment-icon">${icon('card',22)}</span><span><b>دفع إلكتروني (تجريبي)</b><small>محاكاة لواجهة الدفع فقط؛ لن يتم تحصيل أي مبلغ.</small></span></label></div><p class="review-alert">${icon('shield',18)} بتأكيد الحجز، رح تنضاف تذكرة تجريبية لقائمة «حجوزاتي» في هذا المتصفح.</p>`;
  }
  const demoBooking = () => ({id:'SR-24081', origin:'aleppo',destination:'damascus',date:nextDate(),departure:'07:30',arrive:'13:10',companyId:'sham',seats:[12],people:1,total:135000,passengers:[{name:'ضيف سيرنا',phone:'0900000000'}],status:'confirmed',demo:true});
  function myBookings() { return state.bookings.length?state.bookings:[demoBooking()]; }
  function tripsPage() {
    const bookings=myBookings();
    return `<main class="inner-main"><section class="page-banner"><div class="container"><div class="breadcrumb"><a href="#home">الرئيسية</a>${icon('chevron-left',14)} <span>حجوزاتي</span></div>${eyebrow('كل رحلاتك بمكان واحد')}<h1 class="page-title">تذاكرك <span>دايماً معك.</span></h1><p>راقب حجوزاتك، وارجع لتفاصيل الرحلة وقت ما تحتاج.</p></div></section><section class="container section"><div class="trips-top"><div><h2>رحلاتي القادمة</h2><p>${state.bookings.length?'رحلاتك المحفوظة على هذا المتصفح':'رحلة نموذجية لمعاينة تصميم صفحة الحجوزات'}</p></div><a href="#results" class="btn btn-primary btn-sm">${icon('plus',17)} حجز جديد</a></div><div class="my-trips-list">${bookings.map(b => { const c=companies.find(c=>c.id===b.companyId)||companies[0];return `<article class="my-trip-card"><div class="mytrip-head"><div class="mytrip-head-main"><span class="ticket-icon">${icon('ticket',20)}</span><div><span class="small-muted">رقم الحجز</span><b dir="ltr">${escapeHTML(b.id)}</b></div></div><span class="tag ${b.demo?'tag-demo':'tag-success'}">${icon(b.demo?'info':'check-circle',15)} ${b.demo?'حجز توضيحي':'تم تأكيد الحجز'}</span></div><div class="mytrip-center"><div class="mytrip-route"><div><small>من</small><h3>${cityById(b.origin).name}</h3><b>${b.departure}</b></div><div class="mytrip-route-graphic"><span>${icon('bus',20)}</span><div></div><small>${dateText(b.date)}</small></div><div><small>إلى</small><h3>${cityById(b.destination).name}</h3><b>${b.arrive}</b></div></div><div class="mytrip-detail"><span>${companyLogo(c,'tiny')} ${c.name}</span><span>${icon('seat',16)} المقعد: ${b.seats.join('، ')}</span><span>${icon('wallet',16)} ${money(b.total)}</span></div></div><div class="mytrip-actions"><button class="btn btn-outline" data-action="track" data-id="${b.id}">${icon('route',17)} تتبّع الرحلة</button><button class="btn btn-subtle" data-action="ticket" data-id="${b.id}">${icon('ticket',17)} عرض التذكرة</button></div></article>`; }).join('')}</div>${!state.bookings.length?`<div class="soft-notice">${icon('info',19)} هذه رحلة معاينة. احجز من الموقع لتظهر تذاكرك الفعلية ضمن النموذج.</div>`:''}</section></main>`;
  }
  function trackingPage() {
    const b = myBookings().find(t=>t.id===state.trackId) || myBookings()[0];
    const o=cityById(b.origin),d=cityById(b.destination),c=companies.find(c=>c.id===b.companyId)||companies[0];
    return `<main class="tracking-main"><section class="container tracking-title"><div><div class="breadcrumb"><a href="#home">الرئيسية</a>${icon('chevron-left',14)}<a href="#trips">حجوزاتي</a>${icon('chevron-left',14)}<span>تتبّع الرحلة</span></div>${eyebrow('تابع الطريق')}<h1>رحلتك قدام عيونك <span class="tracking-live">${icon('navigation',15)} محاكاة تفاعلية</span></h1><p>خط السير على الخريطة مع محطات ووقت وصول توضيحي.</p></div><div class="tracking-actions"><a href="#trips" class="btn btn-outline">${icon('arrow-right',17)} كل الحجوزات</a></div></section><section class="container tracking-layout"><aside class="tracking-sidebar"><div class="tracking-status"><span class="status-dot"></span> الرحلة قيد العرض التجريبي <small>${escapeHTML(b.id)}</small></div><div class="track-route-heading"><div><small>من</small><h2>${o.name}</h2></div><span>${icon('arrow-left',21)}</span><div><small>إلى</small><h2>${d.name}</h2></div></div><div class="track-company">${companyLogo(c)}<div><b>${c.name}</b><small>موعد الانطلاق ${b.departure}</small></div></div><div class="track-divider"></div><div class="track-progress-head"><h3>تقدّم الرحلة</h3><strong id="progress-label">48%</strong></div><div class="progress-bar"><span id="progress-fill" style="width:48%"></span></div><div class="track-timeline"><div class="timeline-stop"><span class="stop-indicator completed">${icon('check',13)}</span><div><b>${o.name}</b><small>محطة الانطلاق</small></div><time>${b.departure}</time></div><div class="timeline-stop active"><span class="stop-indicator">${icon('bus',14)}</span><div><b>على الطريق</b><small id="current-status">الحافلة تتحرك نحو الوجهة</small></div><time>الآن*</time></div><div class="timeline-stop"><span class="stop-indicator last">${icon('pin',13)}</span><div><b>${d.name}</b><small>محطة الوصول</small></div><time>${b.arrive}</time></div></div><div class="track-quick-stats"><div><span>${icon('route',16)} المسافة الكلية</span><b id="track-distance">—</b></div><div><span>${icon('clock',16)} المتبقي التقديري</span><b id="track-eta">—</b></div></div><div class="track-controls"><button class="btn btn-primary" data-action="playtrack" id="track-toggle">${icon('pause',17)} إيقاف الحركة</button><button class="btn btn-outline small-square" data-action="resettrack" aria-label="إعادة المحاكاة">${icon('refresh',18)}</button></div><p class="tracking-warning">${icon('info',17)} هذا نموذج محاكاة، وليس تتبع GPS فعلياً. بيانات المسافة والوقت تقديرية.</p></aside><div class="tracking-map-panel"><div class="map-toolbar"><div><span class="map-green-dot"></span> خريطة مسار الرحلة</div><div class="map-toggle"><span>${icon('globe',16)} عرض الخريطة</span></div></div><div id="tracking-map" class="live-map"></div><div id="fallback-map" class="fallback-map">${routeSvg(o,d)}</div><div class="map-bottom-overlay"><span>${icon('pin',17)} ${o.name} ← ${d.name}</span><span class="map-caption">نموذج توضيحي <span class="map-caption-dot">•</span> OpenStreetMap عند الاتصال</span></div></div></section></main>`;
  }
  function routeSvg(o,d) {
    const point=c=>({x:70+(c.lng-35.5)/(41.4-35.5)*680,y:60+(37.5-c.lat)/(37.5-32.0)*500});
    const from=point(o),to=point(d);
    const cx=(from.x+to.x)/2+40, cy=(from.y+to.y)/2-60;
    const path=`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
    return `<svg class="syria-schematic" viewBox="0 0 850 640" role="img" aria-label="خريطة توضيحية لمسار ${o.name} إلى ${d.name}"><defs><pattern id="mapdots" width="31" height="31" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#bad7d2"/></pattern><filter id="markerShadow"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity=".14"/></filter></defs><rect width="850" height="640" fill="#eaf3ef"/><rect width="850" height="640" fill="url(#mapdots)"/><path d="M130 80Q200 120 275 55T500 65T770 116M0 460Q200 350 350 485T850 450M50 190Q230 250 390 140T750 200" fill="none" stroke="#d3e5df" stroke-width="25" opacity=".8"/><path d="M130 80Q200 120 275 55T500 65T770 116M0 460Q200 350 350 485T850 450M50 190Q230 250 390 140T750 200" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="9 7"/><path d="M82 126 455 45 668 93 734 248 767 420 610 530 485 568 357 554 287 476 134 433 91 300Z" fill="#f7fbf8" stroke="#c3dbce" stroke-width="3"/><path d="M90 296 273 281 423 316 667 248m-279-200 10 470M146 420 612 530" fill="none" stroke="#e1e9df" stroke-width="3"/><g fill="#829ca0" font-family="Cairo,Arial" font-size="17">${cities.filter(c=>c.id!==o.id&&c.id!==d.id).map(c=>{let p=point(c);return `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#bdcfc8"/><text text-anchor="middle" x="${p.x}" y="${p.y-13}">${c.name}</text>`;}).join('')}</g><path id="route-path" d="${path}" fill="none" stroke="#d7e8e5" stroke-width="19" stroke-linecap="round"/><path d="${path}" fill="none" stroke="#10a997" stroke-width="7" stroke-linecap="round" stroke-dasharray="12 8"/><circle cx="${from.x}" cy="${from.y}" r="18" fill="#fff" stroke="#13aa98" stroke-width="8" filter="url(#markerShadow)"/><circle cx="${to.x}" cy="${to.y}" r="18" fill="#fff" stroke="#1a4152" stroke-width="8" filter="url(#markerShadow)"/><g fill="#143f50" font-family="Cairo,Arial" font-weight="800" font-size="21"><text text-anchor="middle" x="${from.x}" y="${from.y-29}">${o.name}</text><text text-anchor="middle" x="${to.x}" y="${to.y+43}">${d.name}</text></g><g id="moving-bus" transform="translate(${from.x} ${from.y})"><circle r="27" fill="#fff" stroke="#e5f0ed" stroke-width="4" filter="url(#markerShadow)"/><rect x="-13" y="-11" width="26" height="20" rx="5" fill="#0b9d91"/><rect x="-9" y="-6" width="18" height="7" rx="2" fill="#d8f7f2"/><circle cx="-8" cy="11" r="4" fill="#173f52"/><circle cx="8" cy="11" r="4" fill="#173f52"/></g></svg>`;
  }
  function successPage() {
    const b=state.lastBooking || state.bookings[0];
    if(!b) return `<main class="container success-page"><h1>ما في حجز جديد حالياً</h1><a href="#results" class="btn btn-primary">احجز رحلة</a></main>`;
    return `<main class="success-page container"><div class="success-card"><div class="success-icon">${icon('check',43)}</div>${eyebrow('صار الحجز جاهز')}<h1>يا سلام! <span>تم تأكيد حجزك.</span></h1><p>انضافت التذكرة إلى «حجوزاتي». هلق بتقدر تراجعها وتتابع الرحلة التجريبية.</p><div class="confirmation-ticket"><div><span>رقم الحجز</span><strong dir="ltr">${b.id}</strong></div><span class="ticket-dashes"></span><div><span>الوجهة</span><strong>${cityById(b.origin).name} ← ${cityById(b.destination).name}</strong></div><span class="ticket-dashes"></span><div><span>المقاعد</span><strong>${b.seats.join('، ')}</strong></div></div><div class="success-actions"><a href="#trips" class="btn btn-primary">عرض تذكرتي ${icon('ticket',17)}</a><button class="btn btn-outline" data-action="track" data-id="${b.id}">تتبّع الرحلة ${icon('route',17)}</button></div></div></main>`;
  }
  function authPage(mode='login') {
    const isRegister=mode==='register';
    return `<main class="auth-main"><div class="container auth-grid"><div class="auth-panel"><div class="auth-top">${eyebrow(isRegister?'انضم لعيلة سيرنا':'أهلاً برجعتك')}<h1>${isRegister?'خلّينا نبدأ <span>المشوار سوا.</span>':'منوّر، <span>اشتقنالك!</span>'}</h1><p>${isRegister?'حساب بسيط، ورحلاتك كلها بين إيديك.':'ادخل على حسابك، وكمّل حجز رحلتك براحة.'}</p></div><form class="auth-form" data-form="${mode}">
      ${isRegister?`<label class="form-group"><span>الاسم الكامل</span><div class="field-control">${icon('user',19)}<input name="name" required minlength="3" placeholder="اسمك الكامل" autocomplete="name" /></div></label>`:''}
      <label class="form-group"><span>البريد الإلكتروني</span><div class="field-control">${icon('mail',19)}<input name="email" type="email" required placeholder="name@example.com" autocomplete="email" dir="ltr"/></div></label>
      <label class="form-group"><span>كلمة المرور</span><div class="field-control">${icon('lock',19)}<input name="password" id="auth-password" type="password" required minlength="6" placeholder="6 أحرف على الأقل" autocomplete="${isRegister?'new-password':'current-password'}" dir="ltr"/><button class="show-password" type="button" data-action="showpassword" aria-label="إظهار كلمة المرور">${icon('eye',19)}</button></div></label>
      ${isRegister?`<label class="terms-check"><input type="checkbox" required /> <span>أوافق على استخدام بيانات تجريبية في هذا النموذج التعليمي.</span></label>`:`<div class="auth-helper"><label class="terms-check"><input type="checkbox"/> تذكرني</label><a href="#support">نسيت كلمة المرور؟</a></div>`}
      <button class="btn btn-primary full auth-submit" type="submit">${isRegister?'إنشاء حساب':'تسجيل الدخول'} ${icon('arrow-left',18)}</button>
      </form><p class="auth-switch">${isRegister?'عندك حساب من قبل؟':'لسا ما عندك حساب؟'} <a href="#${isRegister?'login':'register'}">${isRegister?'سجّل دخولك':'أنشئ حساب جديد'}</a></p><div class="auth-demo-note">${icon('info',18)} تسجيل الدخول والتسجيل محاكاة محلية فقط، بدون خادم أو تخزين كلمات المرور.</div></div>
      <div class="auth-visual"><div class="auth-visual-top"><span>${icon('sparkle',18)} عالم جديد بانتظارك</span><h2>كل الطرق <br> بتوصّل لذكريات.</h2><p>ومن أول محطة رح نكون معك.</p></div><img src="assets/hero.svg" alt="رسم لحافلة على طريق السفر"/><div class="auth-visual-bottom"><span>${icon('shield',19)} سهل وواضح</span><span>${icon('ticket',19)} حجز بخطوات بسيطة</span></div></div></div></main>`;
  }
  function accountPage() {
    if (!state.user) return `<main class="container account-guest"><div class="empty-state">${icon('user',40)}<h2>أهلاً فيك!</h2><p>سجّل دخول لحتى تشوف معلومات حسابك.</p><a href="#login" class="btn btn-primary">تسجيل الدخول</a></div></main>`;
    return `<main class="inner-main"><section class="page-banner"><div class="container">${eyebrow('ملفك الشخصي')}<h1 class="page-title">أهلاً ${escapeHTML(state.user.name.split(' ')[0])} <span>${icon('hand',28)}</span></h1><p>هون كل التفاصيل المتعلقة بحسابك التجريبي.</p></div></section><section class="container section"><div class="account-layout"><div class="account-profile"><div class="account-avatar">${escapeHTML(state.user.name[0])}</div><h2>${escapeHTML(state.user.name)}</h2><span>${escapeHTML(state.user.email)}</span><div class="account-stat">${icon('ticket',19)} <b>${state.bookings.length}</b> حجوزات محفوظة</div><button class="btn btn-outline full" data-action="logout">${icon('logout',17)} تسجيل الخروج</button></div><div class="account-details"><h2>معلومات الحساب</h2><div class="account-item"><span>الاسم الكامل</span><b>${escapeHTML(state.user.name)}</b></div><div class="account-item"><span>البريد الإلكتروني</span><b dir="ltr">${escapeHTML(state.user.email)}</b></div><div class="account-item"><span>نوع الحساب</span><b>حساب تجريبي</b></div><a href="#trips" class="btn btn-primary">انتقل لحجوزاتي ${icon('arrow-left',17)}</a></div></div></section></main>`;
  }
  function aboutPage() { return `<main class="inner-main"><section class="page-banner"><div class="container">${eyebrow('قصتنا')}<h1 class="page-title">سيرنا. <span>رحلة أبسط لكل حدا.</span></h1><p>فكرة موقع لحجز الرحلات البرية بين المحافظات السورية، انبنت كنموذج لتعليم تصميم وتطوير الويب.</p></div></section><section class="container section about-grid"><div><h2>فكرة صغيرة... تجربة كبيرة.</h2><p>بدنا تجربة واضحة للمستخدم من لحظة اختيار مدينة الانطلاق والوصول، وصولاً لمقارنة الشركات، اختيار المقاعد، تأكيد التذكرة، ومشاهدة مسار الرحلة على الخريطة.</p><p>تم تطوير هذا النموذج باستخدام HTML وCSS وJavaScript دون إطار عمل، ليكون مناسباً للتدريب والتوسع لاحقاً وربطه بواجهة API حقيقية.</p><a href="#results" class="btn btn-primary">جرّب رحلة ${icon('arrow-left',17)}</a></div><img src="assets/hero.svg" alt="رسمة حافلة سورية"/></section></main>`; }
  function supportPage() { return `<main class="inner-main"><section class="page-banner"><div class="container">${eyebrow('نحن معك')}<h1 class="page-title">شو حابب <span>تعرف؟</span></h1><p>أسئلة بتساعدك تستخدم نموذج سيرنا بسهولة.</p></div></section><section class="container faq-section"><div class="faq-list">${[['كيف بحجز رحلة؟','حدد المحافظة اللي رح تطلع منها والمحافظة اللي بدك توصل إلها، بعدين اختار التاريخ والشركة والموعد والمقعد، وأكّد الحجز.'],['في دفع إلكتروني حقيقي؟','لا. الموقع نموذج تدريبي، وخيارات الدفع معروضة لأغراض التصميم فقط.'],['الخريطة بتعرض مكان الباص الحقيقي؟','لا. الخريطة بتعرض مسار تقديري ومحاكاة لحركة الباص. التتبع المباشر يحتاج GPS وAPI من شركة النقل.'],['وين بلاقي حجوزاتي؟','من قائمة «حجوزاتي». الحجوزات محفوظة محلياً بنفس المتصفح لأغراض التدريب.'],['هل في حسابات حقيقية؟','التسجيل والدخول محاكاة لتجربة الواجهة، وليسا نظام مصادقة حقيقياً.']].map(([q,a])=>`<details class="faq-item"><summary>${escapeHTML(q)} ${icon('plus',18)}</summary><p>${escapeHTML(a)}</p></details>`).join('')}</div><div class="support-aside">${icon('headphones',32)}<h2>بحاجة لمساعدة؟</h2><p>هاد الموقع نموذج واجهات تعليمية، وممكن تطوّرو لاحقاً لتضيفوا نظام دعم حقيقي.</p><a href="#home" class="btn btn-primary">رجوع للرئيسية</a></div></section></main>`; }
  function toast(message,type='info') { let el=$('#toast'); if (!el) {el=document.createElement('div');el.id='toast';el.className='toast';document.body.append(el)}el.innerHTML=`${icon(type==='error'?'info':'check-circle',19)} ${escapeHTML(message)}`;el.dataset.type=type;el.classList.add('show');refreshIcons();clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3600); }
  const currentPage = () => (location.hash.split('?')[0].replace('#','')||'home');
  function render(preserve=false) {
    clearInterval(state.timer);state.timer=null;
    if(state.map){try{state.map.remove()}catch{}state.map=null;state.marker=null;}
    const route=currentPage();document.body.classList.toggle('no-footer',route==='tracking');document.body.classList.toggle('auth-route',['login','register'].includes(route));
    const pages={home:homePage,results:resultsPage,companies:companiesPage,booking:bookingPage,trips:tripsPage,tracking:trackingPage,success:successPage,login:()=>authPage('login'),register:()=>authPage('register'),account:accountPage,about:aboutPage,support:supportPage};
    app.innerHTML=header()+(pages[route]||homePage)()+footer();
    refreshIcons();
    if(!preserve)window.scrollTo({top:0,behavior:'instant'});
    if(route==='tracking')initTracking();
    refreshIcons();
    state.menuOpen=false;
  }
  function nav(route) { if(currentPage()===route)render();else location.hash=route; }
  function syncSearchForm(form) { const fd=new FormData(form);if(fd.get('origin')===fd.get('destination')) {toast('اختار محافظتين مختلفتين حتى نعرض الرحلات.','error');return false;}state.search={origin:fd.get('origin'),destination:fd.get('destination'),date:fd.get('date'),people:Number(fd.get('people'))};state.company='all';state.time='all';state.sort='earliest';return true; }
  function savePassengers() {
    const cards=[...document.querySelectorAll('.passenger-card')];
    const passengers=[];
    for (const card of cards) {const name=$('input[name="name"]',card),phone=$('input[name="phone"]',card);if(!name.value.trim()||name.value.trim().length<3) {toast('أدخل اسم كل مسافر (3 أحرف على الأقل).','error');name.focus();return false;}if(!/^[+\d\s-]{9,18}$/.test(phone.value.trim())) {toast('أدخل رقم هاتف صحيح لكل مسافر.','error');phone.focus();return false;}passengers.push({name:name.value.trim(),phone:phone.value.trim()});}
    state.passengers=passengers;return true;
  }
  function confirmBooking() {
    if(!state.user){state.afterAuth='booking';toast('سجّل دخولك أولاً لإتمام الحجز.');nav('login');return;}
    const t=state.selectedTrip;
    const b={id:'SR-'+String(Date.now()).slice(-7),origin:t.origin.id,destination:t.destination.id,date:t.date,departure:t.departure,arrive:t.arrive,companyId:t.company.id,seats:[...state.selectedSeats],people:Number(state.search.people),total:t.price*Number(state.search.people),passengers:state.passengers,status:'confirmed',createdAt:new Date().toISOString()};
    state.bookings.unshift(b);save('sairna-bookings',state.bookings);state.lastBooking=b;state.trackId=b.id;nav('success');
  }
  function onClick(e) {
    const btn=e.target.closest('[data-action]'); if(!btn)return;
    const action=btn.dataset.action;
    if(action==='theme'){state.theme=state.theme==='light'?'dark':'light';save('sairna-theme',state.theme);document.documentElement.dataset.theme=state.theme;render(true);}
    if(action==='menu'){state.menuOpen=!state.menuOpen;$('.mobile-panel')?.classList.toggle('open',state.menuOpen);btn.innerHTML=icon(state.menuOpen?'x':'menu',24);refreshIcons();}
    if(action==='swap'){const f=btn.closest('form');const a=$('[name="origin"]',f),b=$('[name="destination"]',f);[a.value,b.value]=[b.value,a.value];}
    if(action==='destination'){state.search.destination=btn.dataset.dest;if(state.search.destination===state.search.origin)state.search.origin='homs';nav('results');}
    if(action==='clearfilters'){state.company='all';state.time='all';state.sort='earliest';render(true);}
    if(action==='company-routes'){state.company=btn.dataset.company;nav('results');}
    if(action==='choosecompany'){state.company=btn.dataset.company;render(true);}
    if(action==='selecttrip'){state.selectedTrip=tripSeed().find(t=>t.id===btn.dataset.id);state.selectedSeats=[];state.passengers=[];state.bookingStep='seats';nav('booking');}
    if(action==='seat'){const n=Number(btn.dataset.seat),i=state.selectedSeats.indexOf(n);if(i!==-1)state.selectedSeats.splice(i,1);else if(state.selectedSeats.length>=state.search.people){toast(`مسموح تختار ${state.search.people} مقعد فقط.`,'error');return;}else state.selectedSeats.push(n);render(true);}
    if(action==='bookingback'){state.bookingStep=state.bookingStep==='review'?'passengers':'seats';render(true);}
    if(action==='bookingnext'){
      if(state.bookingStep==='seats'){if(state.selectedSeats.length!==Number(state.search.people)){toast(`لازم تختار ${state.search.people} مقعد قبل المتابعة.`,'error');return;}state.bookingStep='passengers';render(true);}
      else if(state.bookingStep==='passengers'){if(!savePassengers())return;state.bookingStep='review';render(true);}
      else confirmBooking();
    }
    if(action==='track'){state.trackId=btn.dataset.id;state.progress=.48;state.playing=true;nav('tracking');}
    if(action==='resettrack'){state.progress=0;updateTracking();}
    if(action==='playtrack'){state.playing=!state.playing;btn.innerHTML=`${icon(state.playing?'pause':'play',17)} ${state.playing?'إيقاف الحركة':'متابعة الحركة'}`;refreshIcons();}
    if(action==='showpassword'){const input=$('#auth-password');if(input){input.type=input.type==='password'?'text':'password';btn.innerHTML=icon(input.type==='password'?'eye':'eye-off',19);refreshIcons();}}
    if(action==='logout'){state.user=null;try { localStorage.removeItem('sairna-user'); } catch {}toast('تم تسجيل الخروج من النموذج.');nav('home');}
    if(action==='ticket'){
      const b=myBookings().find(x=>x.id===btn.dataset.id);if(!b)return;
      showTicket(b);
    }
    if(action==='copy'){const id=btn.dataset.id;if(navigator.clipboard?.writeText){navigator.clipboard.writeText(id).then(()=>toast('تم نسخ رقم الحجز.')).catch(()=>toast('رقم الحجز: '+id));}else toast('رقم الحجز: '+id);}
    if(action==='closemodal'){document.querySelector('.modal-scrim')?.remove();}
  }
  function showTicket(b) {
    const c=companies.find(c=>c.id===b.companyId)||companies[0];
    const modal=document.createElement('div');modal.className='modal-scrim';modal.innerHTML=`<div class="ticket-modal" role="dialog" aria-modal="true" aria-label="تفاصيل التذكرة"><button class="modal-close icon-button" data-action="closemodal" aria-label="إغلاق">${icon('x',22)}</button><div class="ticket-modal-head">${icon('ticket',30)}<span>تذكرتك مع سيرنا</span><strong>SAIRNA</strong></div><div class="ticket-modal-body"><div class="ticket-code"><small>رقم الحجز</small><strong dir="ltr">${escapeHTML(b.id)}</strong></div><div class="ticket-big-route"><span>${cityById(b.origin).name}</span>${icon('arrow-left',24)}<span>${cityById(b.destination).name}</span></div><div class="ticket-meta"><span>شركة النقل <b>${c.name}</b></span><span>التاريخ <b>${dateText(b.date)}</b></span><span>الموعد <b dir="ltr">${b.departure}</b></span><span>المقاعد <b>${b.seats.join('، ')}</b></span><span>الإجمالي <b>${money(b.total)}</b></span></div><p>تذكرة توضيحية — غير صالحة للسفر أو الدفع.</p><button class="btn btn-outline full" data-action="copy" data-id="${escapeHTML(b.id)}">${icon('copy',17)} نسخ رقم الحجز</button></div></div>`;document.body.append(modal);refreshIcons();modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});
  }
  function onSubmit(e) {
    const form=e.target.closest('form[data-form]');if(!form)return;e.preventDefault();
    if(form.dataset.form==='search'){if(syncSearchForm(form))nav('results');return;}
    if(form.dataset.form==='login'||form.dataset.form==='register'){
      const fd=new FormData(form),email=String(fd.get('email')).trim().toLowerCase(),password=String(fd.get('password'));
      if(password.length<6){toast('كلمة المرور لازم تكون 6 أحرف على الأقل.','error');return;}
      const name=form.dataset.form==='register'?String(fd.get('name')).trim():(email.split('@')[0]||'مسافر سيرنا');
      if(name.length<2){toast('أدخل اسماً صحيحاً.','error');return;}
      // لا يتم تخزين كلمة المرور. المصادقة شكلية للتدريب فقط.
      state.user={name,email};save('sairna-user',state.user);
      const dest=state.afterAuth||'account';state.afterAuth=null;toast('أهلاً وسهلاً! تم الدخول للعرض التجريبي.');nav(dest);
    }
  }
  function onChange(e) {
    if(e.target.matches('[name="company-filter"]')){state.company=e.target.value;render(true);}
    if(e.target.matches('[name="time-filter"]')){state.time=e.target.value;render(true);}
    if(e.target.matches('[data-filter="sort"]')){state.sort=e.target.value;render(true);}
    if(e.target.matches('[name="payment"]'))state.payment=e.target.value;
  }
  function initTracking(){
    const b=myBookings().find(t=>t.id===state.trackId)||myBookings()[0]; const o=cityById(b.origin),d=cityById(b.destination);
    const approxDist=Math.max(75,Math.round(Math.hypot((o.lat-d.lat)*110,(o.lng-d.lng)*88)*1.20));
    $('#track-distance').textContent=`~${approxDist} كم`;
    state.progress=Number.isFinite(state.progress)?state.progress:.48;
    if(window.L){
      try { const map=L.map('tracking-map',{zoomControl:false,scrollWheelZoom:false,attributionControl:true}); state.map=map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:18}).addTo(map);
      const start=[o.lat,o.lng],end=[d.lat,d.lng],points=[];
      for(let i=0;i<=100;i++){const t=i/100;points.push([o.lat+(d.lat-o.lat)*t+Math.sin(t*Math.PI)*.11,o.lng+(d.lng-o.lng)*t-Math.sin(t*Math.PI)*.14]);}
      L.polyline(points,{color:'#d7e9e4',weight:13}).addTo(map);L.polyline(points,{color:'#0eaa9a',weight:5,dashArray:'9 6'}).addTo(map);L.circleMarker(start,{radius:9,color:'#0aaa9a',fillColor:'#fff',fillOpacity:1,weight:5}).addTo(map).bindPopup('الانطلاق: '+o.name);L.circleMarker(end,{radius:9,color:'#163d50',fillColor:'#fff',fillOpacity:1,weight:5}).addTo(map).bindPopup('الوصول: '+d.name);
      const busIcon=L.divIcon({className:'bus-marker',html:`<div class="map-bus-icon">${icon('bus',22)}</div>`,iconSize:[42,42],iconAnchor:[21,21]});
      state.marker=L.marker(points[Math.round(state.progress*100)],{icon:busIcon}).addTo(map);refreshIcons();state.mapPoints=points;map.fitBounds(L.latLngBounds(start,end).pad(.28));L.control.zoom({position:'bottomleft'}).addTo(map);
      $('#fallback-map').style.display='none';$('#tracking-map').style.display='block';
      setTimeout(()=>{try{map.invalidateSize()}catch{}},150);
      }catch(err){console.warn('تعذّر تهيئة الخريطة، سيتم استخدام المخطط المحلي',err);$('#tracking-map').style.display='none';$('#fallback-map').style.display='block';}
    }
    updateTracking();state.playing=true;state.timer=setInterval(()=>{if(!state.playing||currentPage()!=='tracking')return;state.progress=state.progress>=1?0:Math.min(1,state.progress+.006);updateTracking();},150);
  }
  function updateTracking(){
    const p=state.progress||0;
    if($('#progress-label'))$('#progress-label').textContent=Math.round(p*100)+'%';
    if($('#progress-fill'))$('#progress-fill').style.width=(p*100)+'%';
    if($('#track-eta'))$('#track-eta').textContent=p>=1?'تم الوصول':`${Math.max(1,Math.ceil((1-p)*5.4))} ساعات تقريباً`;
    if($('#current-status'))$('#current-status').textContent=p>=1?'وصلت الحافلة إلى الوجهة':p>.8?'اقتربنا من محطة الوصول': 'الحافلة تتحرك نحو الوجهة';
    const svg=$('#fallback-map svg'),path=$('#route-path'),bus=$('#moving-bus');
    if(svg&&path&&bus){const pos=path.getPointAtLength(path.getTotalLength()*p);bus.setAttribute('transform',`translate(${pos.x} ${pos.y})`);}
    if(state.marker&&state.mapPoints)state.marker.setLatLng(state.mapPoints[Math.min(100,Math.round(p*100))]);
  }
  document.addEventListener('click',onClick);document.addEventListener('submit',onSubmit);document.addEventListener('change',onChange);
  window.addEventListener('hashchange',()=>render());window.addEventListener('keydown',e=>{if(e.key==='Escape')$('.modal-scrim')?.remove()});
  if(!location.hash)history.replaceState(null,'','#home');render();
})();
