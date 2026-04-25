import { forwardRef, useId, useMemo, useRef, useState, useEffect } from "react";
import type { FolderDesign, Overlay } from "@/lib/folder-types";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  design: FolderDesign;
  size?: number;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onUpdateOverlay?: (id: string, patch: Partial<Overlay>) => void;
  interactive?: boolean;
  snapToGrid?: boolean;
};

// HSL helpers — derive folder palette from base color
function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hh = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hh = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hh = (b - r) / d + 2; break;
      case b: hh = (r - g) / d + 4; break;
    }
    hh *= 60;
  }
  return [hh, s * 100, l * 100];
}
const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;

export const FolderSVG = forwardRef<SVGSVGElement, Props>(function FolderSVG(
  { design, size = 512, selectedId, onSelect, onUpdateOverlay, interactive = false, snapToGrid = false },
  ref,
) {
  const [h, s] = useMemo(() => hexToHsl(design.baseColor), [design.baseColor]);
  const uid = useId().replace(/[:]/g, "");
  const gid = (n: string) => `${n}-${uid}`;
  const localSvgRef = useRef<SVGSVGElement | null>(null);
  
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, overlayX: 0, overlayY: 0 });

  const palette = {
    tabTop: hsl(h, Math.min(100, s), 68),
    tabBot: hsl(h, Math.min(100, s), 52),
    paper: "#ffffff",
    bodyTop: hsl(h, Math.min(100, s), 62),
    bodyMid: hsl(h, Math.min(100, s), 54),
    bodyBot: hsl(h, Math.min(100, s), 44),
    highlight: hsl(h, Math.min(100, s), 78),
    shadow: hsl(h, Math.min(100, s), 28),
  };

  const handleBg = (e: React.MouseEvent) => {
    if (!interactive) return;
    if (e.target === e.currentTarget) onSelect?.(null);
  };

  const startDrag = (e: React.MouseEvent, overlay: Overlay) => {
    if (!interactive) return;
    e.stopPropagation();
    onSelect?.(overlay.id);
    setDraggingId(overlay.id);
    setDragStart({ x: e.clientX, y: e.clientY, overlayX: overlay.x, overlayY: overlay.y });
  };

  useEffect(() => {
    if (!draggingId) return;

    const handleMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragStart.x) / 512;
      const dy = (e.clientY - dragStart.y) / 512;
      
      let nextX = Math.max(0, Math.min(1, dragStart.overlayX + dx));
      let nextY = Math.max(0, Math.min(1, dragStart.overlayY + dy));

      if (snapToGrid) {
        const gridSize = 0.025; // 2.5% steps
        nextX = Math.round(nextX / gridSize) * gridSize;
        nextY = Math.round(nextY / gridSize) * gridSize;
      }

      onUpdateOverlay?.(draggingId, { x: nextX, y: nextY });
    };

    const handleUp = () => setDraggingId(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [draggingId, dragStart, onUpdateOverlay]);

  return (
    <svg
      ref={(el) => {
        localSvgRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as any).current = el;
      }}
      viewBox="0 0 512 512"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleBg}
      style={{ display: "block", overflow: "visible" }}
      className="select-none"
    >
      <defs>
        <linearGradient id={gid("tabGrad")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.tabTop} />
          <stop offset="100%" stopColor={palette.tabBot} />
        </linearGradient>
        <linearGradient id={gid("bodyGrad")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.bodyTop} />
          <stop offset="55%" stopColor={palette.bodyMid} />
          <stop offset="100%" stopColor={palette.bodyBot} />
        </linearGradient>
        <linearGradient id={gid("bodyHighlight")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.highlight} stopOpacity="0.55" />
          <stop offset="40%" stopColor={palette.highlight} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={gid("bodyEdge")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.shadow} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.shadow} stopOpacity="0.35" />
        </linearGradient>
        <filter id={gid("dropShadow")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dx="0" dy="8" />
          <feComponentTransfer><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={gid("grain")}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>

      {design.style === "apple" ? (
        <>
          <path d="M52 130 Q52 110 72 110 L186 110 Q198 110 206 118 L222 134 Q230 142 242 142 L440 142 Q460 142 460 162 L460 200 L52 200 Z" fill={`url(#${gid("tabGrad")})`} />
          <rect x="78" y="178" width="356" height="36" rx="6" fill={palette.paper} opacity="0.95" />
          <path d="M40 210 Q40 188 62 188 L450 188 Q472 188 472 210 L472 420 Q472 448 444 448 L68 448 Q40 448 40 420 Z" fill={`url(#${gid("bodyGrad")})`} />
          <path d="M40 210 Q40 188 62 188 L450 188 Q472 188 472 210 L472 280 L40 280 Z" fill={`url(#${gid("bodyHighlight")})`} />
          <path d="M40 360 L472 360 L472 420 Q472 448 444 448 L68 448 Q40 448 40 420 Z" fill={`url(#${gid("bodyEdge")})`} />
        </>
      ) : (
        <>
          {/* Windows 11 style - more vertical and layered */}
          <rect x="60" y="110" width="392" height="300" rx="20" fill={`url(#${gid("tabGrad")})`} opacity="0.6" />
          <path d="M50 160 Q50 140 70 140 L442 140 Q462 140 462 160 L462 420 Q462 448 434 448 L78 448 Q50 448 50 420 Z" fill={`url(#${gid("bodyGrad")})`} />
          <rect x="70" y="155" width="372" height="4" rx="2" fill="white" opacity="0.3" />
          <path d="M50 160 Q50 140 70 140 L442 140 Q462 140 462 160 L462 240 L50 240 Z" fill={`url(#${gid("bodyHighlight")})`} />
        </>
      )}

      {design.texture === "grain" && (
        <rect x="0" y="0" width="512" height="512" filter={`url(#${gid("grain")})`} pointerEvents="none" />
      )}

      <AnimatePresence>
        {design.overlays.map((o) => (
          <OverlayNode
            key={o.id}
            overlay={o}
            selected={interactive && selectedId === o.id}
            onSelect={() => interactive && onSelect?.(o.id)}
            onMouseDown={(e) => startDrag(e, o)}
            interactive={interactive}
            shadowFilterId={gid("dropShadow")}
          />
        ))}
      </AnimatePresence>
    </svg>
  );
});

