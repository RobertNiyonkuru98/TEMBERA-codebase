import { Link } from "react-router-dom";

type GuestTopNavProps = {
  brandTitle: string;
};

function GuestTopNav({ brandTitle }: GuestTopNavProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-emerald-500 px-2 py-1 text-sm font-semibold text-slate-950">
            TEMBERA
          </span>
          <span className="hidden text-sm text-slate-300 sm:inline">{brandTitle}</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm sm:gap-4">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/itineraries"
            className="rounded-md px-3 py-1.5 text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            Explore Trips
          </Link>
          <Link
            to="/visitor/showcase"
            className="rounded-md border border-emerald-400/60 px-3 py-1.5 text-emerald-200 transition hover:bg-emerald-500 hover:text-slate-950"
          >
            Why Tembera
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default GuestTopNav;
