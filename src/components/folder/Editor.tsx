import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Layers, ChevronUp, ChevronDown, Check, Folder, LayoutGrid, MousePointer2, Type, Image as ImageIcon, Smile, Download, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { FolderSVG } from "./FolderSVG";
import { OverlayControls } from "./OverlayControls";
import { EmojiPicker } from "./EmojiPicker";
import { TemplatesGallery } from "./TemplatesGallery";
import { DEFAULT_DESIGN, type FolderDesign, type Overlay } from "@/lib/folder-types";
import { exportPNG, exportSVG, exportICO, exportICNS, exportJPG, exportWebP, exportBatchPNGs } from "@/lib/exporter";
import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";

const PRESET_COLORS = ["#1f9bff","#22c55e","#ef4444","#f59e0b","#ff5b8a","#b347ff","#1e293b","#64748b","#06b6d4","#84cc16"];

export default function Editor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [design, setDesign] = useState<FolderDesign>(() => {
    const saved = localStorage.getItem("folder-design");
    return saved ? JSON.parse(saved) : DEFAULT_DESIGN;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState(() => localStorage.getItem("folder-name") || "my-folder");
  const [snapToGrid, setSnapToGrid] = useState(true);

  useEffect(() => {
    localStorage.setItem("folder-design", JSON.stringify(design));
    localStorage.setItem("folder-name", name);
  }, [design, name]);

  const selected = design.overlays.find((o) => o.id === selectedId);

  const update = (patch: Partial<FolderDesign>) => setDesign((d) => ({ ...d, ...patch }));

  const addOverlay = (o: Overlay) => {
    setDesign((d) => ({ ...d, overlays: [...d.overlays, o] }));
    setSelectedId(o.id);
  };

  const updateOverlay = (id: string, patch: Partial<Overlay>) => {
    setDesign((d) => ({
      ...d,
      overlays: d.overlays.map((o) => (o.id === id ? ({ ...o, ...patch } as Overlay) : o)),
    }));
  };

  const deleteOverlay = (id: string) => {
    setDesign((d) => ({ ...d, overlays: d.overlays.filter((o) => o.id !== id) }));
    setSelectedId(null);
  };

  const reorderOverlay = (id: string, direction: "up" | "down") => {
    setDesign((d) => {
      const idx = d.overlays.findIndex((o) => o.id === id);
      if (idx === -1) return d;
      const nextIdx = direction === "up" ? idx + 1 : idx - 1;
      if (nextIdx < 0 || nextIdx >= d.overlays.length) return d;
      const overlays = [...d.overlays];
      [overlays[idx], overlays[nextIdx]] = [overlays[nextIdx], overlays[idx]];
      return { ...d, overlays };
    });
  };

  const id = () => Math.random().toString(36).slice(2, 9);

  const addText = () =>
    addOverlay({
      id: id(), kind: "text", text: "Folder", font: "Inter", size: 72, color: "#ffffff", weight: 700,
      x: 0.5, y: 0.66, rotation: 0, opacity: 1, shadow: true, blur: 0,
    });

  const addEmoji = (e: string) =>
    addOverlay({
      id: id(), kind: "emoji", emoji: e, size: 180, x: 0.5, y: 0.62,
      rotation: 0, opacity: 1, shadow: true, blur: 0,
    });

  const onUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      addOverlay({
        id: id(), kind: "image", src: reader.result as string, width: 0.4, tint: null,
        x: 0.5, y: 0.62, rotation: 0, opacity: 1, shadow: true, blur: 0,
      });
    };
    reader.readAsDataURL(file);
  };

  const doExport = async (fn: () => Promise<void>, label: string) => {
    if (!svgRef.current) return;
    try {
      await fn();
      toast.success(`${label} exported`);
    } catch (e) {
      console.error(e);
      toast.error("Export failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-elegant)]"
            >
              <Folder className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">FolderCreator</h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Design custom folder icons</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/40">
              <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground">Snap</span>
              <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} className="scale-75" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[image:var(--gradient-glow)] pointer-events-none" />
        <div className="container relative py-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-[image:var(--gradient-hero)]"
          >
            Beautiful folder icons in seconds
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-muted-foreground max-w-xl mx-auto"
          >
            Apple-style folders. Add text, emoji, logos. Export ICO, ICNS, PNG, SVG and more.
          </motion.p>
        </div>
      </section>

      {/* Main */}
      <main className="container py-8 grid lg:grid-cols-[340px_1fr_360px] gap-6">
        {/* Left: layers + colors */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-4 shadow-[var(--shadow-soft)]">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Folder color</Label>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => update({ baseColor: c })}
                  aria-label={`Color ${c}`}
                  className={`h-9 w-full rounded-lg border-2 transition-transform hover:scale-105 ${design.baseColor === c ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="color"
                value={design.baseColor}
                onChange={(e) => update({ baseColor: e.target.value })}
                className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
              />
              <Input
                value={design.baseColor}
                onChange={(e) => update({ baseColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Style</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button
                    variant={design.style === "apple" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => update({ style: "apple" })}
                    className="h-8 text-xs"
                  >
                    Apple
                  </Button>
                  <Button
                    variant={design.style === "windows" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => update({ style: "windows" })}
                    className="h-8 text-xs"
                  >
                    Windows 11
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Grain Texture</Label>
                <Switch
                  checked={design.texture === "grain"}
                  onCheckedChange={(c) => update({ texture: c ? "grain" : "none" })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-4 shadow-[var(--shadow-soft)]">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Add layer</Label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button variant="secondary" size="sm" onClick={addText} className="flex-col h-16 gap-1">
                <Type className="h-4 w-4" /><span className="text-xs">Text</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm" className="flex-col h-16 gap-1">
                    <Smile className="h-4 w-4" /><span className="text-xs">Emoji</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2"><EmojiPicker onPick={addEmoji} /></PopoverContent>
              </Popover>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && onUploadImage(e.target.files[0])} />
                <div className="flex flex-col items-center justify-center h-16 gap-1 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                  <ImageIcon className="h-4 w-4" /><span className="text-xs">Image</span>
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-4 shadow-[var(--shadow-soft)]">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Layers</Label>
            <div className="mt-2 space-y-1">
              <AnimatePresence>
                {design.overlays.length === 0 && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground py-2"
                  >
                    No layers yet. Add text, emoji or an image above.
                  </motion.p>
                )}
                {design.overlays.map((o) => (
                  <motion.button
                    key={o.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 10, opacity: 0 }}
                    onClick={() => setSelectedId(o.id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${selectedId === o.id ? "bg-primary/15 text-primary" : "hover:bg-secondary"}`}
                  >
                    <span className="capitalize">{o.kind}</span>
                    <span className="text-muted-foreground ml-2 text-xs truncate">
                      {o.kind === "text" ? o.text : o.kind === "emoji" ? o.emoji : "image"}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* Center: preview */}
        <section className="flex flex-col items-center gap-6">
          <div className="relative w-full max-w-[560px] aspect-square rounded-3xl border border-border bg-[image:var(--gradient-surface)] p-8 shadow-[var(--shadow-soft)]">
            <div className="absolute inset-0 rounded-3xl bg-[image:var(--gradient-glow)] pointer-events-none" />
            <div className="relative w-full h-full filter drop-shadow-[0_30px_50px_hsl(var(--primary)/0.35)]">
              <FolderSVG
                ref={svgRef}
                design={design}
                size={512}
                interactive
                selectedId={selectedId}
                onSelect={setSelectedId}
                onUpdateOverlay={updateOverlay}
                snapToGrid={snapToGrid}
              />
            </div>
          </div>

          {/* Real-world Preview */}
          <div className="w-full rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-4 shadow-[var(--shadow-soft)]">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-4 block text-center">Live Preview (OS Scales)</Label>
            <div className="flex items-end justify-center gap-12 py-4">
              <div className="flex flex-col items-center gap-2">
                <div className="p-1 border border-border/50 rounded bg-white/50 dark:bg-black/20">
                  <FolderSVG design={design} size={64} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">64px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-1 border border-border/50 rounded bg-white/50 dark:bg-black/20">
                  <FolderSVG design={design} size={32} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">32px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-1 border border-border/50 rounded bg-white/50 dark:bg-black/20">
                  <FolderSVG design={design} size={16} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">16px</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right: properties + export */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-4 shadow-[var(--shadow-soft)]">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">File name</Label>
            <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value || "folder")} />

            <Label className="text-xs uppercase tracking-wider text-muted-foreground mt-4 block">Export</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full mt-2 bg-[image:var(--gradient-hero)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-elegant)]">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Icon formats</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => doExport(() => exportICO(svgRef.current!, name), "ICO")}>.ico (Windows)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => doExport(() => exportICNS(svgRef.current!, name), "ICNS")}>.icns (macOS)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => doExport(() => exportSVG(svgRef.current!, name), "SVG")}>.svg (vector)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Image formats</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => doExport(() => exportPNG(svgRef.current!, name, 1024), "PNG 1024")}>.png — 1024px</DropdownMenuItem>
                <DropdownMenuItem onClick={() => doExport(() => exportPNG(svgRef.current!, name, 512), "PNG 512")}>.png — 512px</DropdownMenuItem>
                <DropdownMenuItem onClick={() => doExport(() => exportJPG(svgRef.current!, name, 1024), "JPG")}>.jpg — 1024px</DropdownMenuItem>
                <DropdownMenuItem onClick={() => doExport(() => exportWebP(svgRef.current!, name, 1024), "WebP")}>.webp — 1024px</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => doExport(() => exportBatchPNGs(svgRef.current!, name), "Batch ZIP")}>
                  <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" /> All sizes (.zip)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs value={selected ? "props" : "info"} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="props" disabled={!selected}>Properties</TabsTrigger>
              <TabsTrigger value="info">Tips</TabsTrigger>
            </TabsList>
            <TabsContent value="props">
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <OverlayControls
                      overlay={selected}
                      onChange={(p) => updateOverlay(selected.id, p)}
                      onDelete={() => deleteOverlay(selected.id)}
                      onMoveUp={() => reorderOverlay(selected.id, "up")}
                      onMoveDown={() => reorderOverlay(selected.id, "down")}
                      isFirst={design.overlays.indexOf(selected) === 0}
                      isLast={design.overlays.indexOf(selected) === design.overlays.length - 1}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
            <TabsContent value="info">
              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground space-y-2">
                <p>• <strong className="text-foreground">Drag layers directly</strong> on the folder to position them.</p>
                <p>• Click a layer on the folder or in the list to edit it.</p>
                <p>• Use <strong className="text-foreground">All sizes (.zip)</strong> for a complete icon pack.</p>
                <p>• <strong className="text-foreground">.ico</strong> works on Windows · <strong className="text-foreground">.icns</strong> on macOS.</p>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </main>

      {/* Templates Gallery — full width */}
      <section className="border-t border-border/60 bg-[image:var(--gradient-surface)]">
        <div className="container py-10">
          <TemplatesGallery
            currentColor={design.baseColor}
            onApply={(d) => { setDesign(d); setSelectedId(null); }}
          />
        </div>
      </section>

      <footer className="border-t border-border/60 mt-10">
        <div className="container py-6 text-xs text-muted-foreground flex items-center justify-between">
          <span>FolderCreator — Crafted for designers & power users.</span>
          <span>Free · Runs in your browser · No upload</span>
        </div>
      </footer>
    </div>
  );
}