/* تعريف أنواع الأقسام وحقولها — لوحة التحكم تبني الفورم منه تلقائياً */
window.SECTION_TYPES = {
  hero: {
    label: 'سلايدر رئيسي (Hero)',
    fields: [
      { key: 'slides', type: 'list', label: 'الشرائح', itemLabel: 'شريحة', fields: [
        { key: 'image', type: 'image', label: 'الصورة' },
        { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
        { key: 'title', type: 'i18n', label: 'العنوان' },
        { key: 'text', type: 'i18nArea', label: 'الوصف' }
      ]},
      { key: 'buttons', type: 'list', label: 'الأزرار', itemLabel: 'زر', fields: [
        { key: 'label', type: 'i18n', label: 'نص الزر' },
        { key: 'link', type: 'text', label: 'الرابط (مثال: #products أو whatsapp)' },
        { key: 'style', type: 'select', label: 'الشكل', options: [['primary', 'ممتلئ'], ['ghost', 'مفرّغ']] }
      ]},
      { key: 'autoplay', type: 'number', label: 'تبديل الشرائح كل (ثانية) — 0 = يدوي' }
    ]
  },
  values: {
    label: 'شريط القيم (Values)',
    fields: [
      { key: 'items', type: 'list', label: 'القيم', itemLabel: 'قيمة', fields: [
        { key: 'icon', type: 'text', label: 'أيقونة (إيموجي)' },
        { key: 'title', type: 'i18n', label: 'النص' }
      ]}
    ]
  },
  stats: {
    label: 'أرقام بتعدّ (Stats)',
    fields: [
      { key: 'items', type: 'list', label: 'الأرقام', itemLabel: 'رقم', fields: [
        { key: 'icon', type: 'text', label: 'أيقونة (إيموجي)' },
        { key: 'value', type: 'number', label: 'الرقم' },
        { key: 'suffix', type: 'text', label: 'لاحقة (+ أو % …)' },
        { key: 'label', type: 'i18n', label: 'الوصف' }
      ]}
    ]
  },
  about: {
    label: 'من نحن (About)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'text', type: 'i18nArea', label: 'النص' },
      { key: 'image', type: 'image', label: 'الصورة' },
      { key: 'badge', type: 'i18n', label: 'شارة على الصورة' },
      { key: 'bullets', type: 'list', label: 'نقاط مميزة', itemLabel: 'نقطة', fields: [
        { key: 'text', type: 'i18n', label: 'النص' }
      ]}
    ]
  },
  products: {
    label: 'المنتجات (Products)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'text', type: 'i18nArea', label: 'وصف القسم' },
      { key: 'showQuoteButton', type: 'bool', label: 'زر «اطلب عرض سعر» على كل منتج' },
      { key: 'items', type: 'list', label: 'المنتجات', itemLabel: 'منتج', fields: [
        { key: 'image', type: 'image', label: 'صورة المنتج' },
        { key: 'name', type: 'i18n', label: 'اسم المنتج' },
        { key: 'category', type: 'i18n', label: 'الفئة (المنتجات بنفس الفئة تتجمّع في فلتر)' },
        { key: 'description', type: 'i18nArea', label: 'الوصف' },
        { key: 'season', type: 'i18n', label: 'الموسم' },
        { key: 'origin', type: 'i18n', label: 'المنشأ' }
      ]}
    ]
  },
  features: {
    label: 'خدمات / مميزات (Features)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'items', type: 'list', label: 'البطاقات', itemLabel: 'بطاقة', fields: [
        { key: 'icon', type: 'text', label: 'أيقونة (إيموجي)' },
        { key: 'title', type: 'i18n', label: 'العنوان' },
        { key: 'text', type: 'i18nArea', label: 'النص' }
      ]}
    ]
  },
  process: {
    label: 'مراحل العمل (Process)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'steps', type: 'list', label: 'المراحل', itemLabel: 'مرحلة', fields: [
        { key: 'title', type: 'i18n', label: 'العنوان' },
        { key: 'text', type: 'i18n', label: 'النص' }
      ]}
    ]
  },
  markets: {
    label: 'الأسواق / الدول (Markets)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'items', type: 'list', label: 'الدول', itemLabel: 'دولة', fields: [
        { key: 'flag', type: 'text', label: 'العلم (إيموجي 🇸🇦)' },
        { key: 'name', type: 'i18n', label: 'اسم الدولة' }
      ]}
    ]
  },
  gallery: {
    label: 'معرض صور (Gallery)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'images', type: 'list', label: 'الصور', itemLabel: 'صورة', fields: [
        { key: 'src', type: 'image', label: 'الصورة' },
        { key: 'caption', type: 'i18n', label: 'تعليق' }
      ]}
    ]
  },
  logos: {
    label: 'شعارات / شهادات / شركاء (Logos)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'items', type: 'list', label: 'الشعارات', itemLabel: 'شعار', fields: [
        { key: 'image', type: 'image', label: 'صورة الشعار (اختياري)' },
        { key: 'name', type: 'text', label: 'الاسم' }
      ]}
    ]
  },
  testimonials: {
    label: 'آراء العملاء (Testimonials)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'items', type: 'list', label: 'الآراء', itemLabel: 'رأي', fields: [
        { key: 'name', type: 'i18n', label: 'الاسم' },
        { key: 'role', type: 'i18n', label: 'الصفة / المدينة' },
        { key: 'text', type: 'i18nArea', label: 'الرأي' }
      ]}
    ]
  },
  faq: {
    label: 'أسئلة شائعة (FAQ)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'items', type: 'list', label: 'الأسئلة', itemLabel: 'سؤال', fields: [
        { key: 'q', type: 'i18n', label: 'السؤال' },
        { key: 'a', type: 'i18nArea', label: 'الإجابة' }
      ]}
    ]
  },
  cta: {
    label: 'شريط دعوة (Call to Action)',
    fields: [
      { key: 'image', type: 'image', label: 'صورة الخلفية' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'text', type: 'i18nArea', label: 'النص' },
      { key: 'buttonLabel', type: 'i18n', label: 'نص الزر' },
      { key: 'buttonLink', type: 'text', label: 'رابط الزر (whatsapp أو #contact أو رابط كامل)' }
    ]
  },
  video: {
    label: 'فيديو (Video)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'youtube', type: 'text', label: 'رابط فيديو يوتيوب' },
      { key: 'text', type: 'i18nArea', label: 'وصف' }
    ]
  },
  richtext: {
    label: 'قسم نص حر + صورة (Custom)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'text', type: 'i18nArea', label: 'النص (سطر فاضي = فقرة جديدة)' },
      { key: 'image', type: 'image', label: 'صورة (اختياري)' },
      { key: 'imageSide', type: 'select', label: 'مكان الصورة', options: [['start', 'أول السطر'], ['end', 'آخر السطر']] },
      { key: 'dark', type: 'bool', label: 'خلفية غامقة' }
    ]
  },
  contact: {
    label: 'تواصل معنا (Contact)',
    fields: [
      { key: 'kicker', type: 'i18n', label: 'عنوان صغير' },
      { key: 'title', type: 'i18n', label: 'العنوان' },
      { key: 'showMap', type: 'bool', label: 'إظهار الخريطة' },
      { key: 'formTo', type: 'select', label: 'الفورم يبعت على', options: [['whatsapp', 'واتساب'], ['email', 'الإيميل']] }
    ]
  }
};

