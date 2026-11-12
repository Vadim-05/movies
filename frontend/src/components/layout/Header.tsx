import { Link, useRouterState } from "@tanstack/react-router";

const navigation = [
  { label: "Home", to: "/" as const },
  { label: "Sign In", to: "/login" as const },
  { label: "Sign Up", to: "/register" as const },
];

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <header
      className="
        sticky top-0 z-50 border-b border-white/10
        bg-[#09090d]/85 shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        backdrop-blur-2xl
      "
    >
      <div
        className="
          mx-auto flex min-h-16 max-w-7xl items-center
          justify-between gap-2 px-3 py-3
          min-[375px]:gap-3 min-[375px]:px-4
          sm:min-h-20 sm:gap-6 sm:px-8 sm:py-4
        "
      >
        <Link
          to="/"
          search={{
            search: "",
            page: 1,
          }}
          aria-label="Movie App — на головну"
          className="
            group flex min-w-0 shrink items-center gap-2
            rounded-xl outline-none
            focus-visible:ring-2 focus-visible:ring-red-500
            min-[375px]:gap-2.5 sm:gap-3
          "
        >
          <span
            className="
              flex size-9 shrink-0 items-center justify-center
              rounded-xl bg-gradient-to-br from-red-500 to-rose-700
              text-white shadow-lg shadow-red-600/25
              transition duration-300
              group-hover:scale-105 group-hover:shadow-red-500/40
              min-[375px]:size-10 sm:size-12 sm:rounded-2xl
            "
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-5 sm:size-6"
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
              <path
                d="M7 3v3M12 3v3M17 3v3M7 18v3M12 18v3M17 18v3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="flex min-w-0 flex-col">
            <span className="whitespace-nowrap text-base font-extrabold tracking-tight text-white min-[375px]:text-lg sm:text-2xl">
              Movie <span className="font-medium text-gray-400">App</span>
            </span>

            <span
              className="
                mt-0.5 hidden text-[9px] font-semibold uppercase
                tracking-[0.24em] text-gray-500 sm:block
              "
            >
              Discover · Watch · Enjoy
            </span>
          </span>
        </Link>

        <nav
          aria-label="Основна навігація"
          className="
            flex shrink-0 items-center gap-0.5
            min-[375px]:gap-1 sm:gap-3
          "
        >
          {navigation.map(({ label, to }) => {
            const isActive =
              to === "/"
                ? pathname === "/"
                : pathname === to || pathname.startsWith(`${to}/`);

            return (
              <Link
                key={to}
                to={to}
                search={
                  to === "/"
                    ? {
                        search: "",
                        page: 1,
                      }
                    : undefined
                }
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative whitespace-nowrap rounded-lg px-2 py-2 text-[11px] font-medium transition duration-200",
                  "outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                  "min-[375px]:px-2.5 min-[375px]:text-xs",
                  "sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm",
                  isActive
                    ? "bg-red-500/10 text-red-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {label}

                {isActive && (
                  <span
                    className="
                      absolute inset-x-2 -bottom-3 h-0.5 rounded-full
                      bg-gradient-to-r from-red-500 to-rose-400
                      shadow-[0_0_12px_rgba(239,68,68,0.7)]
                      min-[375px]:inset-x-2.5
                      sm:inset-x-5 sm:-bottom-[1.05rem]
                    "
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}