import { Search } from "lucide-react";

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
      <Search className="h-4 w-4 shrink-0 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search channels..."
        className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
      />
    </div>
  );
}
