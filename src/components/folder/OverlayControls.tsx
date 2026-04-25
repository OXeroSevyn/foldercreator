import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { FONT_OPTIONS, type Overlay } from "@/lib/folder-types";

type Props = {
  overlay: Overlay;
  onChange: (patch: Partial<Overlay>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export function OverlayControls({ overlay, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: Props) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-secondary/40 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold capitalize">{overlay.kind} layer</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMoveDown} disabled={isFirst} title="Move Down">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMoveUp} disabled={isLast} title="Move Up">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete} aria-label="Delete layer">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {overlay.kind === "text" && (
        <>
          <div>
            <Label>Text</Label>
            <Input
              value={overlay.text}
              onChange={(e) => onChange({ text: e.target.value } as Partial<Overlay>)}
            />
          </div>
          <div>
            <Label>Font</Label>
            <Select value={overlay.font} onValueChange={(v) => onChange({ font: v } as Partial<Overlay>)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SliderRow label={`Size · ${overlay.size}px`} value={overlay.size} min={20} max={300}
            onChange={(v) => onChange({ size: v } as Partial<Overlay>)} />
          <SliderRow label={`Weight · ${overlay.weight}`} value={overlay.weight} min={400} max={800} step={100}
            onChange={(v) => onChange({ weight: v } as Partial<Overlay>)} />
          <ColorRow label="Color" value={overlay.color} onChange={(v) => onChange({ color: v } as Partial<Overlay>)} />
        </>
      )}

      {overlay.kind === "emoji" && (
        <>
          <div>
            <Label>Emoji</Label>
            <Input value={overlay.emoji}
              onChange={(e) => onChange({ emoji: e.target.value } as Partial<Overlay>)} />
          </div>
          <SliderRow label={`Size · ${overlay.size}px`} value={overlay.size} min={40} max={360}
            onChange={(v) => onChange({ size: v } as Partial<Overlay>)} />
        </>
      )}

      {overlay.kind === "image" && (
        <>
          <SliderRow label={`Size · ${Math.round(overlay.width * 100)}%`} value={Math.round(overlay.width * 100)} min={10} max={90}
            onChange={(v) => onChange({ width: v / 100 } as Partial<Overlay>)} />
          <div className="flex items-center justify-between">
            <Label>Tint white</Label>
            <Switch
              checked={!!overlay.tint}
              onCheckedChange={(c) => onChange({ tint: c ? "#ffffff" : null } as Partial<Overlay>)}
            />
          </div>
          {overlay.tint && (
            <ColorRow label="Tint color" value={overlay.tint}
              onChange={(v) => onChange({ tint: v } as Partial<Overlay>)} />
          )}
        </>
      )}

      <SliderRow label={`X · ${Math.round(overlay.x * 100)}%`} value={Math.round(overlay.x * 100)} min={5} max={95}
        onChange={(v) => onChange({ x: v / 100 })} />
      <SliderRow label={`Y · ${Math.round(overlay.y * 100)}%`} value={Math.round(overlay.y * 100)} min={20} max={95}
        onChange={(v) => onChange({ y: v / 100 })} />
      <SliderRow label={`Rotation · ${overlay.rotation}°`} value={overlay.rotation} min={-180} max={180}
        onChange={(v) => onChange({ rotation: v })} />
      <SliderRow label={`Opacity · ${Math.round(overlay.opacity * 100)}%`} value={Math.round(overlay.opacity * 100)} min={0} max={100}
        onChange={(v) => onChange({ opacity: v / 100 })} />
      <SliderRow label={`Blur · ${overlay.blur}px`} value={overlay.blur} min={0} max={20}
        onChange={(v) => onChange({ blur: v })} />
      <div className="flex items-center justify-between">
        <Label>Drop shadow</Label>
        <Switch checked={overlay.shadow} onCheckedChange={(c) => onChange({ shadow: c })} />
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label className="mb-2 block text-xs text-muted-foreground">{label}</Label>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="mb-2 block text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs" />
      </div>
    </div>
  );
}