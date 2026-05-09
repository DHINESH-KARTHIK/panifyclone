import { useRef, useCallback } from 'react';
import { Flower2, Armchair, Lightbulb, Wind, Gift, SquareStack } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import flowerImg from './flower.png';
import manImg from './many-removebg.png';
import stgImg from './image.png';
import stgfreeImg from './stagefree.jpg';
import single from './single.png';

export interface ResourceItem {
  id: string;
  name: string;
  price: number;
  category: 'Decor' | 'Infrastructure' | 'Lighting' | 'Stage Background';
  icon: any;
  image: string | any;
  isBackground?: boolean;
}

const resources: ResourceItem[] = [
  { 
    id: 'flowers-1', 
    name: 'Flower Arrangement', 
    price: 5000, 
    category: 'Decor', 
    icon: Flower2,
    image: flowerImg
  },
  { 
    id: 'drapes-1', 
    name: 'Elegant Drapes', 
    price: 3500, 
    category: 'Decor', 
    icon: Wind,
    image: manImg
  },
  { 
    id: 'centerpiece-1', 
    name: 'Single speaker', 
    price: 2000, 
    category: 'Decor', 
    icon: Gift,
    image: single
  },
  { 
    id: 'chair-1', 
    name: 'Folding Chair', 
    price: 150, 
    category: 'Infrastructure', 
    icon: Armchair,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=400'
  },
  { 
    id: 'tent-1', 
    name: 'Shamiyana Tent', 
    price: 15000, 
    category: 'Infrastructure', 
    icon: SquareStack,
    image: 'https://images.unsplash.com/photo-1493514789560-586f3ee6c515?auto=format&fit=crop&w=400&h=400'
  },
  { 
    id: 'stage-1', 
    name: 'Stage Platform', 
    price: 12000, 
    category: 'Infrastructure', 
    icon: SquareStack,
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&h=400'
  },
  { 
    id: 'lights-1', 
    name: 'LED Spotlight', 
    price: 1500, 
    category: 'Lighting', 
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1565636192335-14eccb3c3f29?auto=format&fit=crop&w=400&h=400'
  },
  { 
    id: 'lights-2', 
    name: 'String Lights', 
    price: 800, 
    category: 'Lighting', 
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?auto=format&fit=crop&w=400&h=400'
  },
  { 
    id: 'lights-3', 
    name: 'Chandelier', 
    price: 8000, 
    category: 'Lighting', 
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1565881223467-7e0b6b7ea0de?auto=format&fit=crop&w=400&h=400'
  },
  { 
    id: 'bg-garden', 
    name: 'Garden Venue', 
    price: 0, 
    category: 'Stage Background', 
    icon: Flower2,
    image: stgImg,
    isBackground: true
  },
  { 
    id: 'bg-ballroom', 
    name: 'Ballroom Setting', 
    price: 0, 
    category: 'Stage Background', 
    icon: SquareStack,
    image: stgfreeImg,
    isBackground: true
  },
  { 
    id: 'bg-outdoor', 
    name: 'Outdoor Banquet', 
    price: 0, 
    category: 'Stage Background', 
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1552072092-25bd00f233de?auto=format&fit=crop&w=1200&h=1200',
    isBackground: true
  },
  { 
    id: 'bg-classic', 
    name: 'Classic Elegance', 
    price: 0, 
    category: 'Stage Background', 
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1496242686353-8bea1b60dd72?auto=format&fit=crop&w=1200&h=1200',
    isBackground: true
  },
  { 
    id: 'bg-modern', 
    name: 'Modern Minimalist', 
    price: 0, 
    category: 'Stage Background', 
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&h=1200',
    isBackground: true
  },
];

// ─── Touch-native draggable card ──────────────────────────────────────────────
// react-dnd's HTML5 backend doesn't fire on touch. We implement pointer-events
// drag manually: on pointerdown we clone a ghost image and move it under the
// finger; on pointerup we detect which element is under the finger (the canvas)
// and call the onDrop callback directly.

interface TouchCardProps {
  item: ResourceItem;
  onTouchDrop: (item: ResourceItem, clientX: number, clientY: number) => void;
  card: string;
  border: string;
  text: string;
  isDark: boolean;
  accent: string;
}

