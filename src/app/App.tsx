import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLang } from './context/LanguageContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DesignStudio } from './components/DesignStudio';
import { PlateArchitect } from './components/PlateArchitect';
import { QuoteGenerator } from '../components/QuoteGenerator';
// import { PaymentTracker } from '../components/PaymentTracker'; // TODO: integrate later
import { VendorProfilePage } from '../components/VendorProfile';
import { useTheme } from './context/ThemeContext';
import {
  Users, Cake, Baby, Home, Church, ArrowRight, ArrowLeft,
  Zap, ShieldCheck, Star, Ruler, Sparkles, UtensilsCrossed, X,
  Sun, Moon, ChevronRight, FileText, CreditCard, Building2, LayoutGrid
} from 'lucide-react';

interface Design {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  coverImage: string;
  description: string;
  features: string[];
  designs: Design[];
}

const EVENT_PLANS: Record<string, Record<string, Plan>> = {
  wedding: {
    budget: {
      id: 'budget',
      name: 'Budget',
      price: 50000,
      coverImage: '/wedding-cover-simple1.jpg',
      description: 'Basic wedding setup with essential elements and standard services.',
      features: ['Basic decoration', 'Standard setup', 'Single light scheme', 'Basic catering'],
      designs: [
        { id: 'wed-budget-1', image: '/wedding-cover-simple1.jpg', title: 'Classic Simple', description: 'Clean and minimal design with essential setup' },
        { id: 'wed-budget-2', image: '/wedding-cover-simple2.png', title: 'Elegant Basic', description: 'Elegant yet affordable design concept' },
        { id: 'wed-budget-3', image: '/wedding-cover-simple3.png', title: 'Modern Minimal', description: 'Contemporary minimal design approach' }
      ]
    },
    standard: {
      id: 'standard',
      name: 'Standard',
      price: 120000,
      coverImage: '/wedding-cover-strandard1.png',
      description: 'Complete wedding package with premium elements and enhanced services.',
      features: ['Premium decoration', 'Advanced setup', 'Multi-light setup', 'Premium catering'],
      designs: [
        { id: 'wed-standard-1', image: '/wedding-cover-strandard1.png', title: 'Premium Elegant', description: 'Sophisticated design with premium elements' },
        { id: 'wed-standard-2', image: '/wedding-cover-strandard2.png', title: 'Modern Chic', description: 'Contemporary chic aesthetic' },
        { id: 'wed-standard-3', image: '/wedding-cover-strandard3.png', title: 'Luxury Standard', description: 'Luxurious yet accessible design' }
      ]
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 250000,
      coverImage: '/wedding-cover-premium1.png',
      description: 'Luxury wedding experience with exclusive elements and VIP services.',
      features: ['Luxury decoration', 'Full customization', 'Advanced lighting design', 'Gourmet catering'],
      designs: [
        { id: 'wed-premium-1', image: '/wedding-cover-premium1.png', title: 'Grand Luxury', description: 'Grand and luxurious event experience' },
        { id: 'wed-premium-2', image: '/wedding-cover-premium2.png', title: 'Opulent Elegance', description: 'Opulent and elegant celebration' },
        { id: 'wed-premium-3', image: '/wedding-cover-premium3.png', title: 'Exclusive VIP', description: 'Exclusive VIP luxury experience' }
      ]
    }
  },
  birthday: {
    budget: {
      id: 'budget',
      name: 'Budget',
      price: 5000,
      coverImage: '/bday-budget.png',
      description: 'Fun and essential setup for a memorable birthday.',
      features: ['Balloon arch', 'Table decor', 'Basic lighting', 'Simple cake stand'],
      designs: [
        { id: 'bday-budget-1', image: '/bday-budget.png', title: 'Classic Party', description: 'Bright and fun classic birthday' }
      ]
    },
    standard: {
      id: 'standard',
      name: 'Standard',
      price: 15000,
      coverImage: '/bday-standard.png',
      description: 'Enhanced birthday experience with themed decor.',
      features: ['Themed decoration', 'Backdrop setup', 'LED lighting', 'Premium dessert table'],
      designs: [
        { id: 'bday-standard-1', image: '/bday-standard.png', title: 'Themed Delight', description: 'Immersive themed birthday' }
      ]
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 35000,
      coverImage: '/bday-premium.png',
      description: 'Ultimate VIP birthday bash with grand scale elements.',
      features: ['Grand themed decor', 'Stage & dance floor', 'Custom light show', 'Full gourmet catering'],
      designs: [
        { id: 'bday-premium-1', image: '/bday-premium.png', title: 'Grand Bash', description: 'Over-the-top VIP celebration' }
      ]
    }
  },
  baby: {
    budget: {
      id: 'budget', name: 'Budget', price: 8000,
      coverImage: '/baby-budget.png',
      description: 'Soft and simple baby shower essentials.',
      features: ['Pastel decor', 'Seating setup', 'Basic treats'],
      designs: [{ id: 'baby-b1', image: '/baby-budget.png', title: 'Soft Pastels', description: 'Gentle pastel theme' }]
    },
    standard: {
      id: 'standard', name: 'Standard', price: 18000,
      coverImage: '/baby-standard.png',
      description: 'Beautifully crafted shower with custom themes.',
      features: ['Custom backdrop', 'Themed desserts', 'Floral elements'],
      designs: [{ id: 'baby-s1', image: '/baby-standard.png', title: 'Themed Joy', description: 'Cohesive custom theme' }]
    },
    premium: {
      id: 'premium', name: 'Premium', price: 30000,
      coverImage: '/baby-premium.png',
      description: 'Luxurious baby shower with premium installations.',
      features: ['Grand floral arch', 'Premium seating', 'Gourmet spread'],
      designs: [{ id: 'baby-p1', image: '/baby-premium.png', title: 'Luxury Arrival', description: 'High-end lavish shower' }]
    }
  },
  housewarming: {
    budget: {
      id: 'budget', name: 'Budget', price: 10000,
      coverImage: '/hw-budget.png',
      description: 'Welcoming setup with basic floral decor.',
      features: ['Entrance floral', 'Basic lighting', 'Simple seating'],
      designs: [{ id: 'hw-b1', image: '/hw-budget.png', title: 'Warm Welcome', description: 'Simple and inviting' }]
    },
    standard: {
      id: 'standard', name: 'Standard', price: 20000,
      coverImage: '/hw-standard.png',
      description: 'Elegant housewarming with full home decor touches.',
      features: ['Full floral garlands', 'Ambient lighting', 'Catering setup'],
      designs: [{ id: 'hw-s1', image: '/hw-standard.png', title: 'Elegant Entry', description: 'Sophisticated home styling' }]
    },
    premium: {
      id: 'premium', name: 'Premium', price: 40000,
      coverImage: '/hw-premium.png',
      description: 'Extravagant home celebration with premium decor.',
      features: ['Grand entrance', 'Custom lighting design', 'Live music space'],
      designs: [{ id: 'hw-p1', image: '/hw-premium.png', title: 'Grand Estate', description: 'Luxury home presentation' }]
    }
  },
  memorial: {
    budget: {
      id: 'budget', name: 'Budget', price: 4000,
      coverImage: '/mem-budget.png',
      description: 'Respectful and simple arrangement.',
      features: ['White drapes', 'Basic floral stands', 'Simple seating'],
      designs: [{ id: 'mem-b1', image: '/mem-budget.png', title: 'Simple Tribute', description: 'Quiet and respectful' }]
    },
    standard: {
      id: 'standard', name: 'Standard', price: 8000,
      coverImage: '/mem-standard.png',
      description: 'Elegant memorial with beautiful floral tributes.',
      features: ['Full white drapes', 'Premium floral wreaths', 'Audio setup'],
      designs: [{ id: 'mem-s1', image: '/mem-standard.png', title: 'Elegant Farewell', description: 'Beautiful floral setup' }]
    },
    premium: {
      id: 'premium', name: 'Premium', price: 15000,
      coverImage: '/mem-premium.png',
      description: 'Premium tribute with comprehensive arrangements.',
      features: ['Extensive floral design', 'Ambient lighting', 'Catering service'],
      designs: [{ id: 'mem-p1', image: '/mem-premium.png', title: 'Honored Memory', description: 'Comprehensive and grand' }]
    }
  }
};

