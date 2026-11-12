import { Link } from "@tanstack/react-router";

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Sign In", to: "/login" },
  { label: "Sign Up", to: "/register" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#09090d]">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -top-32 left-1/2 h-64
          w-[32rem] -translate-x-1/2 rounded-full bg-red-600/10 blur-[100px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className="
            grid gap-10 py-12 sm:grid-cols-2 sm:py-16
            lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16
          "
        >
          <div>
            <Link
              to="/"
              search={{
                search: "",
                page: 1,
              }}
              aria-label="Movie App — на головну"
              className="
                group inline-flex items-center gap-3 rounded-xl
                outline-none focus-visible:ring-2 focus-visible:ring-red-500
              "
            >
              <span
                className="
                  flex size-11 items-center justify-center rounded-xl
                  bg-gradient-to-br from-red-500 to-rose-700 text-white
                  shadow-lg shadow-red-600/20 transition duration-300
                  group-hover:scale-105
                "
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-5"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path d="m10 8 6 4-6 4V8Z" fill="currentColor" />
                </svg>
              </span>

              <span className="text-xl font-extrabold tracking-tight text-white">
                Movie <span className="font-medium text-gray-400">App</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Your space for discovering movies. Find exciting films, 
              explore stories, and choose what to watch next.
            </p>

            <div
              className="
                mt-6 flex items-center gap-2 text-xs
                font-medium uppercase tracking-[0.18em] text-gray-500
              "
            >
              <span
                className="
                  size-1.5 rounded-full bg-red-500
                  shadow-[0_0_10px_rgba(239,68,68,0.8)]
                "
              />
              Discover · Watch · Enjoy
            </div>
          </div>

          <nav aria-label="Навігація у футері">
            <h2 className="text-sm font-semibold text-white">
              Navigation
            </h2>

            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="
                      inline-flex items-center text-sm text-gray-400
                      transition hover:translate-x-1 hover:text-red-400
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-red-500
                    "
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-semibold text-white">
              Movie Time?
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              Go back to the beginning and find something interesting to watch.
            </p>

            <a
              href="#top"
              className="
                mt-5 inline-flex items-center gap-2 rounded-xl border
                border-white/10 bg-white/[0.04] px-4 py-3 text-sm
                font-medium text-gray-200 transition hover:border-red-500/40
                hover:bg-red-500/10 hover:text-white focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-red-500
              "
            >
              Back to Home
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-4"
              >
                <path
                  d="M12 19V5m-7 7 7-7 7 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <div
          className="
            flex flex-col gap-3 border-t border-white/[0.08]
            py-6 text-xs text-gray-500 sm:flex-row
            sm:items-center sm:justify-between
          "
        >
          <p>© {currentYear} Movie App. All rights reserved.</p>

          <p className="flex items-center gap-2">
            Made for true movie lovers.
            <span aria-hidden="true" className="text-red-500">
              ♥
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
