const CATEGORIES = ["All", "Sports", "News", "Entertainment", "Music", "Kids", "Documentary"];

export function CategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
      {CATEGORIES.map((c) => {
        const isActive = active === c;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              isActive
                ? "border border-white/20 bg-gradient-to-r from-white/20 to-white/10 text-white shadow-[0_0_20px_-4px_rgba(255,255,255,0.4)]"
                : "border border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
