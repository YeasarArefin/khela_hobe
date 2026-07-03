import { Radio, Zap, Smartphone, Globe2, ShieldCheck, MonitorPlay } from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "24/7 Live Streams",
    desc: "Sports, news and entertainment — always live, never on delay.",
  },
  {
    icon: Zap,
    title: "Ultra-low Latency",
    desc: "HLS-tuned playback keeps you within seconds of the action.",
  },
  {
    icon: MonitorPlay,
    title: "HD Quality",
    desc: "Adaptive bitrate up to 1080p with quick manual overrides.",
  },
  {
    icon: Smartphone,
    title: "Any Screen",
    desc: "Fully responsive with PiP, cast and theatre mode.",
  },
  {
    icon: Globe2,
    title: "Global Access",
    desc: "Watch from anywhere without accounts or subscriptions.",
  },
  { icon: ShieldCheck, title: "No Ads, No Signup", desc: "One click to play. That's it." },
];

export function AboutSection({ channelCount }: { channelCount: number }) {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white/60 backdrop-blur-xl">
            About Khela Hobe
          </span>
          <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              The streaming home for the games you love.
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
            Khela Hobe is a next-generation OTT platform bringing live sports, world-class news and
            family entertainment together in a single, ad-free viewing experience. Built for the way
            you actually watch — fast, mobile-first, and beautifully simple.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { k: `${channelCount}+`, v: "Live channels" },
              { k: "1080p", v: "HD streams" },
              { k: "24/7", v: "Always on" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl"
              >
                <div className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-black text-transparent">
                  {s.k}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-white/50">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/25"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/10 text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-white">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
