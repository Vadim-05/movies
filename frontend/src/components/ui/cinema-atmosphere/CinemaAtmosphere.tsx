export function CinemaAtmosphere() {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-64 top-0 h-[500px] w-[500px] rounded-full bg-red-900/20 blur-[130px]" />
        <div className="absolute -right-64 top-[35%] h-[550px] w-[550px] rounded-full bg-purple-900/20 blur-[140px]" />
        <div className="absolute left-1/2 top-[30%] h-64 w-[90%] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[110px]" />
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="absolute h-[2px] w-[2px] animate-pulse rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            style={{
              left: `${(index * 43) % 100}%`,
              top: `${(index * 59) % 100}%`,
              animationDelay: `${(index % 7) * -1.2}s`,
              animationDuration: `${7 + (index % 6)}s`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090d]/70" />
      </div>
    );
  }