window.SETTINGS_FIELDS = [
  { group: 'الهوية', fields: [
    { key: 'name', type: 'i18n', label: 'اسم الشركة' },
    { key: 'subtitle', type: 'i18n', label: 'سطر تحت الاسم' },
    { key: 'logo', type: 'image', label: 'اللوجو (لو فاضي يظهر الاسم)' },
    { key: 'favicon', type: 'image', label: 'أيقونة المتصفح' },
    { key: 'defaultLang', type: 'select', label: 'اللغة الافتراضية', options: [['ar', 'عربي'], ['en', 'English']] },
    { key: 'seoDescription', type: 'i18nArea', label: 'وصف الموقع لجوجل' },
    { key: 'footerText', type: 'i18n', label: 'جملة الفوتر' }
  ]},
  { group: 'الألوان', fields: [
    { key: 'colors.primary', type: 'color', label: 'اللون الأساسي' },
    { key: 'colors.accent', type: 'color', label: 'لون التمييز (الذهبي)' },
    { key: 'colors.dark', type: 'color', label: 'اللون الغامق' },
    { key: 'colors.light', type: 'color', label: 'لون الخلفية الفاتح' }
  ]},
  { group: 'التواصل', fields: [
    { key: 'whatsapp', type: 'text', label: 'رقم الواتساب (بالكود الدولي بدون + — مثال 201001234567)' },
    { key: 'whatsappMessage', type: 'i18n', label: 'الرسالة الافتراضية للواتساب' },
    { key: 'phones', type: 'list', label: 'أرقام الجوالات', itemLabel: 'رقم', fields: [
      { key: 'label', type: 'i18n', label: 'القسم' },
      { key: 'number', type: 'text', label: 'الرقم' }
    ]},
    { key: 'email', type: 'text', label: 'الإيميل الرئيسي (يظهر في الشريط العلوي ويستقبل الفورم)' },
    { key: 'emails', type: 'list', label: 'إيميلات الأقسام والفريق', itemLabel: 'إيميل', fields: [
      { key: 'label', type: 'i18n', label: 'القسم أو الاسم' },
      { key: 'address', type: 'text', label: 'الإيميل' }
    ]},
    { key: 'address', type: 'i18n', label: 'العنوان' },
    { key: 'workHours', type: 'i18n', label: 'مواعيد العمل' },
    { key: 'mapEmbed', type: 'text', label: 'رابط خريطة جوجل (Embed)' }
  ]},
  { group: 'السوشيال ميديا (اتركه فاضي لإخفائه)', fields: [
    { key: 'social.facebook', type: 'text', label: 'Facebook' },
    { key: 'social.instagram', type: 'text', label: 'Instagram' },
    { key: 'social.linkedin', type: 'text', label: 'LinkedIn' },
    { key: 'social.x', type: 'text', label: 'X / Twitter' },
    { key: 'social.youtube', type: 'text', label: 'YouTube' },
    { key: 'social.tiktok', type: 'text', label: 'TikTok' }
  ]}
];