function OverlayNode({ overlay, selected, onSelect, onMouseDown, interactive, shadowFilterId }: any) {
  const cx = overlay.x * 512;
  const cy = overlay.y * 512;
  const filter = overlay.shadow ? `url(#${shadowFilterId})` : undefined;


  let content: React.ReactNode;
  if (overlay.kind === "text") {
    content = (
      <text textAnchor="middle" dominantBaseline="middle" fontFamily={overlay.font} fontSize={overlay.size} fontWeight={overlay.weight} fill={overlay.color} style={{ filter: overlay.blur ? `blur(${overlay.blur}px)` : undefined }}>
        {overlay.text}
      </text>
    );
  } else if (overlay.kind === "emoji") {
    content = (
      <text textAnchor="middle" dominantBaseline="central" fontSize={overlay.size} style={{ filter: overlay.blur ? `blur(${overlay.blur}px)` : undefined }}>
        {overlay.emoji}
      </text>
    );
  } else {
    const w = overlay.width * 512;
    content = (
      <g style={{ filter: overlay.blur ? `blur(${overlay.blur}px)` : undefined }}>
        <image href={overlay.src} x={-w / 2} y={-w / 2} width={w} height={w} preserveAspectRatio="xMidYMid meet" style={overlay.tint ? { filter: "grayscale(1) brightness(2)" } : undefined} />
        {overlay.tint && <rect x={-w / 2} y={-w / 2} width={w} height={w} fill={overlay.tint} style={{ mixBlendMode: "multiply" }} />}
      </g>
    );
  }

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8, x: cx, y: cy, rotate: overlay.rotation }}
      animate={{ opacity: overlay.opacity, scale: 1, x: cx, y: cy, rotate: overlay.rotation }}
      exit={{ opacity: 0, scale: 0.8 }}
      filter={filter}
      onMouseDown={onMouseDown}
      style={{ cursor: interactive ? "move" : "default" }}
    >
      {content}
      {selected && (
        <rect x={-130} y={-130} width={260} height={260} fill="none" stroke="hsl(var(--primary))" strokeWidth={3} strokeDasharray="8 6" opacity={0.8} />
      )}
    </motion.g>
  );
}