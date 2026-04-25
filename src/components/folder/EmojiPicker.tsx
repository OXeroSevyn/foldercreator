import { Button } from "@/components/ui/button";

const EMOJIS = [
  "📁","📂","💼","🗂️","📦","📚","🎵","🎧","🎬","🎮","📸","🖼️","💻","⚙️","🛠️","🔒","🔑","⭐","❤️","🔥","✨","🌙","☀️","🌈","🌊","🌳","🍕","☕","🚀","🎯","🏆","💡","📝","📊","💰","🎨","🧠","👨‍💻","🐱","🐶",
];

export function EmojiPicker({ onPick }: { onPick: (e: string) => void }) {
  return (
    <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-secondary/40 p-2">
      {EMOJIS.map((e) => (
        <Button key={e} variant="ghost" size="icon" className="text-2xl h-10 w-10" onClick={() => onPick(e)}>
          {e}
        </Button>
      ))}
    </div>
  );
}