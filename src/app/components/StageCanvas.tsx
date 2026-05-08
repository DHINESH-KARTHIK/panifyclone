import { useRef, useState, useCallback, useEffect } from 'react';
import { X, RotateCw, Maximize2, FlipHorizontal } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DroppedItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string | any;
  x: number;
  y: number;
}

export interface StageCanvasProps {
  droppedItems: DroppedItem[];
  onDrop: (item: any, position: { x: number; y: number }) => void;
  onRemoveItem: (id: string) => void;
  onMoveItem?: (id: string, x: number, y: number) => void;
  backgroundImage?: string;
  onSetBackground?: (imageUrl: string) => void;
  /** Forwarded so parent can hit-test pointer drops against the canvas */
  canvasRef?: React.RefObject<HTMLDivElement>;
}

// ─── DraggableItem ────────────────────────────────────────────────────────────
// Uses the Pointer Events API (works for both mouse and touch without any
// separate branch). All mutable gesture state lives in refs so callbacks never
// read stale closure values.

function DraggableItem({
  item,
  onRemove,
  onMove,
  canvasRef,
}: {
  item: DroppedItem;
  onRemove: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}) {
  const [isSelected, setIsSelected] = useState(false);

  // ── Visual transform state ─────────────────────────────────────────────────
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [pos, setPos] = useState({ x: item.x, y: item.y });

  // Keep refs in sync so gesture handlers never have stale values
  const posRef = useRef(pos);
  const scaleRef = useRef(scale);
  const rotRef = useRef(rotation);
  useEffect(() => { posRef.current = pos; }, [pos]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { rotRef.current = rotation; }, [rotation]);

  const containerRef = useRef<HTMLDivElement>(null);

  // ── Helper: clamp position inside canvas ───────────────────────────────────
  const clamp = useCallback((x: number, y: number) => {
    if (!canvasRef.current) return { x, y };
    const r = canvasRef.current.getBoundingClientRect();
    const halfW = 50; // half of item visual width (approx)
    const halfH = 50;
    return {
      x: Math.max(halfW, Math.min(r.width - halfW, x)),
      y: Math.max(halfH, Math.min(r.height - halfH, y)),
    };
  }, [canvasRef]);

  // ── Move gesture ──────────────────────────────────────────────────────────
  const handleMovePointerDown = useCallback((e: React.PointerEvent) => {
    // Only primary button / first touch
    if (e.button > 0) return;
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const startClient = { x: e.clientX, y: e.clientY };
    const startItem = { ...posRef.current };
    let moved = false;

    const onMove = (me: PointerEvent) => {
      const dx = me.clientX - startClient.x;
      const dy = me.clientY - startClient.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      if (!moved) return;
      const clamped = clamp(startItem.x + dx, startItem.y + dy);
      setPos(clamped);
      posRef.current = clamped;
    };

    const onUp = () => {
      if (!moved) {
        setIsSelected((s) => !s);
      } else {
        onMove_cb(item.id, posRef.current.x, posRef.current.y);
      }
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    // alias to avoid shadowing
    const onMove_cb = onMove as unknown as (id: string, x: number, y: number) => void;

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  }, [clamp, item.id]);

  // Fix: use separate callback refs to avoid naming conflict
  const handleMovePointerDownFn = useCallback((e: React.PointerEvent) => {
    if (e.button > 0) return;
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const startClient = { x: e.clientX, y: e.clientY };
    const startItem = { ...posRef.current };
    let moved = false;

    const onPointerMove = (me: PointerEvent) => {
      const dx = me.clientX - startClient.x;
      const dy = me.clientY - startClient.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      if (!moved) return;
      const clamped = clamp(startItem.x + dx, startItem.y + dy);
      setPos(clamped);
      posRef.current = clamped;
    };

    const onPointerUp = () => {
      if (!moved) {
        setIsSelected((s) => !s);
      } else {
        onMove(item.id, posRef.current.x, posRef.current.y);
      }
      window.removeEventListener('pointermove', onPointerMove);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  }, [clamp, item.id, onMove]);

  // ── Rotate gesture ────────────────────────────────────────────────────────
  const handleRotatePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startRot = rotRef.current;

    const onPointerMove = (me: PointerEvent) => {
      const delta = (me.clientX - startX) * 1.5;
      const newRot = startRot + delta;
      setRotation(newRot);
      rotRef.current = newRot;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', () => {
      window.removeEventListener('pointermove', onPointerMove);
    }, { once: true });
  }, []);

  // ── Resize gesture ────────────────────────────────────────────────────────
  // BUG FIX: previous code called moveEvent.touches[0] inside a listener that
  // was registered as a generic EventListener — on touchend, touches is empty.
  // Now we use Pointer Events so this is not an issue.
  const handleResizePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const startY = e.clientY;
    const startScale = scaleRef.current;

    const onPointerMove = (me: PointerEvent) => {
      // Drag UP = bigger, drag DOWN = smaller
      const deltaY = startY - me.clientY;
      const newScale = Math.max(0.25, Math.min(4, startScale + deltaY * 0.012));
      setScale(newScale);
      scaleRef.current = newScale;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', () => {
      window.removeEventListener('pointermove', onPointerMove);
    }, { once: true });
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handleMovePointerDownFn}
      className={`absolute select-none touch-none ${isSelected ? 'z-50' : 'z-10'}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${isFlipped ? -scale : scale}, ${scale})`,
        width: 'clamp(72px, 22vw, 130px)',
        cursor: 'grab',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        // GPU-composited layer for smooth 60fps movement
        willChange: 'transform, left, top',
      }}
    >
      {/* ── Control handles (only when selected) ─────────────────────── */}
      {isSelected && (
        <>
          {/* Rotate — top-centre */}
          <div
            onPointerDown={handleRotatePointerDown}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full touch-none"
            style={{
              width: 36, height: 36,
              backgroundColor: '#ffffff',
              border: '2px solid #c09cde',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              cursor: 'grab',
              touchAction: 'none',
              zIndex: 70,
            }}
          >
            <RotateCw style={{ width: 16, height: 16, color: '#c09cde' }} />
          </div>

          {/* Flip — left-centre */}
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsFlipped((f) => !f);
            }}
            className="absolute top-1/2 -left-11 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{
              width: 36, height: 36,
              backgroundColor: '#ffffff',
              border: '2px solid #3b82f6',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              cursor: 'pointer',
              touchAction: 'none',
              zIndex: 70,
            }}
          >
            <FlipHorizontal style={{ width: 16, height: 16, color: '#3b82f6' }} />
          </div>

          {/* Resize — bottom-right (drag up/down to scale) */}
          <div
            onPointerDown={handleResizePointerDown}
            className="absolute -bottom-4 -right-4 flex items-center justify-center rounded-full touch-none"
            style={{
              width: 40, height: 40, // Bigger for easier finger targeting
              backgroundColor: '#c09cde',
              border: '2px solid #ffffff',
              boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
              cursor: 'nwse-resize',
              touchAction: 'none',
              zIndex: 70,
            }}
          >
            <Maximize2 style={{ width: 18, height: 18, color: '#ffffff' }} />
          </div>

          {/* Delete — top-right */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
            style={{
              position: 'absolute', top: -12, right: -12,
              width: 28, height: 28,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.22)',
              cursor: 'pointer',
              zIndex: 80,
              touchAction: 'none',
            }}
          >
            <X style={{ width: 13, height: 13 }} />
          </button>
        </>
      )}

      {/* ── Image ───────────────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center">
        <img
          src={item.image}
          alt={item.name}
          draggable={false}
          className="w-full h-auto object-contain rounded-sm"
          style={isSelected ? { outline: '2px solid #c09cde', outlineOffset: '2px' } : {}}
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/></svg>';
          }}
        />
      </div>

      {/* ── Label ───────────────────────────────────────────────────────── */}
      {isSelected && scale > 0.5 && (
        <div
          className="mt-1 px-1.5 py-0.5 text-center rounded"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid #c09cde' }}
        >
          <div className="font-semibold text-[10px] line-clamp-1" style={{ color: '#c09cde' }}>
            {item.name}
          </div>
          {item.price > 0 && (
            <div className="text-[10px] font-black" style={{ color: '#c09cde' }}>
              ₹{item.price.toLocaleString('en-IN')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── StageCanvas ──────────────────────────────────────────────────────────────

export function StageCanvas({
  droppedItems,
  onDrop,
  onRemoveItem,
  onMoveItem,
  backgroundImage,
  onSetBackground,
  canvasRef: externalCanvasRef,
}: StageCanvasProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const canvasRef = externalCanvasRef ?? internalRef;

  const [isOver, setIsOver] = useState(false);

  // ── Pointer-based drop target (no react-dnd needed for touch) ─────────────
  // react-dnd HTML5Backend does work for mouse — we keep it for mouse-desktop
  // and handle touch separately via the ghost drag in ResourceRibbon.

  // We expose the canvas rect so DesignStudio can resolve pointer-drop coords
  // (see DesignStudio handlePointerDrop).

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Stage label */}
      <div
        className="text-xs px-4 py-1.5 rounded-full font-semibold"
        style={{
          backgroundColor: 'rgba(255,255,255,0.92)',
          color: '#c09cde',
          border: '1px solid #c09cde',
        }}
      >
        <span className="font-black">Stage Area:</span> 10m × 10m
      </div>

      {/* Canvas */}
      <div
        ref={(node) => {
          (internalRef as any).current = node;
          if (externalCanvasRef) (externalCanvasRef as any).current = node;
        }}
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
          try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const rect = canvasRef.current!.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (data.isBackground && onSetBackground) {
              onSetBackground(data.image);
            } else {
              onDrop(data, { x, y });
            }
          } catch { /* ignore */ }
        }}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '4/3',
          maxWidth: 900,
          margin: '0 auto',
          borderRadius: 20,
          touchAction: 'none',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 50px -12px rgba(0,0,0,0.22)',
          outline: isOver ? '3px solid #c09cde' : '1px solid rgba(192,156,222,0.4)',
          transition: 'outline 0.12s',
        }}
      >
        {/* Background */}
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
            style={{ zIndex: 0, opacity: 0.92 }}
          />
        ) : (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              opacity: 0.08,
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1.5\' cy=\'1.5\' r=\'1.5\' fill=\'%23c09cde\'/%3E%3C/svg%3E")',
              backgroundSize: '30px 30px',
            }}
          />
        )}

        {/* Items layer */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {droppedItems.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
              onMove={onMoveItem ?? (() => {})}
              canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
            />
          ))}

          {droppedItems.length === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ color: '#c09cde' }}
            >
              <div className="text-center opacity-30">
                <Maximize2 className="w-10 h-10 mx-auto mb-2" />
                <p className="text-base font-light">Drag items onto the stage</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
