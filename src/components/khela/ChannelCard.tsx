import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { ChannelLogo } from "./ChannelLogo";

type Channel = {
  id: string;
  number?: number;
  name: string;
  logo: string;
  category: string;
  description: string;
};

export function ChannelCard({ channel, compact = false }: { channel: Channel; compact?: boolean }) {
  return (
    <Link
      to="/player/$id"
      params={{ id: channel.id }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_20px_60px_-20px_rgba(255,255,255,0.15)] ${
        compact ? "w-44 shrink-0" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.10), transparent 60%)",
        }}
      />
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.08), transparent 70%)",
          }}
        />
        <ChannelLogo
          src={channel.logo}
          alt={channel.name}
          className="relative h-full w-full p-6 transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
        </span>
        {channel.number != null && (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/90 backdrop-blur-sm">
            {String(channel.number).padStart(2, "0")}
          </span>
        )}
        <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 translate-x-[1px] fill-black" />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-white/5 bg-black/20 px-3.5 py-2.5">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold leading-tight text-white">
            {channel.name}
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            {channel.category}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ChannelRow({ channel }: { channel: Channel }) {
  return (
    <Link
      to="/player/$id"
      params={{ id: channel.id }}
      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/10">
        <ChannelLogo src={channel.logo} alt={channel.name} className="h-full w-full p-2" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {channel.number != null && (
            <span className="font-mono text-xs text-gray-500">
              #{String(channel.number).padStart(2, "0")}
            </span>
          )}
          <h3 className="truncate text-sm font-semibold text-white sm:text-base">{channel.name}</h3>
          <span className="hidden shrink-0 items-center gap-1 text-[10px] font-bold text-red-500 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            LIVE
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-400">
            {channel.category}
          </span>
          <p className="hidden truncate text-xs text-gray-500 sm:block">{channel.description}</p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-all group-hover:bg-white/20">
        <Play className="h-3.5 w-3.5 fill-white" /> Watch
      </span>
    </Link>
  );
}