// EVENTS now built inside the component so titles react to language
function useEvents() {
  const { t } = useLang();
  return [
    { id: 'wedding',      title: t('weddings'),    desc: t('weddingsDesc'),    icon: <Users className="w-5 h-5" />, emoji: '💍', needsStageCustomization: true },
    { id: 'birthday',     title: t('birthdays'),   desc: t('birthdaysDesc'),   icon: <Cake className="w-5 h-5" />,  emoji: '🎂', needsStageCustomization: true },
    { id: 'baby',         title: t('babyShower'),  desc: t('babyShowerDesc'),  icon: <Baby className="w-5 h-5" />,  emoji: '🍼', needsStageCustomization: true },
    { id: 'housewarming', title: t('housewarming'),desc: t('housewarmingDesc'),icon: <Home className="w-5 h-5" />,  emoji: '🏡', needsStageCustomization: false },
    { id: 'memorial',     title: t('memorial'),    desc: t('memorialDesc'),    icon: <Church className="w-5 h-5" />,emoji: '🕊️', needsStageCustomization: false },
  ];
}

const PLAN_TIERS = [
  { id: 'budget', icon: <Zap className="w-4 h-4" />, badge: 'Starter', color: 'from-purple-400 to-purple-300' },
  { id: 'standard', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Popular', color: 'from-purple-600 to-purple-400' },
  { id: 'premium', icon: <Star className="w-4 h-4" />, badge: 'VIP', color: 'from-purple-800 to-purple-500' },
];

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e293b, #38bdf8)'
          : 'linear-gradient(135deg, #2a7dd4, #5aa0e0)',
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-500"
        style={{ transform: isDark ? 'translateX(28px)' : 'translateX(0)' }}
      >
        {isDark
          ? <Moon className="w-3.5 h-3.5 text-[#1e293b]" />
          : <Sun className="w-3.5 h-3.5 text-[#2a7dd4]" />
        }
      </span>
    </button>
  );
}

