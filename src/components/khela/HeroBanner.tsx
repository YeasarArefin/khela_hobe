import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Radio, Sparkles } from "lucide-react";
import { ChannelLogo } from "./ChannelLogo";

type Channel = {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  featured?: boolean;
};

export function HeroBanner({ channels }: { channels: Channel[] }) {
  const featured = useMemo(() => {
    const flagged = channels.filter((c) => c.featured);
    return (flagged.length ? flagged : channels).slice(0, 5);
  }, [channels]);

  const [i, setI] = useState(0);

  useEffect(() => {
    if (featured.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [featured.length]);

  if (!featured.length) return null;
  const c = featured[i];

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-6">
      <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        {featured.map((f, idx) => (
          <img
            key={f.id}
            src={f.logo}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full scale-150 object-cover blur-3xl transition-opacity duration-1000 ${idx === i ? "opacity-60" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 20% 80%, rgba(255,255,255,0.12), transparent 60%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-end gap-6 p-5 sm:p-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
            <Sparkles className="h-3.5 w-3.5" /> Featured on Khela Hobe
          </div>

          <div key={c.id} className="kh-fade-in max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-300 backdrop-blur-md">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-red-500">
                <Radio className="h-2.5 w-2.5 text-white" />
              </span>
              Live · {c.category}
            </div>
            <h1 className="text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
                {c.name}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {c.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/player/$id"
                params={{ id: c.id }}
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.8)]"
              >
                <Play className="h-4 w-4 fill-black" /> Watch Live
              </Link>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-xl">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                  <ChannelLogo src={c.logo} alt={c.name} className="h-full w-full p-1" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-white">HD Stream</div>
                  <div className="text-white/50">Zero buffering · Free</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60"}`}
                />
              ))}
            </div>
            <div className="hidden gap-2 sm:flex">
              {featured.slice(0, 4).map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setI(idx)}
                  className={`relative h-14 w-14 overflow-hidden rounded-xl border transition-all ${idx === i ? "border-white scale-110" : "border-white/10 opacity-60 hover:opacity-100"}`}
                  aria-label={f.name}
                >
                  <div className="absolute inset-0 bg-white/10" />
                  <ChannelLogo src={f.logo} alt={f.name} className="relative h-full w-full p-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
