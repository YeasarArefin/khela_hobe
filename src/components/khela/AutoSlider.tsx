import { Link } from "@tanstack/react-router";
import { ChannelLogo } from "./ChannelLogo";

type Channel = {
  id: string;
  name: string;
  logo: string;
  category: string;
};

export function AutoSlider({
  channels,
  title,
  subtitle,
  speed = 40,
}: {
  channels: Channel[];
  title: string;
  subtitle?: string;
  speed?: number;
}) {
  if (!channels.length) return null;
  // Duplicate for seamless loop
  const loop = [...channels, ...channels];
  const duration = `${speed}s`;

  return (
    <section className="relative mx-auto mt-14 max-w-7xl px-4">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
        </div>
        <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 sm:block">
          Auto Playing
        </span>
      </div>

      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.04] via-transparent to-white/[0.04] py-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#080808] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#080808] to-transparent" />

        <div
          className="flex w-max gap-5 [animation:kh-marquee_var(--kh-mq-dur)_linear_infinite] group-hover:[animation-play-state:paused]"
          style={{ ["--kh-mq-dur" as any]: duration }}
        >
          {loop.map((c, i) => (
            <Link
              key={`${c.id}-${i}`}
              to="/player/$id"
              params={{ id: c.id }}
              className="group/card relative flex w-52 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-all hover:-translate-y-1 hover:border-white/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.10), transparent 70%)",
                  }}
                />
                <ChannelLogo
                  src={c.logo}
                  alt={c.name}
                  className="relative h-full w-full p-6 transition-transform duration-500 group-hover/card:scale-110"
                />
                <span className="absolute left-2 top-2 rounded-full bg-red-600/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  Live
                </span>
              </div>
              <div className="border-t border-white/5 bg-black/30 px-3 py-2">
                <div className="truncate text-xs font-semibold text-white">{c.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  {c.category}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
