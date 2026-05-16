export function MapMockup() {
  return (
    <section
      id="section-map"
      className="scroll-mt-28 md:scroll-mt-24"
      aria-labelledby="map-heading"
    >
      <div className="mb-4">
        <h2
          id="map-heading"
          className="text-lg font-semibold text-slate-900 md:text-xl"
        >
          Spatial view (mockup)
        </h2>
        <p className="text-sm text-slate-500">
          Placeholder for Mapbox / PostGIS-backed map — polygon targeting
          coming next.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
        {/* Decorative "map" canvas */}
        <div className="relative aspect-[4/3] min-h-[220px] w-full sm:aspect-[16/9] sm:min-h-[280px] md:min-h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-br from-council-50 via-white to-slate-100" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(148 163 184 / 0.35) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(148 163 184 / 0.35) 1px, transparent 1px)
              `,
              backgroundSize: "28px 28px",
            }}
          />
          {/* "roads" */}
          <div className="absolute left-[8%] top-[18%] h-[3px] w-[70%] rotate-[8deg] rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200" />
          <div className="absolute left-[22%] top-[8%] h-[55%] w-[3px] -rotate-12 rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200" />
          <div className="absolute bottom-[22%] right-[12%] h-[3px] w-[48%] -rotate-[18deg] rounded-full bg-amber-100/90 shadow-sm ring-1 ring-amber-200" />

          {/* Chatswood pin cluster */}
          <div className="absolute left-[42%] top-[38%] flex flex-col items-center">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-council-600 text-white shadow-lg ring-4 ring-white/80">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="11" r="2" fill="currentColor" />
              </svg>
            </span>
            <span className="mt-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 sm:text-xs">
              Chatswood core
            </span>
          </div>

          <div className="absolute right-[18%] top-[22%] h-9 w-9 rounded-full bg-white/95 shadow-md ring-2 ring-council-200" />
          <div className="absolute bottom-[28%] left-[20%] h-8 w-8 rounded-full bg-white/95 shadow-md ring-2 ring-slate-200" />

          {/* Legend */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/90 px-3 py-2 text-[10px] shadow-sm ring-1 ring-slate-200 backdrop-blur sm:text-xs">
            <div className="flex flex-wrap items-center gap-3 text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-council-600" />
                Businesses
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Active works
              </span>
            </div>
            <span className="text-slate-400">Mockup · not georeferenced</span>
          </div>
        </div>
      </div>
    </section>
  );
}
