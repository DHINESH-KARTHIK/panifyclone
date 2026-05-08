import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'ta';

// ── All UI strings ─────────────────────────────────────────────────────────────
export const translations = {
  en: {
    // App / Header
    appName: 'Planify',
    appTagline: 'Event Planner',
    // Hero
    welcome: '✨ Welcome',
    heroTitle: 'Plan your perfect event',
    heroSubtitle: 'Design stages, plan menus & get instant quotes — all in one app.',
    // Event section
    eventType: '🎉 Event Type',
    select: 'Select',
    all: 'All',
    // Events
    weddings: 'Weddings',
    weddingsDesc: 'Grand stages & floral drapes',
    birthdays: 'Birthdays',
    birthdaysDesc: 'Balloons & intimate lighting',
    babyShower: 'Baby Shower',
    babyShowerDesc: 'Soft pastels & central seating',
    housewarming: 'Housewarming',
    housewarmingDesc: 'Floral hangings & entrance',
    memorial: 'Memorial',
    memorialDesc: 'White drapes & subtle florals',
    // Plans
    customizeStage: 'Customize Your Stage',
    blankCanvas: 'Start with a blank canvas →',
    orChoosePackage: 'Or choose a package',
    starting: 'starting',
    starter: 'Starter',
    popular: 'Popular',
    vip: 'VIP',
    budget: 'Budget',
    standard: 'Standard',
    premium: 'Premium',
    // Plan detail
    back: '← Back',
    startWith: 'Start with',
    // Catering
    foodCatering: '🍽️ Food & Catering',
    plateArchitect: 'Plate Architect',
    plateArchitectDesc: 'Build menus, estimate guests & export PDF quotes instantly',
    menuBuilder: 'Menu Builder',
    guestCount: 'Guest Count',
    pdfQuotes: 'PDF Quotes',
    // Divider
    also: 'Also',
    // Bottom Nav
    home: 'Home',
    quotes: 'Quotes',
    vendor: 'Vendor',
    // Design Studio
    designStudio: 'Design Studio',
    dragItems: 'Drag items onto the stage',
    stageArea: 'Stage Area',
    stageEmpty: 'Drag items onto the stage',
    share: 'Share',
    total: 'Total',
    // Resource Ribbon categories
    catAll: 'All',
    catBackground: 'Stage Background',
    catDecor: 'Decor',
    catInfrastructure: 'Infrastructure',
    catLighting: 'Lighting',
    // Resource items
    flowerArrangement: 'Flower Arrangement',
    elegantDrapes: 'Elegant Drapes',
    singleSpeaker: 'Single Speaker',
    foldingChair: 'Folding Chair',
    shamiyanaТent: 'Shamiyana Tent',
    stagePlatform: 'Stage Platform',
    ledSpotlight: 'LED Spotlight',
    stringLights: 'String Lights',
    chandelier: 'Chandelier',
    gardenVenue: 'Garden Venue',
    ballroomSetting: 'Ballroom Setting',
    outdoorBanquet: 'Outdoor Banquet',
    classicElegance: 'Classic Elegance',
    modernMinimalist: 'Modern Minimalist',
    // Language toggle
    langLabel: 'தமிழ்',
  },
  ta: {
    appName: 'பிளானிஃபை',
    appTagline: 'நிகழ்வு திட்டமிடல்',
    welcome: '✨ வரவேற்கிறோம்',
    heroTitle: 'உங்கள் நிகழ்வை சிறப்பாக திட்டமிடுங்கள்',
    heroSubtitle: 'மேடை வடிவமைப்பு, உணவு திட்டம் & உடனடி மேற்கோள்கள் — ஒரே செயலியில்.',
    eventType: '🎉 நிகழ்வு வகை',
    select: 'தேர்வு',
    all: 'அனைத்தும்',
    weddings: 'திருமணம்',
    weddingsDesc: 'பெரிய மேடை & மலர் திரைகள்',
    birthdays: 'பிறந்தநாள்',
    birthdaysDesc: 'பலூன்கள் & இனிய வெளிச்சம்',
    babyShower: 'குழந்தை வரவேற்பு',
    babyShowerDesc: 'மென்மையான நிறங்கள் & மையம்',
    housewarming: 'இல்ல பிரவேசம்',
    housewarmingDesc: 'மலர் தோரணம் & நுழைவு',
    memorial: 'நினைவஞ்சலி',
    memorialDesc: 'வெண் திரைகள் & மலர்கள்',
    customizeStage: 'உங்கள் மேடையை தனிப்பயனாக்குங்கள்',
    blankCanvas: 'காலியான மேடையில் தொடங்கு →',
    orChoosePackage: 'அல்லது ஒரு தொகுப்பை தேர்வு செய்க',
    starting: 'தொடக்கம்',
    starter: 'ஆரம்பம்',
    popular: 'பிரபலம்',
    vip: 'VIP',
    budget: 'சாதாரண',
    standard: 'நிலையான',
    premium: 'உயர்தர',
    back: '← திரும்பு',
    startWith: 'தொடங்குங்கள்',
    foodCatering: '🍽️ உணவு & விருந்து',
    plateArchitect: 'தட்டு வடிவமைப்பாளர்',
    plateArchitectDesc: 'மெனு உருவாக்கவும், விருந்தாளிகளை மதிப்பிடவும் & PDF மேற்கோள்களை ஏற்றுமதி செய்யுங்கள்',
    menuBuilder: 'மெனு உருவாக்கம்',
    guestCount: 'விருந்தினர் எண்ணிக்கை',
    pdfQuotes: 'PDF மேற்கோள்',
    also: 'மேலும்',
    home: 'முகப்பு',
    quotes: 'மேற்கோள்',
    vendor: 'விற்பனையாளர்',
    designStudio: 'வடிவமைப்பு ஸ்டுடியோ',
    dragItems: 'பொருட்களை மேடையில் இழுக்கவும்',
    stageArea: 'மேடை பரப்பு',
    stageEmpty: 'பொருட்களை மேடையில் இழுக்கவும்',
    share: 'பகிர்',
    total: 'மொத்தம்',
    catAll: 'அனைத்தும்',
    catBackground: 'மேடை பின்னணி',
    catDecor: 'அலங்காரம்',
    catInfrastructure: 'கட்டமைப்பு',
    catLighting: 'வெளிச்சம்',
    flowerArrangement: 'மலர் அலங்காரம்',
    elegantDrapes: 'நேர்த்தியான திரைகள்',
    singleSpeaker: 'ஒற்றை ஒலிபெருக்கி',
    foldingChair: 'மடிப்பு நாற்காலி',
    shamiyanaТent: 'சாமியானா கூடாரம்',
    stagePlatform: 'மேடை தளம்',
    ledSpotlight: 'LED விளக்கு',
    stringLights: 'கம்பி விளக்குகள்',
    chandelier: 'மேல்விளக்கு',
    gardenVenue: 'தோட்ட இடம்',
    ballroomSetting: 'நடன அரங்கம்',
    outdoorBanquet: 'வெளிப்புற விருந்து',
    classicElegance: 'உன்னத நேர்த்தி',
    modernMinimalist: 'நவீன எளிமை',
    langLabel: 'English',
  },
} as const;

export type TranslationKey = keyof typeof translations['en'];

// ── Context ────────────────────────────────────────────────────────────────────
interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  toggleLang: () => {},
  t: (key) => translations.en[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem('planify-lang') as Lang) || 'en',
  );

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'ta' : 'en';
      localStorage.setItem('planify-lang', next);
      return next;
    });
  };

  const t = (key: TranslationKey): string => translations[lang][key];

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
