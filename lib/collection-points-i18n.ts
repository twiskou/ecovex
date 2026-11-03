import type { Lang } from "@/lib/i18n";

export interface LocalizedPointData {
  name: string;
  address: string;
  description: string;
  city: string;
}

export const CITIES_I18N: Record<string, { ar: string; fr: string }> = {
  Alger: { ar: "الجزائر", fr: "Alger" },
  Oran: { ar: "وهران", fr: "Oran" },
  Constantine: { ar: "قسنطينة", fr: "Constantine" },
  Annaba: { ar: "عنابة", fr: "Annaba" },
  Sétif: { ar: "سطيف", fr: "Sétif" },
  Tlemcen: { ar: "تلمسان", fr: "Tlemcen" },
  Blida: { ar: "البليدة", fr: "Blida" },
  Béjaïa: { ar: "بجاية", fr: "Béjaïa" },
  Batna: { ar: "باتنة", fr: "Batna" },
  Biskra: { ar: "بسكرة", fr: "Biskra" },
  Ghardaïa: { ar: "غرداية", fr: "Ghardaïa" },
  Ouargla: { ar: "ورقلة", fr: "Ouargla" },
  Béchar: { ar: "بشار", fr: "Béchar" },
  Adrar: { ar: "أدرار", fr: "Adrar" },
  Tamanrasset: { ar: "تمنراست", fr: "Tamanrasset" },
  "El Oued": { ar: "الوادي", fr: "El Oued" },
  Timimoun: { ar: "تيميمون", fr: "Timimoun" },
  Djanet: { ar: "جانت", fr: "Djanet" },
  Illizi: { ar: "إيليزي", fr: "Illizi" },
  Tindouf: { ar: "تندوف", fr: "Tindouf" },
};

export const CATEGORIES_I18N: Record<string, { ar: string; fr: string }> = {
  "Plastique": { ar: "بلاستيك", fr: "Plastique" },
  "Papier / Carton": { ar: "ورق وكرتون", fr: "Papier / Carton" },
  "Verre": { ar: "زجاج", fr: "Verre" },
  "Métal": { ar: "معدن", fr: "Métal" },
  "Organique": { ar: "عضوي", fr: "Organique" },
  "Électronique": { ar: "إلكترونيات", fr: "Électronique" },
  "Textile": { ar: "أقمشة ومنسوجات", fr: "Textile" },
  "Dangereux": { ar: "نفايات خاصة", fr: "Dangereux" },
};

export const POINTS_I18N: Record<
  string,
  {
    nameAr: string;
    addressAr: string;
    descriptionAr: string;
  }
