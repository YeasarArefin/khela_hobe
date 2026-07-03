import { LayoutGrid, List } from "lucide-react";

export function ViewToggle({
  view,
  onChange,
}: {
  view: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
      {(["grid", "list"] as const).map((v) => {
        const Icon = v === "grid" ? LayoutGrid : List;
        const active = view === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            aria-label={v}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-all ${
              active
                ? "bg-white/10 text-white shadow-[0_0_16px_-4px_rgba(255,255,255,0.5)]"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
