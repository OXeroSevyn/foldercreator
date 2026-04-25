import { useMemo, useState } from "react";
import { LayoutGrid, Search, Sparkles, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FolderSVG } from "./FolderSVG";
import { TEMPLATES, TEMPLATE_CATEGORIES, type Template } from "@/lib/templates";
import type { FolderDesign } from "@/lib/folder-types";

type Props = {
  currentColor: string;
  onApply: (design: FolderDesign) => void;
};

export function TemplatesGallery({ currentColor, onApply }: Props) {
  const [cat, setCat] = useState<(typeof TEMPLATE_CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [appliedName, setAppliedName] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const inCat = cat === "All" || t.category === cat;
      const inQuery = t.name.toLowerCase().includes(query.toLowerCase());
      return inCat && inQuery;
    });
  }, [cat, query]);

  const apply = (t: Template) => {
    onApply(t.design);
    setAppliedName(t.name);
    setTimeout(() => setAppliedName(null), 1200);
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-hero)] shadow-[var(--shadow-elegant)]">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold leading-tight">Template Gallery</h3>
            <p className="text-xs text-muted-foreground">Click any preset to apply instantly</p>
          </div>
        </div>
        <div className="relative w-44 hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TEMPLATE_CATEGORIES.map((c) => {
          const active = cat === c;
          const count = c === "All" ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-elegant)]"
                  : "bg-secondary/60 text-foreground border-border hover:border-primary/40 hover:bg-secondary"
              }`}
            >
              <LayoutGrid className="h-3 w-3 opacity-70" />
              {c}
              <span className={`ml-1 rounded-full px-1.5 text-[10px] leading-4 ${active ? "bg-white/20" : "bg-foreground/5 text-muted-foreground"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((t) => {
          const isApplied = appliedName === t.name;
          return (
            <button
              key={t.name}
              onClick={() => apply(t)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[var(--shadow-soft)]"
            >
              {/* Color swatch backdrop */}
              <div
                className="absolute inset-x-0 top-0 h-20 opacity-30 group-hover:opacity-50 transition-opacity"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${t.design.baseColor}55, transparent 70%)`,
                }}
              />

              {/* Applied badge */}
              {isApplied && (
                <div className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 shadow-[var(--shadow-elegant)]">
                  <Check className="h-3 w-3" /> Applied
                </div>
              )}

              <div className="relative flex items-center justify-center py-2">
                <FolderSVG design={t.design} size={120} />
              </div>

              <div className="relative mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold truncate">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.category}</p>
                </div>
                <span
                  className="h-5 w-5 rounded-full ring-2 ring-background"
                  style={{ background: t.design.baseColor }}
                  aria-hidden
                />
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No templates match "{query}"
          </div>
        )}
      </div>

      {/* Footer hint */}
      <p className="mt-4 text-[11px] text-muted-foreground text-center">
        Current folder color:{" "}
        <span className="inline-flex items-center gap-1 font-mono">
          <span className="inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: currentColor }} />
          {currentColor}
        </span>
      </p>
    </section>
  );
}