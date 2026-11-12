interface OopsProps {
  message: string;
  title?: string;
}
  
export function Oops({
  message,
  title = "Oops, nothing found!",
}: OopsProps) {
    return (
      <section className="
        relative isolate flex min-h-[480px] items-center justify-center
        overflow-hidden rounded-3xl border border-white/[0.06] 
        bg-[#0b0d18] px-5 py-16 sm:px-10
      ">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="
            absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 
            rounded-full bg-indigo-600/[0.12] blur-[100px]
          " />
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-purple-600/[0.08] blur-[90px]" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-blue-500/[0.08] blur-[100px]" />
  
          <div className="
            absolute inset-0 opacity-[0.035] 
            [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),
            linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:40px_40px]
          " />
        </div>
  
        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="group relative mb-10">
            <div className="
              absolute inset-0 scale-150 rounded-full bg-indigo-500/20 
              blur-3xl transition-all duration-700 group-hover:bg-indigo-500/30
            " />
            <div className="
              relative flex h-36 w-36 items-center justify-center rounded-[2.5rem] 
              border border-white/10 bg-gradient-to-br from-white/[0.09] 
              to-white/[0.02] shadow-[0_20px_80px_rgba(79,70,229,0.15)] 
              backdrop-blur-xl sm:h-40 sm:w-40
            ">
              <div className="absolute inset-2 rounded-[2rem] border border-white/[0.05]" />
  
              <svg
                viewBox="0 0 100 100"
                fill="none"
                className="
                  relative h-20 w-20 text-indigo-300 transition-transform 
                  duration-500 group-hover:-rotate-6 group-hover:scale-110 
                  sm:h-24 sm:w-24
                "
                aria-hidden="true"
              >
                <rect
                  x="17"
                  y="15"
                  width="66"
                  height="70"
                  rx="12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  opacity=".8"
                />
                <path
                  d="M17 32H83M17 68H83"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity=".5"
                />
                <path
                  d="M27 15V32M42 15V32M58 15V32M73 15V32M27 68V85M42 68V85M58 68V85M73 68V85"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity=".5"
                />
                <path
                  d="M42 42L63 50L42 58V42Z"
                  fill="currentColor"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="31"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  opacity=".25"
                />
              </svg>
  
              <div className="
                absolute -right-3 -top-3 flex h-10 w-10 animate-bounce 
                items-center justify-center rounded-xl border 
                border-indigo-300/20 bg-[#17172c] text-indigo-300 
                shadow-lg shadow-indigo-500/20 [animation-duration:3s]
              ">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
  
              <div className="
                absolute -bottom-2 -left-3 h-7 w-7 rounded-lg 
                border border-purple-300/20 bg-[#20152f] 
                shadow-lg shadow-purple-500/20
              " />
            </div>
          </div>
  
          <div className="
            mb-4 inline-flex items-center gap-2 rounded-full 
            border border-indigo-400/20 bg-indigo-400/[0.07] px-4 py-1.5
          ">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Nothing to show
            </span>
          </div>
  
          <h2 className="
            max-w-lg bg-gradient-to-r from-white via-indigo-100 
            to-indigo-300 bg-clip-text text-3xl font-extrabold 
            tracking-tight text-transparent sm:text-4xl
          ">
            {title}
          </h2>
  
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            {message}
          </p>
  
          <div className="mt-9 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-400/50" />
            <div className="h-1.5 w-1.5 rotate-45 border border-indigo-400/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-indigo-400/50" />
          </div>
        </div>
      </section>
    );
  }