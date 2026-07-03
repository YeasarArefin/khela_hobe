import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";

export function Navbar(_props: { search: string; setSearch: (v: string) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-white to-gray-400 text-black">
            <Play className="h-4 w-4 fill-black" />
          </span>
          <span className="kh-gradient-text text-xl font-extrabold tracking-tight sm:text-2xl">
            Khela Hobe
          </span>
        </Link>
      </div>
    </header>
  );
}
