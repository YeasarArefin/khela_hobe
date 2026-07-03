export function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="aspect-square bg-white/5" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-white/10" />
        <div className="h-2 w-1/2 rounded bg-white/5" />
      </div>
    </div>
  );
}
