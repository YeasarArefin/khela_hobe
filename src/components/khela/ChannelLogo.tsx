import { useState } from "react";
import { Tv } from "lucide-react";

export function ChannelLogo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5 ${className}`}
      >
        <Tv className="h-1/2 w-1/2 text-white/70" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
