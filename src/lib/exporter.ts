import JSZip from "jszip";
import { EXPORT_SIZES } from "./folder-types";

function svgToString(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(clone);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function svgToCanvas(svg: SVGSVGElement, size: number, transparent = true): Promise<HTMLCanvasElement> {
  const str = svgToString(svg);
  const blob = new Blob([str], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    if (!transparent) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
    }
    ctx.drawImage(img, 0, 0, size, size);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), type, quality);
  });
}

export async function exportSVG(svg: SVGSVGElement, name: string) {
  const str = svgToString(svg);
  downloadBlob(new Blob([str], { type: "image/svg+xml" }), `${name}.svg`);
}

export async function exportPNG(svg: SVGSVGElement, name: string, size = 1024) {
  const c = await svgToCanvas(svg, size);
  downloadBlob(await canvasToBlob(c, "image/png"), `${name}-${size}.png`);
}

export async function exportJPG(svg: SVGSVGElement, name: string, size = 1024) {
  const c = await svgToCanvas(svg, size, false);
  downloadBlob(await canvasToBlob(c, "image/jpeg", 0.92), `${name}-${size}.jpg`);
}

export async function exportWebP(svg: SVGSVGElement, name: string, size = 1024) {
  const c = await svgToCanvas(svg, size);
  downloadBlob(await canvasToBlob(c, "image/webp", 0.95), `${name}-${size}.webp`);
}

// ---- ICO encoder (PNG-compressed entries, supports 16-256) ----
export async function exportICO(svg: SVGSVGElement, name: string, sizes = [16, 32, 48, 64, 128, 256]) {
  const pngs: { size: number; data: Uint8Array }[] = [];
  for (const sz of sizes) {
    const c = await svgToCanvas(svg, sz);
    const blob = await canvasToBlob(c, "image/png");
    pngs.push({ size: sz, data: new Uint8Array(await blob.arrayBuffer()) });
  }
  const headerSize = 6;
  const dirSize = 16;
  const totalDir = headerSize + dirSize * pngs.length;
  const totalLen = totalDir + pngs.reduce((a, p) => a + p.data.length, 0);
  const buf = new ArrayBuffer(totalLen);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true); // ICO type
  view.setUint16(4, pngs.length, true);
  let offset = totalDir;
  pngs.forEach((p, i) => {
    const o = headerSize + i * dirSize;
    view.setUint8(o, p.size === 256 ? 0 : p.size);
    view.setUint8(o + 1, p.size === 256 ? 0 : p.size);
    view.setUint8(o + 2, 0); // colors
    view.setUint8(o + 3, 0); // reserved
    view.setUint16(o + 4, 1, true); // planes
    view.setUint16(o + 6, 32, true); // bpp
    view.setUint32(o + 8, p.data.length, true);
    view.setUint32(o + 12, offset, true);
    u8.set(p.data, offset);
    offset += p.data.length;
  });
  downloadBlob(new Blob([buf], { type: "image/x-icon" }), `${name}.ico`);
}

// ---- ICNS encoder (subset, embeds PNGs) ----
const ICNS_TYPES: Record<number, string> = {
  16: "icp4",
  32: "icp5",
  64: "icp6",
  128: "ic07",
  256: "ic08",
  512: "ic09",
  1024: "ic10",
};
function strToBytes(s: string) {
  return new Uint8Array([s.charCodeAt(0), s.charCodeAt(1), s.charCodeAt(2), s.charCodeAt(3)]);
}
export async function exportICNS(svg: SVGSVGElement, name: string) {
  const sizes = [16, 32, 64, 128, 256, 512, 1024];
  const entries: Uint8Array[] = [];
  for (const sz of sizes) {
    const c = await svgToCanvas(svg, sz);
    const blob = await canvasToBlob(c, "image/png");
    const png = new Uint8Array(await blob.arrayBuffer());
    const type = ICNS_TYPES[sz];
    if (!type) continue;
    const len = png.length + 8;
    const entry = new Uint8Array(len);
    entry.set(strToBytes(type), 0);
    new DataView(entry.buffer).setUint32(4, len, false);
    entry.set(png, 8);
    entries.push(entry);
  }
  const total = 8 + entries.reduce((a, e) => a + e.length, 0);
  const out = new Uint8Array(total);
  out.set(strToBytes("icns"), 0);
  new DataView(out.buffer).setUint32(4, total, false);
  let off = 8;
  for (const e of entries) {
    out.set(e, off);
    off += e.length;
  }
  downloadBlob(new Blob([out], { type: "image/icns" }), `${name}.icns`);
}

export async function exportBatchPNGs(svg: SVGSVGElement, name: string) {
  const zip = new JSZip();
  const folder = zip.folder(name)!;
  for (const sz of EXPORT_SIZES) {
    const c = await svgToCanvas(svg, sz);
    const blob = await canvasToBlob(c, "image/png");
    folder.file(`${name}-${sz}x${sz}.png`, blob);
  }
  // include ico + svg + icns for convenience
  const out = await zip.generateAsync({ type: "blob" });
  downloadBlob(out, `${name}-icons.zip`);
}