function LangToggle() {
  const { toggleLang, t } = useLang();
  const { isDark } = useTheme();
  return (
    <button
      onClick={toggleLang}
      aria-label="Toggle language"
      className="px-3 h-7 rounded-full text-[11px] font-black tracking-wide transition-all active:scale-95"
      style={{
        background: isDark ? 'rgba(56,189,248,0.1)' : '#c8e4ff',
        color: isDark ? '#38bdf8' : '#2a7dd4',
        border: isDark ? '1px solid rgba(56,189,248,0.3)' : '1px solid rgba(42,125,212,0.25)',
      }}
    >
      {t('langLabel')}
    </button>
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [activePackage, setActivePackage] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const EVENTS = useEvents();

  // Carousel ref and state for touch-friendly autoscroll
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || isHovered) return;

    let animationFrameId: number;

    const scroll = (time: number) => {
      if (el && !isHovered) {
        el.scrollLeft += 0.5;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, selectedEvent, activeScreen]);

  const isDark = theme === 'dark';
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const bg = isDark ? '#0a0f1a' : '#f0f7ff';
  const card = isDark ? '#161e2d' : '#ddeeff';
  const border = isDark ? 'rgba(100, 180, 255, 0.12)' : 'rgba(42,125,212,0.18)';
  const text = isDark ? '#e2e8f0' : '#0d2d52';
  const textMuted = isDark ? 'rgba(148, 163, 184, 0.7)' : '#3a6898';
  const accent = isDark ? '#38bdf8' : '#2a7dd4';

  const startDesign = (packageId: string | null = null) => {
    setActivePackage(packageId);
    setActiveScreen('studio');
  };

  const currentEvent = EVENTS.find(e => e.id === selectedEvent);

  const handleNextDesign = () => {
    if (selectedPlan) setCurrentDesignIndex(prev => (prev + 1) % selectedPlan.designs.length);
  };
  const handlePrevDesign = () => {
    if (selectedPlan) setCurrentDesignIndex(prev => (prev - 1 + selectedPlan.designs.length) % selectedPlan.designs.length);
  };
  const goHome = () => setActiveScreen('home');

  // ── PLAN DETAIL VIEW ─────────────────────────────────────────────────────────
  if (selectedPlan) {
    const currentDesign = selectedPlan.designs[currentDesignIndex];
    return (
      <div className="min-h-screen flex items-center justify-center p-3" style={{ background: bg, color: text }}>
        <div
          className="w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl"
          style={{ background: card, border: `1px solid ${border}` }}
        >
          {/* Plan Header */}
          <div
            className="relative px-5 pt-5 pb-4"
            style={{ background: `linear-gradient(135deg, ${isDark ? '#1e293b' : '#c8e4ff'}, ${isDark ? '#0a0f1a' : '#b3d9ff'})` }}
          >
            <button
              onClick={() => { setSelectedPlan(null); setCurrentDesignIndex(0); setSelectedDesign(null); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: border, color: text }}
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{selectedPlan.name} Plan</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-black" style={{ color: text }}>₹{selectedPlan.price.toLocaleString('en-IN')}</span>
              <span className="text-xs mb-1" style={{ color: textMuted }}>starting</span>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative w-full aspect-video overflow-hidden">
            <img loading="lazy" src={currentDesign.image} alt={currentDesign.title} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <button onClick={handlePrevDesign} className="w-9 h-9 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center active:scale-90 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextDesign} className="w-9 h-9 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center active:scale-90 transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {selectedPlan.designs.map((_, i) => (
                <button key={i} onClick={() => setCurrentDesignIndex(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: i === currentDesignIndex ? 20 : 6, background: i === currentDesignIndex ? '#fff' : 'rgba(255,255,255,0.5)' }}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="p-5 space-y-4">
            <div>
              <h3 className="font-bold text-lg" style={{ color: text }}>{currentDesign.title}</h3>
              <p className="text-sm mt-0.5" style={{ color: textMuted }}>{currentDesign.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {selectedPlan.features.map((f, i) => (
                <div key={i} className="rounded-xl px-3 py-2" style={{ background: isDark ? '#1e293b' : '#c8e4ff' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                      <span className="text-white text-[9px] font-black">✓</span>
                    </span>
                    <span className="text-xs font-medium" style={{ color: text }}>{f}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  const eventName = selectedEvent ? EVENTS.find(e => e.id === selectedEvent)?.title : 'Event';
                  const text = `Hi, I'm interested in the ${currentDesign.title} package for my ${eventName}!\n\n*Plan:* ${selectedPlan.name}\n*Starting from:* ₹${selectedPlan.price.toLocaleString('en-IN')}\n\n*Features:*\n${selectedPlan.features.map(f => `✅ ${f}`).join('\n')}\n\nCould you provide more details?`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{ background: `linear-gradient(135deg, ${accent}, ${isDark ? '#0ea5e9' : '#5aa0e0'})`, color: '#fff' }}
              >
                Start with {currentDesign.title} →
              </button>
              <button
                onClick={() => { setSelectedPlan(null); setCurrentDesignIndex(0); setSelectedDesign(null); }}
                className="w-full py-3 rounded-2xl font-medium text-sm transition-all active:scale-95"
                style={{ border: `1px solid ${border}`, color: text }}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STUDIO VIEW ───────────────────────────────────────────────────────────────
  if (activeScreen === 'studio') {
    return (
      <DndProvider
        backend={isTouchDevice ? TouchBackend : HTML5Backend}
        options={isTouchDevice ? { enableMouseEvents: true, delayTouchStart: 100 } : undefined}
      >
        <DesignStudio initialPackage={activePackage} eventType={selectedEvent} />
        <button
          onClick={goHome}
          onTouchEnd={(e) => { e.preventDefault(); goHome(); }}
          className="fixed top-3 left-3 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all active:scale-95"
          style={{ background: card, color: text, border: `1px solid ${border}` }}
        >
          <ArrowLeft className="w-4 h-4" /> {t('back').replace('← ', '')}
        </button>
      </DndProvider>
    );
  }

  // ── CATERING VIEW ─────────────────────────────────────────────────────────────
  if (activeScreen === 'catering') {
    return (
      <>
        <PlateArchitect />
        <button
          onClick={() => setActiveScreen('home')}
          className="fixed top-3 left-3 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all active:scale-95"
          style={{ background: card, color: text, border: `1px solid ${border}` }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </>
    );
  }

  // ── QUOTE GENERATOR VIEW ───────────────────────────────────────────────────────
  if (activeScreen === 'quotes') {
    return (
      <>
        <QuoteGenerator />
        <BottomNav active={activeScreen} onNav={setActiveScreen} isDark={isDark} border={border} card={card} text={text} accent={accent} />
      </>
    );
  }

  // ── PAYMENT TRACKER VIEW (commented out — integrate later) ────────────────────
  // if (activeScreen === 'payments') {
  //   return (
  //     <>
  //       <PaymentTracker />
  //       <BottomNav active={activeScreen} onNav={setActiveScreen} isDark={isDark} border={border} card={card} text={text} accent={accent} />
  //     </>
  //   );
  // }

  // ── VENDOR PROFILE VIEW ────────────────────────────────────────────────────────
  if (activeScreen === 'profile') {
    return (
      <>
        <VendorProfilePage />
        <BottomNav active={activeScreen} onNav={setActiveScreen} isDark={isDark} border={border} card={card} text={text} accent={accent} />
      </>
    );
  }

  // ── HOME VIEW ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24 relative overflow-x-hidden" style={{ background: bg, color: text }}>
      
      {/* Dynamic Animated Background */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-[0.07]"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)`, filter: 'blur(80px)' }}
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-[0.05]"
            style={{ background: `radial-gradient(circle, #818cf8, transparent 70%)`, filter: 'blur(100px)' }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-lg mx-auto">

      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: isDark ? 'rgba(10,15,26,0.85)' : 'rgba(240,247,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg" 
              style={{ background: `linear-gradient(135deg, ${accent}, ${isDark ? '#0ea5e9' : '#5aa0e0'})` }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none" style={{ color: text }}>{t('appName')}</h1>
              <p className="text-[10px] font-medium tracking-wide" style={{ color: textMuted }}>{t('appTagline')}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <ThemeToggle />
            <LangToggle />
          </div>
        </div>
      </motion.header>

      {/* ── HERO BANNER ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="px-4 pt-5 pb-2"
      >
        <div
          className="rounded-[32px] p-6 relative overflow-hidden shadow-2xl"
          style={{ background: isDark ? 'linear-gradient(135deg, #1e293b, #0f172a)' : `linear-gradient(135deg, #c8e4ff, #b3d9ff)`, border: `1px solid ${border}` }}
        >
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" 
            style={{ background: accent, filter: 'blur(30px)' }} 
          />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>{t('welcome')}</p>
            <h2 className="text-2xl font-black leading-tight mb-2" style={{ color: text }}>{t('heroTitle')}</h2>
            <p className="text-sm leading-relaxed max-w-[85%]" style={{ color: textMuted }}>{t('heroSubtitle')}</p>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-4 space-y-8">

        {/* ── EVENT SELECTION ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black tracking-tight" style={{ color: text }}>
              {selectedEvent ? `${currentEvent?.emoji} ${currentEvent?.title}` : t('eventType')}
            </h2>
            {selectedEvent && (
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm"
                style={{ background: card, border: `1px solid ${border}`, color: text }}
              >
                <ArrowLeft className="w-3 h-3" /> All
              </button>
            )}
          </div>

          {!selectedEvent ? (
            /* Event Grid */
            <div className="grid grid-cols-2 gap-2.5">
              {EVENTS.map(event => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className="text-left p-4 rounded-2xl transition-all active:scale-95 group"
                  style={{ background: card, border: `1px solid ${border}` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all" style={{ background: isDark ? 'rgba(56,189,248,0.1)' : '#b3d9ff', color: accent }}>
                    {event.icon}
                  </div>
                  <h3 className="font-bold text-sm leading-tight mb-1" style={{ color: text }}>{event.title}</h3>
                  <p className="text-[11px] leading-4 opacity-70" style={{ color: textMuted }}>{event.desc}</p>
                  <div className="mt-3 flex items-center gap-1" style={{ color: accent }}>
                    <span className="text-[10px] font-black uppercase tracking-wider">Select</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Plan Selection after event chosen */
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {currentEvent?.needsStageCustomization && (
                <button
                  onClick={() => startDesign()}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-95"
                  style={{ background: card, border: `1px solid ${border}` }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isDark ? 'rgba(56,189,248,0.1)' : '#b3d9ff', color: accent }}>
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm" style={{ color: text }}>{t('customizeStage')}</h3>
                    <p className="text-xs mt-0.5" style={{ color: textMuted }}>{t('blankCanvas')}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
                </button>
              )}

              <p className="text-xs font-semibold uppercase tracking-widest px-1" style={{ color: textMuted }}>{t('orChoosePackage')}</p>

              {/* Auto-scrolling plan carousel — all 3 visible & looping */}
              <div 
                className="relative overflow-x-auto hide-scrollbar rounded-2xl shadow-inner"
                ref={carouselRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setIsHovered(false)}
                style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'auto', background: 'rgba(0,0,0,0.02)' }}
              >
                <div className="flex gap-3 w-max px-2 py-4">
                  {/* Render twice for seamless infinite loop */}
                  {[...PLAN_TIERS, ...PLAN_TIERS].map((tier, idx) => {
                    const currentEventPlans = (selectedEvent && EVENT_PLANS[selectedEvent]) ? EVENT_PLANS[selectedEvent] : EVENT_PLANS['wedding'];
                    const plan = currentEventPlans[tier.id];
                    return (
                      <motion.button
                        key={`${tier.id}-${idx}`}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedPlan(plan)}
                        className="w-[155px] flex-shrink-0 rounded-3xl overflow-hidden text-left transition-all active:scale-95 shadow-lg border-2"
                        style={{ borderColor: border, background: card }}
                      >
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <img loading="lazy" src={plan.coverImage} alt={plan.name} className="w-full h-full object-cover object-center" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <span className="absolute bottom-2 left-2 text-[10px] font-black text-white uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30">
                            {tier.badge}
                          </span>
                          <span className="absolute top-2 right-2 text-white drop-shadow-md">{tier.icon}</span>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-black text-sm" style={{ color: text }}>{plan.name}</span>
                            <span className="text-[11px] font-black px-1.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500">₹{(plan.price / 1000).toFixed(0)}k</span>
                          </div>
                          <p className="text-[10px] leading-relaxed line-clamp-2 opacity-70" style={{ color: textMuted }}>{plan.description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: border }} />
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: textMuted }}>{t('also')}</span>
          <div className="flex-1 h-px" style={{ background: border }} />
        </div>

        {/* ── CATERING CARD ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-black tracking-tight mb-4" style={{ color: text }}>{t('foodCatering')}</h2>
          <button
            onClick={() => setActiveScreen('catering')}
            className="w-full text-left rounded-[32px] overflow-hidden transition-all active:scale-[0.98] shadow-xl border-2"
            style={{ background: card, borderColor: border }}
          >
            <div
              className="px-6 py-5 flex items-center gap-5"
              style={{ background: isDark ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'linear-gradient(135deg, #f0f7ff, #faf8ff)' }}
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" 
                style={{ background: `linear-gradient(135deg, ${accent}, ${isDark ? '#0ea5e9' : '#5aa0e0'})` }}
              >
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black tracking-tight" style={{ color: text }}>{t('plateArchitect')}</h3>
                <p className="text-xs mt-1 leading-relaxed opacity-80" style={{ color: textMuted }}>{t('plateArchitectDesc')}</p>
              </div>
              <ChevronRight className="w-6 h-6 flex-shrink-0" style={{ color: accent }} />
            </div>
            <div className="px-6 py-4 flex gap-2 overflow-x-auto hide-scrollbar" style={{ borderTop: `1px solid ${border}`, background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)' }}>
              {[t('menuBuilder'), t('guestCount'), t('pdfQuotes')].map(tag => (
                <span key={tag} className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border" style={{ background: isDark ? 'rgba(56,189,248,0.05)' : '#b3d9ff', color: accent, borderColor: isDark ? 'rgba(56,189,248,0.1)' : 'transparent' }}>
                  {tag}
                </span>
              ))}
            </div>
          </button>
        </motion.section>

      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav active={activeScreen} onNav={setActiveScreen} isDark={isDark} border={border} card={card} text={text} accent={accent} />
      </div>
    </div>
  );
}

// ── Bottom Navigation Bar ─────────────────────────────────────────────────────
type Screen = 'home' | 'studio' | 'catering' | 'quotes' | /* 'payments' | */ 'profile';

function BottomNav({ active, onNav, isDark, border, card, text, accent }: {
  active: Screen;
  onNav: (s: Screen) => void;
  isDark: boolean; border: string; card: string; text: string; accent: string;
}) {
  const { t } = useLang();
  const items = [
    { id: 'home' as Screen,     label: t('home'),   icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'quotes' as Screen,   label: t('quotes'), icon: <FileText className="w-5 h-5" /> },
    { id: 'profile' as Screen,  label: t('vendor'), icon: <Building2 className="w-5 h-5" /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 max-w-lg mx-auto"
      style={{
        background: isDark ? 'rgba(10,15,26,0.97)' : 'rgba(240,247,255,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: `1px solid ${border}`,
      }}
    >
      {items.map(item => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all active:scale-90"
            style={{
              background: isActive ? (isDark ? 'rgba(56,189,248,0.1)' : '#c8e4ff') : 'transparent',
              color: isActive ? accent : isDark ? 'rgba(148,163,184,0.4)' : 'rgba(13,45,82,0.45)',
            }}
          >
            <motion.div
              animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {item.icon}
            </motion.div>
            <span className="text-[9px] font-bold">{item.label}</span>
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-1 w-1 h-1 rounded-full" 
                style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} 
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
