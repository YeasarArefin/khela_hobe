import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  Cast,
  Check,
  RectangleHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Level = { height: number; index: number };

type Props = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hlsRef: React.MutableRefObject<any>;
  levels: Level[];
  currentLevel: number;
  onSelectLevel: (idx: number) => void;
  channel: { name: string; logo: string };
  streamUrl: string;
  theatre: boolean;
  setTheatre: (v: boolean) => void;
};

export function PlayerControls({
  containerRef,
  videoRef,
  levels,
  currentLevel,
  onSelectLevel,
  channel,
  streamUrl,
  theatre,
  setTheatre,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [visible, setVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showVol, setShowVol] = useState(false);
  const [pip, setPip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [castReady, setCastReady] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const hideT = useRef<ReturnType<typeof setTimeout> | null>(null);

  const kick = () => {
    setVisible(true);
    if (hideT.current) clearTimeout(hideT.current);
    hideT.current = setTimeout(() => setVisible(false), 3000);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = () => kick();
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchstart", onMove);
    kick();
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchstart", onMove);
      if (hideT.current) clearTimeout(hideT.current);
    };
  }, [containerRef]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = () => setPlaying(true);
    const pause = () => setPlaying(false);
    v.addEventListener("play", play);
    v.addEventListener("pause", pause);
    return () => {
      v.removeEventListener("play", play);
      v.removeEventListener("pause", pause);
    };
  }, [videoRef]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setMuted(v.muted);
    setVolume(Math.round(v.volume * 100));

    const onVolumeChange = () => {
      setMuted(v.muted);
      setVolume(Math.round(v.volume * 100));
    };
    v.addEventListener("volumechange", onVolumeChange);
    return () => {
      v.removeEventListener("volumechange", onVolumeChange);
    };
  }, [videoRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (fullscreen) {
      // Force the container to cover the whole viewport when fullscreen
      el.style.position = "fixed";
      el.style.top = "0";
      el.style.left = "0";
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.zIndex = "9999";
      el.style.borderRadius = "0";
    } else {
      // Reset to original styles (allow CSS classes to apply again)
      el.style.position = "";
      el.style.top = "";
      el.style.left = "";
      el.style.width = "";
      el.style.height = "";
      el.style.zIndex = "";
      el.style.borderRadius = "";
    }
  }, [fullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      const isFullscreen =
        !!document.fullscreenElement ||
        // @ts-ignore
        !!(document as any).webkitFullscreenElement ||
        // @ts-ignore
        !!(document as any).mozFullScreenElement ||
        // @ts-ignore
        !!(document as any).msFullscreenElement;
      setFullscreen(isFullscreen);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    document.addEventListener("mozfullscreenchange", onFsChange);
    document.addEventListener("MSFullscreenChange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      document.removeEventListener("mozfullscreenchange", onFsChange);
      document.removeEventListener("MSFullscreenChange", onFsChange);
    };
  }, []);


  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnter = () => setPip(true);
    const onLeave = () => setPip(false);
    v.addEventListener("enterpictureinpicture", onEnter);
    v.addEventListener("leavepictureinpicture", onLeave);
    return () => {
      v.removeEventListener("enterpictureinpicture", onEnter);
      v.removeEventListener("leavepictureinpicture", onLeave);
    };
  }, [videoRef]);

  // Load Google Cast SDK and initialise with Default Media Receiver
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;

    const init = () => {
      try {
        w.cast.framework.CastContext.getInstance().setOptions({
          receiverApplicationId: w.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: w.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        });
        setCastReady(true);
      } catch {}
    };

    if (w.cast?.framework) {
      init();
      return;
    }

    w.__onGCastApiAvailable = (isAvailable: boolean) => {
      if (isAvailable) init();
    };

    if (!document.querySelector('script[src*="cast_sender"]')) {
      const s = document.createElement("script");
      s.src = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
      document.head.appendChild(s);
    }
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const onVolume = (val: number[]) => {
    const v = videoRef.current;
    if (!v) return;
    const nv = val[0];
    v.volume = nv / 100;
    v.muted = nv === 0;
    setVolume(nv);
    setMuted(nv === 0);
  };
  const toggleFs = () => {
    // Use the container element for fullscreen so custom controls stay visible
    const target = containerRef.current;
    if (!target) return;

    const isiOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const requestFs = (el: any) => {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    };
    const exitFs = () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    };

    const isFs =
      !!document.fullscreenElement ||
      // @ts-ignore
      !!(document as any).webkitFullscreenElement ||
      // @ts-ignore
      !!(document as any).mozFullScreenElement ||
      // @ts-ignore
      !!(document as any).msFullscreenElement;

    if (!isFs) {
      if (isiOS && videoRef.current?.webkitEnterFullscreen) {
        // iOS Safari only supports fullscreen on the video element
        videoRef.current?.webkitEnterFullscreen();
      } else {
        requestFs(target);
      }
    } else {
      exitFs();
    }
  };
  const togglePip = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch {}
  };
  const doCast = async () => {
    const w = window as any;

    // ── Google Cast SDK path (Chrome with Chromecast) ──────────────
    if (castReady && w.cast?.framework) {
      const castContext = w.cast.framework.CastContext.getInstance();
      try {
        await castContext.requestSession();
      } catch (err: any) {
        // "cancel" means user closed the picker — show nothing
        if (err === "cancel" || err?.code === "CANCEL" || err?.errorCode === "cancel") return;
        toast("No Cast devices found nearby. Make sure your Chromecast is on the same Wi-Fi.", {
          duration: 4000,
        });
        return;
      }
      // Session open — load the stream URL
      const session = castContext.getCurrentSession();
      if (session && streamUrl) {
        try {
          const mediaInfo = new w.chrome.cast.media.MediaInfo(streamUrl, "application/x-mpegURL");
          mediaInfo.streamType = w.chrome.cast.media.StreamType.LIVE;
          const request = new w.chrome.cast.media.LoadRequest(mediaInfo);
          await session.loadMedia(request);
          toast.success("Casting to Chromecast ✓", { duration: 3000 });
        } catch {
          toast.error("Failed to load stream on the Cast device.");
        }
      }
      return;
    }

    // ── SDK not ready yet — give feedback ─────────────────────────
    if (!castReady) {
      // Copy stream URL as a useful fallback for non-Chrome browsers
      if (streamUrl) {
        try {
          await navigator.clipboard.writeText(streamUrl);
          toast.success("Stream URL copied! Paste it in any Cast-enabled app (e.g. VLC, Kodi).", {
            duration: 5000,
          });
        } catch {
          toast("Casting requires Chrome browser. Open this page in Chrome to use Cast.", {
            duration: 5000,
          });
        }
      }
    }
  };

  const activeLevelLabel =
    currentLevel === -1
      ? "Auto"
      : levels[currentLevel]?.height
        ? `${levels[currentLevel].height}p`
        : "Auto";

  const sortedLevels = [...levels].sort((a, b) => (b.height ?? 0) - (a.height ?? 0));
  const hasQualityOptions = levels.length > 1;

  return (
    <TooltipProvider delayDuration={200}>
      {/* Top bar */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent p-4 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <img src={channel.logo} alt="" className="h-8 w-8 rounded-md bg-white/10 object-contain" />
        <span className="truncate text-sm font-medium text-white">{channel.name}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white animate-pulse">
          ● LIVE
        </span>
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <IconBtn onClick={togglePlay} label={playing ? "Pause" : "Play"}>
            {playing ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white" />
            )}
          </IconBtn>

          {/* Volume */}
          <div
            className="flex items-center gap-2"
            onMouseEnter={() => setShowVol(true)}
            onMouseLeave={() => setShowVol(false)}
          >
            <IconBtn onClick={toggleMute} label={muted ? "Unmute" : "Mute"}>
              {muted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </IconBtn>
            <div
              className={`hidden overflow-hidden transition-all duration-300 sm:block ${showVol ? "w-20 opacity-100" : "w-0 opacity-0"}`}
            >
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={muted ? 0 : volume}
                onChange={(e) => onVolume([Number(e.target.value)])}
                className="vol-slider w-20"
                style={{
                  background: `linear-gradient(to right, #fff ${muted ? 0 : volume}%, rgba(255,255,255,0.25) ${muted ? 0 : volume}%)`,
                }}
              />
            </div>
          </div>

          <span className="ml-1 text-sm font-medium text-red-400">● LIVE</span>

          <div className="flex-1" />

          {/* Quality */}
          {hasQualityOptions ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-md px-2 py-1 text-xs font-medium text-white hover:bg-white/10">
                  {activeLevelLabel}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                className="border-white/10 bg-black/95 backdrop-blur-xl"
                container={containerRef.current}
              >
                {sortedLevels.map((l) => (
                  <DropdownMenuItem
                    key={l.index}
                    onClick={() => onSelectLevel(l.index)}
                    className="cursor-pointer text-sm text-white focus:bg-white/10 focus:text-white"
                  >
                    <span className={currentLevel === l.index ? "font-semibold" : ""}>
                      {l.height}p
                    </span>
                    {currentLevel === l.index && <Check className="ml-auto h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => onSelectLevel(-1)}
                  className="cursor-pointer text-sm text-white focus:bg-white/10 focus:text-white"
                >
                  <span className={currentLevel === -1 ? "font-semibold" : ""}>Auto</span>
                  {currentLevel === -1 && <Check className="ml-auto h-3.5 w-3.5" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="rounded-md px-2 py-1 text-xs font-medium text-gray-300">Auto</span>
          )}

          {/* Theatre */}
          <div className="hidden sm:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <IconBtn onClick={() => setTheatre(!theatre)} label="Theatre">
                    {theatre ? (
                      <Minimize2 className="h-5 w-5" />
                    ) : (
                      <RectangleHorizontal className="h-5 w-5" />
                    )}
                  </IconBtn>
                </span>
              </TooltipTrigger>
              <TooltipContent container={containerRef.current}>
                {theatre ? "Exit Theatre" : "Theatre Mode"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* PiP */}
          {mounted && typeof document !== "undefined" && document.pictureInPictureEnabled && (
            <div className="hidden sm:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <IconBtn onClick={togglePip} label="Picture-in-Picture">
                      <PictureInPicture2 className="h-5 w-5" />
                    </IconBtn>
                  </span>
                </TooltipTrigger>
                <TooltipContent container={containerRef.current}>Picture-in-Picture</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Cast */}
          <div className="block">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <IconBtn onClick={doCast} label="Cast">
                    <Cast className="h-5 w-5" />
                  </IconBtn>
                </span>
              </TooltipTrigger>
              <TooltipContent container={containerRef.current}>Cast</TooltipContent>
            </Tooltip>
          </div>

          {/* Fullscreen */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <IconBtn onClick={toggleFs} label="Fullscreen">
                  {fullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </IconBtn>
              </span>
            </TooltipTrigger>
            <TooltipContent container={containerRef.current}>Fullscreen</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {pip && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/80 text-center">
          <div className="space-y-3">
            <p className="text-sm text-white">Playing in Picture-in-Picture</p>
            <button
              onClick={togglePip}
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
            >
              Return
            </button>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-lg text-white transition hover:bg-white/10"
    >
      {children}
    </button>
  );
}