> = {
  // Alger
  "Centre de tri Nord": {
    nameAr: "مركز الفرز الشمالي",
    addressAr: "123 شارع الرسكلة، الجزائر العاصمة",
    descriptionAr: "مركز فرز حضري رئيسي لاستقبال وفرز النفايات القابلة للتدوير من المواطنين والمؤسسات.",
  },
  "Centre de Tri ECOVEX Alger-Centre": {
    nameAr: "مركز الفرز إيكوفيكس الجزائر الوسطى",
    addressAr: "14 شارع ديدوش مراد، الجزائر الوسطى",
    descriptionAr: "مركز حضري رئيسي للفرز الانتقائي مزود بحاويات ذكية مخصصة للزجاج، الورق والبلاستيك.",
  },
  "Éco-Station Bab Ezzouar": {
    nameAr: "المحطة البيئية باب الزوار",
    addressAr: "القطب الجامعي وحي الأعمال، باب الزوار",
    descriptionAr: "نقطة تجميع آلية متطورة مزودة بميزان ذكي ومكابس ضغط للقارورات البلاستيكية والعلب.",
  },
  "Déchetterie Verte Sidi Abdellah": {
    nameAr: "المنشأة البيئية الخضراء سيدي عبد الله",
    addressAr: "شارع البيئة، المدينة الجديدة سيدي عبد الله",
    descriptionAr: "مركز تثمين رئيسي لمعالجة مختلف أنواع النفايات المنزلية والإلكترونية والكرتون.",
  },

  // Oran
  "Point vert Central": {
    nameAr: "النقطة الخضراء المركزية",
    addressAr: "45 نهج الاستقلال، وهران",
    descriptionAr: "محطة فرز وسط المدينة لتجميع وتثمين البلاستيك والزجاج والورق المقوى.",
  },
  "Station Écologique Oran Akid Lotfi": {
    nameAr: "المحطة البيئية وهران - عقيد لطفي",
    addressAr: "واجهة البحر، حي العقيد لطفي، وهران",
    descriptionAr: "كشك إيداع سريع للبلاستيك والعلب المعدنية والعبوات القابلة لإعادة التدوير.",
  },
  "Pôle de Recyclage Es-Sénia": {
    nameAr: "قطب التدوير والرسكلة السانية",
    addressAr: "المنطقة الصناعية والتجارية، السانية، وهران",
    descriptionAr: "مستودع للأحجام الكبيرة مخصص للكرتون، البلاستيك الصلب والمعادن الصناعية.",
  },

  // Constantine
  "Déchetterie Sud": {
    nameAr: "مركز المعالجة والفرز الجنوبي",
    addressAr: "78 طريق قالمة، قسنطينة",
    descriptionAr: "مركز معالجة النفايات المنزلية القابلة للتدوير وإعادة الاستخدام لمدينة الجسور المعلقة.",
  },
  "Éco-Kiosque Constantine Ali Mendjeli": {
    nameAr: "الكشك البيئي قسنطينة - علي منجلي",
    addressAr: "المدينة الجديدة علي منجلي، الوحدة الجوارية 05",
    descriptionAr: "محطة عصرية لجمع البلاستيك والزجاج والكرتون لخدمة سكان المدينة الجديدة.",
  },
  "Déchetterie Urbaine Sidi Mabrouk": {
    nameAr: "مركز الفرز الحضري سيدي مبروك",
    addressAr: "شارع الإخوة، سيدي مبروك، قسنطينة",
    descriptionAr: "نقطة تجميع تاريخية معاد تهيئتها بنظام وزن آلي وحاويات فرز انتقائي متطورة.",
  },

  // Annaba
  "Point Vert Annaba - Cours de la Révolution": {
    nameAr: "النقطة الخضراء عنابة - ساحة الثورة",
    addressAr: "ساحة الثورة، وسط مدينة عنابة",
    descriptionAr: "حاوية ذكية ومحطة فرز إيكولوجية وسط المدينة لتثمين المخلفات وتكريم المبادرات الفردية.",
  },

  // Sétif
  "Centre de Tri Sétif - 8 Mai 1945": {
    nameAr: "مركز الفرز سطيف - 8 ماي 1945",
    addressAr: "شارع 8 ماي 1945، بالقرب من بارك مول، سطيف",
    descriptionAr: "محطة حديثة مزودة بحاويات فرز ذكية ونظام مكافآت ونقاط بيئية للمواطنين.",
  },

  // Tlemcen
  "Station Verte Tlemcen - Imama": {
    nameAr: "المحطة الخضراء تلمسان - إمامة",
    addressAr: "الحي الجامعي إمامة، تلمسان",
    descriptionAr: "نقطة فرز مخصصة للطلبة والمواطنين مع الأولوية لمواد البلاستيك والورق.",
  },

  // Blida
  "Éco-Point Blida - Bab Essebt": {
    nameAr: "النقطة البيئية البليدة - باب السبت",
    addressAr: "ساحة باب السبت، البليدة",
    descriptionAr: "مركز فرز جواري للتجميع الانتقائي للزجاج والكرتون والمعادن المنزلية.",
  },

  // Béjaïa
  "Centre de Collecte Béjaïa - Port": {
    nameAr: "مركز التجميع بجاية - الميناء",
    addressAr: "شارع الحرية، منطقة الميناء، بجاية",
    descriptionAr: "نقطة فرز تركز على تثمين المخلفات البلاستيكية البحرية وحماية الساحل.",
  },

  // Batna
  "Pôle Environnement Batna - Tazoult": {
    nameAr: "قطب البيئة باتنة - تازولت",
    addressAr: "الطريق الوطني رقم 31، تازولت، باتنة",
    descriptionAr: "مركز تدوير وتسميد بيئي عند سفح جبال الأوراس لخدمة الولاية والمناطق المجاورة.",
  },

  // Biskra
  "Station des Zibans Biskra": {
    nameAr: "محطة الزيبان بسكرة",
    addressAr: "المنطقة الغربية، شارع النخيل، بسكرة",
    descriptionAr: "محطة تجميع شمسية ملائمة للمناخ الصحراوي لجمع القارورات والعبوات المعدنية.",
  },

  // Ghardaïa
  "Station Écologique de la Vallée du M'zab": {
    nameAr: "المحطة البيئية بوادي ميزاب غرداية",
    addressAr: "الطريق الوطني رقم 1، منطقة ثنية المخزن، غرداية",
    descriptionAr: "محطة شمسية للفرز والانتقاء بوادي ميزاب لتثمين البلاستيك والكرتون والزجاج.",
  },

  // Ouargla
  "Centre de Tri Saharien Ouargla - Sidi Khouiled": {
    nameAr: "مركز الفرز الصحراوي ورقلة - سيدي خويلد",
    addressAr: "منطقة النشاطات، طريق تقرت، ورقلة",
    descriptionAr: "مركز تثمين متطور مجهز بمكابس آلية لضغط قارورات البلاستيك والعلب المعدنية.",
  },

  // Béchar
  "Éco-Station de la Saoura Béchar": {
    nameAr: "المحطة البيئية للساورة بشار",
    addressAr: "شارع جيش التحرير الوطني، وسط مدينة بشار",
    descriptionAr: "نقطة فرز وتجميع إيكولوجية مسؤولة للكرتون والبلاستيك والأجهزة الكهربائية والإلكترونية.",
  },

  // Adrar
  "Pôle Vert du Touat Adrar": {
    nameAr: "القطب الأخضر بتوات أدرار",
    addressAr: "شارع الاستقلال، الحي الإداري، أدرار",
    descriptionAr: "منشأة بيئية نموذجية تعمل 100% بالطاقة الشمسية لفرز البلاستيك الزراعي والمنزلي.",
  },

  // Tamanrasset
  "Centre de Valorisation Hoggar Tamanrasset": {
    nameAr: "مركز التثمين البيئي بالأهقار تمنراست",
    addressAr: "شارع الأمير عبد القادر، طريق الأسكرام، تمنراست",
    descriptionAr: "مركز محوري بالجنوب الكبير لحماية النظم البيئية الصحراوية وتدوير القارورات والعبوات.",
  },

  // El Oued
  "Point Éco-Dunes El Oued": {
    nameAr: "نقطة الكثبان البيئية بالوادي",
    addressAr: "حي 19 مارس، شارع النخيل، الوادي",
    descriptionAr: "محطة تجميع وفرز حديثة للبلاستيك والورق والمعادن في منطقة وادي سوف.",
  },

  // Timimoun
  "Éco-Kiosque de l'Oasis Rouge Timimoun": {
    nameAr: "الكشك البيئي بالواحة الحمراء تيميمون",
    addressAr: "وسط المدينة، بالقرب من القصر العتيق، تيميمون",
    descriptionAr: "نقطة فرز لحماية الواحة وتدوير مخلفات التغليف والزجاج والمواد البلاستيكية السياحية.",
  },

  // Djanet
  "Station Éco-Tassili Djanet": {
    nameAr: "المحطة البيئية بطاسيلي جانت",
    addressAr: "شارع تين خاتمة، وسط مدينة جانت",
    descriptionAr: "نقطة تجميع بيئية مخصصة لحماية محمية المحيط الحيوي والتراث الطبيعي بطاسيلي ناجر.",
  },

  // Illizi
  "Point Vert du Tassili Illizi": {
    nameAr: "النقطة الخضراء لطاسيلي إيليزي",
    addressAr: "شارع 1 نوفمبر، وسط مدينة إيليزي",
    descriptionAr: "محطة فرز انتقائي ملائمة للمناطق الصحراوية لفرز البلاستيك والعلب والكرتون.",
  },

  // Tindouf
  "Borne Écologique Tindouf": {
    nameAr: "الحاوية البيئية تندوف",
    addressAr: "الشارع الرئيسي، وسط مدينة تندوف",
    descriptionAr: "نقطة فرز بيئية مواطنة لتثمين البلاستيك والعبوات المعدنية وإعادة استخدامها.",
  },
};

/**
 * Returns localized point data (name, address, description, city) based on active language
 */
export function getPointLocalized(
  point: {
    name: string;
    address: string;
    description: string | null;
    city: string;
  },
  lang: Lang
): LocalizedPointData {
  if (lang === "ar") {
    const entry = POINTS_I18N[point.name];
    const cityAr = CITIES_I18N[point.city]?.ar || point.city;

    return {
      name: entry?.nameAr || point.name,
      address: entry?.addressAr || point.address,
      description: entry?.descriptionAr || point.description || "",
      city: cityAr,
    };
  }

  return {
    name: point.name,
    address: point.address,
    description: point.description || "",
    city: CITIES_I18N[point.city]?.fr || point.city,
  };
}

/**
 * Returns localized category name
 */
export function getCategoryLocalized(name: string, lang: Lang): string {
  if (lang === "ar") {
    return CATEGORIES_I18N[name]?.ar || name;
  }
  return CATEGORIES_I18N[name]?.fr || name;
}

/**
 * Returns localized city name
 */
export function getCityLocalized(city: string, lang: Lang): string {
  if (lang === "ar") {
    return CITIES_I18N[city]?.ar || city;
  }
  return CITIES_I18N[city]?.fr || city;
}