function TouchResourceCard({ item, onTouchDrop, card, border, text, isDark, accent }: TouchCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only handle primary pointer
    if (e.button > 0) return;
    // Skip ghost for mouse — browser native drag handles it
    if (e.pointerType === 'mouse') return;
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;

    // Create a ghost clone
    const ghost = document.createElement('div');
    ghost.style.cssText = `
      position: fixed;
      width: 80px;
      height: 96px;
      left: ${e.clientX - 40}px;
      top: ${e.clientY - 48}px;
      z-index: 9999;
      pointer-events: none;
      opacity: 0.85;
      border-radius: 12px;
      overflow: hidden;
      background: ${card};
      border: 1px solid ${border};
      box-shadow: 0 8px 32px rgba(0,0,0,0.28);
      transform: scale(1.08);
      will-change: transform, left, top;
      transition: none;
    `;
    const img = document.createElement('img');
    img.src = typeof item.image === 'string' ? item.image : item.image;
    img.style.cssText = 'width:100%;height:64px;object-fit:contain;padding:4px;';
    const label = document.createElement('div');
    label.textContent = item.name;
    label.style.cssText = `font-size:9px;font-weight:700;text-align:center;color:${text};padding:2px 4px;line-clamp:2;`;
    ghost.appendChild(img);
    ghost.appendChild(label);
    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    const onMove = (moveE: PointerEvent) => {
      const dx = Math.abs(moveE.clientX - startX);
      const dy = Math.abs(moveE.clientY - startY);
      if (dx > 4 || dy > 4) moved = true;
      if (moved) {
        isDraggingRef.current = true;
        ghost.style.left = `${moveE.clientX - 40}px`;
        ghost.style.top = `${moveE.clientY - 48}px`;
      }
    };

    const onUp = (upE: PointerEvent) => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);

      if (ghostRef.current) {
        ghostRef.current.remove();
        ghostRef.current = null;
      }

      if (moved) {
        onTouchDrop(item, upE.clientX, upE.clientY);
      }
      isDraggingRef.current = false;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
  }, [item, card, border, text, onTouchDrop]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: typeof item.image === 'string' ? item.image : item.id,
      isBackground: item.isBackground,
    }));
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onPointerDown={handlePointerDown}
      className="flex-shrink-0 w-24 sm:w-28 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        background: card,
        border: `1px solid ${border}`,
        touchAction: 'pan-x',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <div
        className="w-full h-16 sm:h-20 overflow-hidden flex items-center justify-center p-1"
        style={{ background: isDark ? '#1e293b' : '#c8e4ff' }}
      >
        <img
          loading="lazy"
          src={item.image}
          alt={item.name}
          draggable={false}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/></svg>';
          }}
        />
      </div>
      <div className="p-1.5 text-center">
        <p className="text-[10px] font-semibold line-clamp-2 leading-tight" style={{ color: text }}>
          {item.name}
        </p>
        {item.price > 0 && (
          <p className="text-[10px] font-black mt-0.5" style={{ color: accent }}>
            ₹{item.price.toLocaleString('en-IN')}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Ribbon ───────────────────────────────────────────────────────────────────

interface ResourceRibbonProps {
  /** Called when a card is dropped on the canvas via touch/pointer drag */
  onPointerDrop?: (item: ResourceItem, clientX: number, clientY: number) => void;
}

export function ResourceRibbon({ onPointerDrop }: ResourceRibbonProps) {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Stage Background', 'Decor', 'Infrastructure', 'Lighting'];
  const filteredResources =
    activeCategory === 'All'
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  const bg = isDark ? '#0a0f1a' : '#f0f7ff';
  const border = isDark ? 'rgba(100, 180, 255, 0.1)' : 'rgba(42,125,212,0.18)';
  const text = isDark ? '#e2e8f0' : '#0d2d52';
  const accent = isDark ? '#38bdf8' : '#2a7dd4';
  const card = isDark ? '#161e2d' : '#ddeeff';
  const cardBorder = isDark ? 'rgba(100, 180, 255, 0.12)' : 'rgba(42,125,212,0.18)';

  const handleTouchDrop = useCallback(
    (item: ResourceItem, clientX: number, clientY: number) => {
      onPointerDrop?.(item, clientX, clientY);
    },
    [onPointerDrop],
  );

  return (
    <div
      style={{
        background: bg,
        borderTop: `1px solid ${border}`,
        // Safe area for phones with home indicator
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Category Tabs */}
      <div
        className="flex gap-1.5 px-3 pt-3 overflow-x-auto w-full"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          overflowX: 'auto',
          paddingRight: '20px',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap flex-shrink-0 active:scale-95"
            style={{
              background: activeCategory === cat ? accent : isDark ? '#1e293b' : '#c8e4ff',
              color: activeCategory === cat ? '#fff' : text,
              transition: 'background 0.15s',
              // Make tap targets finger-friendly
              minHeight: '32px',
              minWidth: '44px',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="p-3">
        <div
          className="flex gap-2 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            // Extra horizontal padding so first/last cards don't hug the screen edge
            paddingLeft: '2px',
            paddingRight: '8px',
          }}
        >
          {filteredResources.map((item) => (
            <TouchResourceCard
              key={item.id}
              item={item}
              onTouchDrop={handleTouchDrop}
              card={card}
              border={cardBorder}
              text={text}
              isDark={isDark}
              accent={accent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
