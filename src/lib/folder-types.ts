export type OverlayBase = {
  id: string;
  x: number; // 0-1 relative
  y: number;
  rotation: number;
  opacity: number;
  shadow: boolean;
  blur: number;
};

export type TextOverlay = OverlayBase & {
  kind: "text";
  text: string;
  font: string;
  size: number; // px at 512 base
  color: string;
  weight: number;
};

export type ImageOverlay = OverlayBase & {
  kind: "image";
  src: string;
  width: number; // 0-1 relative
  tint: string | null;
};

export type EmojiOverlay = OverlayBase & {
  kind: "emoji";
  emoji: string;
  size: number;
};

export type Overlay = TextOverlay | ImageOverlay | EmojiOverlay;

export type FolderDesign = {
  baseColor: string; // hue color hex for tint
  style: "apple" | "windows";
  texture: "none" | "grain";
  overlays: Overlay[];
};

export const DEFAULT_DESIGN: FolderDesign = {
  baseColor: "#1f9bff",
  style: "apple",
  texture: "none",
  overlays: [],
};

export const FONT_OPTIONS = [
  "Inter",
  "SF Pro Display",
  "Playfair Display",
  "Montserrat",
  "Bebas Neue",
  "Pacifico",
  "Caveat",
  "Lora",
  "Roboto Mono",
  "Press Start 2P",
];

export const EXPORT_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];