import { useState, useRef, useCallback } from 'react';
import { ResourceRibbon } from './ResourceRibbon';
import type { ResourceItem } from './ResourceRibbon';
import { StageCanvas } from './StageCanvas';
import { IndianRupee, Share2, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { saveDesignToSupabase } from '../../lib/whatsapp';
import html2canvas from 'html2canvas';

interface DroppedItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string | any;
  x: number;
  y: number;
}

interface DesignStudioProps {
  initialPackage?: string | null;
  eventType?: string | null;
}

export function DesignStudio({ initialPackage, eventType }: DesignStudioProps) {
  const { isDark } = useTheme();
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [sharing, setSharing] = useState(false);

  // Shared canvas ref — used both by StageCanvas (for clamping) and by
  // handlePointerDrop (to translate client coords → canvas-relative coords)
  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const bg = isDark ? '#1a1025' : '#f0f7ff';
  const card = isDark ? '#231534' : '#ddeeff';
  const border = isDark ? 'rgba(192,156,222,0.2)' : 'rgba(42,125,212,0.18)';
  const text = isDark ? '#f0e6ff' : '#0d2d52';
  const textMuted = isDark ? 'rgba(240,230,255,0.6)' : '#3a6898';
  const purple = isDark ? '#c09cde' : '#2a7dd4';

  // ── Drop helpers ───────────────────────────────────────────────────────────

  const handleDrop = useCallback((item: any, position: { x: number; y: number }) => {
    const newItem: DroppedItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price ?? 0,
      category: item.category,
      image: item.image,
      x: position.x,
      y: position.y,
    };
    setDroppedItems((prev) => [...prev, newItem]);
    setTotalCost((prev) => prev + (item.price ?? 0));
  }, []);

  /** Called by ResourceRibbon when a touch-/pen-drag ends over the canvas */
  const handlePointerDrop = useCallback(
    (item: ResourceItem, clientX: number, clientY: number) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Ignore drops outside canvas
      if (
        clientX < rect.left || clientX > rect.right ||
        clientY < rect.top  || clientY > rect.bottom
      ) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (item.isBackground && item.image) {
        setBackgroundImage(typeof item.image === 'string' ? item.image : '');
      } else {
        handleDrop(item, { x, y });
      }
    },
    [handleDrop],
  );

  const removeItem = useCallback((id: string) => {
    setDroppedItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) setTotalCost((c) => c - found.price);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const moveItem = useCallback((id: string, x: number, y: number) => {
    setDroppedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item)),
    );
  }, []);

  // ── WhatsApp Share ─────────────────────────────────────────────────────────
  const handleWhatsAppShare = async () => {
    if (!droppedItems.length) return;
    setSharing(true);

    try {
      const itemList = droppedItems.map((i) => ({ name: i.name, quantity: 1 }));
      const canvasState = { items: droppedItems, background: backgroundImage };

      let designId = '';
      try {
        designId = await saveDesignToSupabase(eventType ?? 'Event', canvasState, itemList);
      } catch (e) {
        console.error('Supabase save failed', e);
      }

      let textMessage =
        `Hi, here is my custom stage design!\n\n*Event:* ${eventType ?? 'Event'}\n` +
        `*Total Cost:* ₹${totalCost.toLocaleString('en-IN')}\n\n*Items Included:*\n` +
        itemList.map((i) => `- ${i.name}`).join('\n');
      if (designId) textMessage += `\n\nDesign ID: ${designId}`;

      let imageFile: File | null = null;
      if (stageRef.current) {
        try {
          const canvas = await html2canvas(stageRef.current, {
            useCORS: true,
            backgroundColor: isDark ? '#1a1025' : '#f0f7ff',
            scale: 2,
          });
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/jpeg', 0.92),
          );
          if (blob) imageFile = new File([blob], 'stage-design.jpg', { type: 'image/jpeg' });
        } catch (captureErr: any) {
          console.error('Screenshot capture failed:', captureErr);
          alert('Failed to capture image: ' + (captureErr?.message || captureErr));
          return;
        }
      }

      if (!imageFile) return;

      if (navigator.canShare?.({ files: [imageFile], text: textMessage })) {
        try { await navigator.clipboard.writeText(textMessage); } catch (_) {}
        await navigator.share({ title: 'My Stage Design', text: textMessage, files: [imageFile] });
      } else if (navigator.canShare?.({ files: [imageFile] })) {
        try { await navigator.clipboard.writeText(textMessage); } catch (_) {}
        await navigator.share({ files: [imageFile] });
      } else {
        const url = URL.createObjectURL(imageFile);
        const a = document.createElement('a');
        a.href = url; a.download = 'planify-stage-design.jpg'; a.click();
        URL.revokeObjectURL(url);
        window.open(`https://wa.me/?text=${encodeURIComponent(textMessage)}`, '_blank');
        alert('📸 Image downloaded! Attach it to WhatsApp manually.');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
    } finally {
      setSharing(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col"
      style={{
        background: bg,
        color: text,
        height: '100dvh', // dvh handles mobile browser chrome correctly
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{
          background: isDark ? 'rgba(26,16,37,0.92)' : 'rgba(240,247,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${border}`,
          // Keep header away from iOS notch
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          paddingLeft: 'max(16px, env(safe-area-inset-left))',
          paddingRight: 'max(16px, env(safe-area-inset-right))',
        }}
      >
        <h1 className="text-lg font-black tracking-tight" style={{ color: text }}>
          Design Studio
        </h1>
        <p className="text-xs mt-0.5" style={{ color: textMuted }}>
          Drag items onto the stage
        </p>
      </div>

      {/* ── Floating top-right actions ── */}
      <div
        className="fixed z-20 flex flex-col gap-2"
        style={{
          top: 'calc(max(56px, env(safe-area-inset-top)) + 8px)',
          right: 'max(12px, env(safe-area-inset-right))',
        }}
      >
        {/* Cost badge */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg"
          style={{ background: card, border: `1px solid ${border}`, color: text }}
        >
          <IndianRupee className="w-4 h-4 flex-shrink-0" style={{ color: purple }} />
          <div>
            <div className="text-[10px] hidden sm:block" style={{ color: textMuted }}>Total</div>
            <div className="font-black text-sm">₹{totalCost.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Share */}
        <button
          onClick={handleWhatsAppShare}
          disabled={sharing || droppedItems.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold shadow-lg active:scale-95 disabled:opacity-40"
          style={{ background: '#25d366', color: '#fff', transition: 'transform 0.1s' }}
        >
          {sharing
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Share2 className="w-4 h-4" />
          }
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* ── Canvas area (scrollable if needed) ── */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 min-h-0" ref={stageRef}>
        <StageCanvas
          droppedItems={droppedItems}
          onDrop={handleDrop}
          onRemoveItem={removeItem}
          onMoveItem={moveItem}
          backgroundImage={backgroundImage}
          onSetBackground={setBackgroundImage}
          canvasRef={canvasRef}
        />
      </div>

      {/* ── Resource Ribbon ── */}
      <div className="flex-shrink-0">
        <ResourceRibbon onPointerDrop={handlePointerDrop} />
      </div>
    </div>
  );
}
