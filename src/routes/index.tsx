import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import channelsData from "@/data/channels.json";
import { Navbar } from "@/components/khela/Navbar";
import { HeroBanner } from "@/components/khela/HeroBanner";
import { SearchBar } from "@/components/khela/SearchBar";
import { CategoryFilter } from "@/components/khela/CategoryFilter";
import { ViewToggle } from "@/components/khela/ViewToggle";
import { ChannelCard, ChannelRow } from "@/components/khela/ChannelCard";
import { SkeletonCard } from "@/components/khela/SkeletonCard";
import { EmptyState } from "@/components/khela/EmptyState";
import { AutoSlider } from "@/components/khela/AutoSlider";
import { AboutSection } from "@/components/khela/AboutSection";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const channels = useMemo(
    () => [...channelsData].sort((a: any, b: any) => (a.number ?? 0) - (b.number ?? 0)),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return channels.filter((c: any) => {
      if (category !== "All" && c.category !== category) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [channels, search, category]);

  return (
    <div className="kh-fade-in relative min-h-screen overflow-hidden bg-[#080808] pb-safe text-white">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 kh-aurora" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.05] [animation:kh-grid-drift_20s_linear_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative">
        <Navbar search={search} setSearch={setSearch} />
        <HeroBanner channels={channels as any} />

        <AutoSlider
          channels={channels as any}
          title="Trending Now"
          subtitle="Most-watched live streams on Khela Hobe"
          speed={45}
        />

        <section className="mx-auto mt-16 max-w-7xl px-4">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                  Browse All Channels
                </span>
              </h2>
              <p className="mt-1 text-sm text-white/50">Search, filter and tune in — instantly.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar value={search} onChange={setSearch} />
            <div className="flex items-center gap-3">
              <div className="flex-1 sm:min-w-0">
                <CategoryFilter active={category} onChange={setCategory} />
              </div>
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState />
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filtered.map((c: any) => (
                  <ChannelCard key={c.id} channel={c} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((c: any) => (
                  <ChannelRow key={c.id} channel={c} />
                ))}
              </div>
            )}
          </div>
        </section>

        <AboutSection channelCount={channels.length} />

        <footer className="mx-auto mt-20 max-w-7xl px-4 pb-10">
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-6 backdrop-blur-xl sm:flex-row">
            <div>
              <div className="text-lg font-black tracking-tight">
                <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                  Khela Hobe
                </span>
              </div>
              <p className="mt-1 text-xs text-white/40">
                Premium live TV, reimagined for the modern web.
              </p>
            </div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/30">
              © {new Date().getFullYear()} · Streaming since always
            </p>
          </div>
        </footer>

        <Toaster theme="dark" />
      </div>
    </div>
  );
}
