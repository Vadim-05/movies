import type { ReactNode } from "react";
import { CinemaAtmosphere } from "../../../components/ui/cinema-atmosphere/CinemaAtmosphere";

interface AuthLayoutProps {
  badge: string;
  title: string;
  description: string;
  footer: string;
  titleId: string;
  children: ReactNode;
}

export function AuthLayout({
  badge,
  title,
  description,
  footer,
  titleId,
  children,
}: AuthLayoutProps) {
  return (
    <main className="
        relative isolate flex min-h-screen items-center justify-center 
        overflow-hidden bg-[#09090d] px-4 py-12 text-white sm:px-6
    ">
      <CinemaAtmosphere />

      <section
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="
            flex size-12 items-center justify-center rounded-2xl border 
            border-white/15 bg-gradient-to-br from-violet-500 to-indigo-600
            shadow-xl shadow-violet-950/50
        ">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-6"
            >
              <path
                d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
            </svg>
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Movie<span className="text-violet-400">App</span>
          </span>
        </div>

        <div className="
            relative overflow-hidden rounded-3xl border border-white/15 
            bg-[#0b0b18]/80 p-6 shadow-[0_25px_100px_-20px_rgba(0,0,0,0.8)] 
            backdrop-blur-2xl sm:p-9
        ">
          <div
            aria-hidden="true"
            className="
                pointer-events-none absolute inset-x-12 top-0 h-px 
                bg-gradient-to-r from-transparent via-violet-400/70 to-transparent
            "
          />

          <header className="mb-8 text-center">
            <span className="
                mb-3 inline-flex items-center rounded-full border 
                border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] 
                font-semibold uppercase tracking-[0.18em] text-violet-300
            ">
              {badge}
            </span>

            <h1
              id={titleId}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              {title}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
              {description}
            </p>
          </header>

          {children}
        </div>

        <p className="mt-6 text-center text-xs tracking-wide text-slate-500">
          {footer}
        </p>
      </section>
    </main>
  );
}