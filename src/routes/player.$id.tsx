import { ChannelCard, ChannelRow } from "@/components/khela/ChannelCard";
import { ChannelLogo } from "@/components/khela/ChannelLogo";
import { Navbar } from "@/components/khela/Navbar";
import { PlayerControls } from "@/components/khela/PlayerControls";
import { ViewToggle } from "@/components/khela/ViewToggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import channelsData from "@/data/channels.json";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/player/$id")({
  component: PlayerPage,
  head: ({ params }) => ({
    meta: [
      { title: `Watch – Khela Hobe` },
      { name: "description", content: `Live streaming on Khela Hobe (#${params.id}).` },
    ],
  }),
});

function PlayerPage() {
  const { id } = useParams({ from: "/player/$id" });
  const channel = useMemo(() => (channelsData as any[]).find((c) => c.id === id), [id]);
  const others = useMemo(
    () =>
      [...(channelsData as any[])]
        .filter((c) => c.id !== id)
        .sort((a, b) => (a.number ?? 0) - (b.number ?? 0)),
    [id],
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<any>(null);
  const [levels, setLevels] = useState<{ height: number; index: number; }[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [theatre, setTheatre] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState<"loading" | "playing" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);
  const [useProxy, setUseProxy] = useState(false);

  const shouldAutoProxy = useMemo(() => {
    if (!channel?.stream_url) return false;
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const hasCustomHeaders = channel.stream_url.includes("|");
    return hasCustomHeaders || (isHttps && channel.stream_url.startsWith("http://"));
  }, [channel]);

  const streamUrl = useMemo(() => {
    if (!channel?.stream_url) return "";
    const cleanUrl = channel.stream_url.split("|")[0];
    if (shouldAutoProxy || useProxy) {
      if (typeof window !== "undefined") {
        return `${window.location.origin}/api/proxy?url=${encodeURIComponent(channel.stream_url)}`;
      }
    }
    return cleanUrl;
  }, [channel, shouldAutoProxy, useProxy]);

  useEffect(() => {
    if (!channel || !streamUrl) return;
    let cancelled = false;
    const video = videoRef.current;
    if (!video) return;

    setStatus("loading");
    setErrorMsg("");

    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus((s) => (s === "error" ? s : "loading"));
    const onError = () => {
      setErrorMsg("Unable to play this stream. It may be offline or blocked.");
      setStatus("error");
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("error", onError);

    (async () => {
      const mod = await import("hls.js");
      if (cancelled) return;
      const Hls = mod.default;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        const playVideo = () => {
          video.play().catch((err) => {
            console.warn("Unmuted autoplay failed, trying muted autoplay:", err);
            video.muted = true;
            video.play().catch((e) => console.error("Muted autoplay also failed:", e));
          });
        };

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLevels(hls.levels.map((l: any, index: number) => ({ height: l.height, index })));
          playVideo();
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (_e: any, data: any) => setCurrentLevel(data.level));
        hls.on(Hls.Events.ERROR, (_e: any, data: any) => {
          if (data?.fatal) {
            setErrorMsg(
              data.type === "networkError"
                ? "Network error — the stream could not be reached."
                : data.type === "mediaError"
                  ? "Media error — the stream format is not supported."
                  : "Playback failed. Please try again.",
            );
            setStatus("error");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.play().catch((err) => {
          console.warn("Unmuted autoplay failed, trying muted autoplay:", err);
          video.muted = true;
          video.play().catch((e) => console.error("Muted autoplay also failed:", e));
        });
      } else {
        setErrorMsg("Your browser does not support HLS playback.");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("error", onError);
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch { }
        hlsRef.current = null;
      }
    };
  }, [channel, streamUrl, reloadKey]);

  const onSelectLevel = (idx: number) => {
    if (hlsRef.current) hlsRef.current.currentLevel = idx;
    setCurrentLevel(idx);
  };

  if (!channel) {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <Navbar search="" setSearch={() => { }} />
        <div className="mx-auto mt-20 max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-lg font-semibold">Channel not found</h1>
          <Link
            to="/"
            className="mt-4 inline-block text-sm text-gray-400 underline hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="kh-fade-in min-h-screen text-white bg-[#080808]">
      {!theatre && <Navbar search="" setSearch={() => { }} />}

      <div className="mx-auto max-w-7xl px-4 pt-4">
        {!theatre && (
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        )}

        <div
          ref={containerRef}
          className="relative aspect-video w-full overflow-hidden bg-black rounded-2xl border border-white/10"
        >
          <video ref={videoRef} className="h-full w-full" playsInline autoPlay />
          {status !== "playing" && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-md">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl">
                <ChannelLogo src={channel.logo} alt={channel.name} className="h-full w-full" />
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{channel.name}</div>
                <div className="text-xs uppercase tracking-widest text-gray-400">
                  {channel.category}
                </div>
              </div>
              {status === "loading" ? (
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading stream…
                </div>
              ) : (
                <div className="pointer-events-auto flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    {errorMsg || "Playback failed"}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setReloadKey((k) => k + 1)}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                    >
                      <RotateCcw className="h-4 w-4" /> Retry
                    </button>
                    {!useProxy && !shouldAutoProxy && (
                      <button
                        onClick={() => {
                          setUseProxy(true);
                          setReloadKey((k) => k + 1);
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                      >
                        Try Proxy Server
                      </button>
                    )}
                    {useProxy && (
                      <button
                        onClick={() => {
                          setUseProxy(false);
                          setReloadKey((k) => k + 1);
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                      >
                        Disable Proxy
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <PlayerControls
            containerRef={containerRef}
            videoRef={videoRef}
            hlsRef={hlsRef}
            levels={levels}
            currentLevel={currentLevel}
            onSelectLevel={onSelectLevel}
            channel={{ name: channel.name, logo: channel.logo }}
            streamUrl={streamUrl}
            theatre={theatre}
            setTheatre={setTheatre}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-6 flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/10">
            <ChannelLogo src={channel.logo} alt={channel.name} className="h-full w-full p-2" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-bold text-white">{channel.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="border-0 bg-white/10 text-white">
                {channel.category}
              </Badge>
              <Badge className="border-0 bg-red-600 text-white animate-pulse">● LIVE</Badge>
              {(shouldAutoProxy || useProxy) && (
                <Badge
                  variant="outline"
                  className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                >
                  ⚡ PROXY ACTIVE
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-400">{channel.description}</p>

        <Separator className="my-6 bg-white/10" />

        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="kh-gradient-text text-xl font-bold">More Channels</h3>
          <ViewToggle view={view} onChange={setView} />
        </div>
        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-4 pb-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {others.map((c: any) => (
              <ChannelCard key={c.id} channel={c} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-10">
            {others.map((c: any) => (
              <ChannelRow key={c.id} channel={c} />
            ))}
          </div>
        )}
      </div>

      <Toaster theme="dark" />
    </div>
  );
}
