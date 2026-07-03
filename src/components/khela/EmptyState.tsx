import { Tv } from "lucide-react";

export function EmptyState() {
  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
        <Tv className="h-7 w-7 text-white/70" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">No channels found</h3>
      <p className="mt-1 text-sm text-gray-400">Try a different search or category.</p>
    </div>
  );
}
