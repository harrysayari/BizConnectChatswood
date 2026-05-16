export function OverviewSummary() {
  type SummaryCard = {
    kicker: string;
    title: string;
    body: string;
    accent: string;
    wide?: boolean;
  };

  const cards: SummaryCard[] = [
    {
      kicker: "Coverage",
      title: "Chatswood",
      body: "CBD & Victoria Ave corridor focus for prototype.",
      accent: "from-council-500 to-teal-500",
    },
    {
      kicker: "Data source",
      title: "Places",
      body: "Normalised to Google Places fields for import.",
      accent: "from-violet-500 to-council-500",
    },
    {
      kicker: "Alerts pipeline",
      title: "Live-ready",
      body: "Road closures, incidents, and events in one panel for targeting.",
      accent: "from-amber-500 to-orange-500",
      wide: true,
    },
  ];

  return (
    <section
      id="section-overview"
      className="scroll-mt-28 md:scroll-mt-24"
      aria-labelledby="overview-heading"
    >
      <h2 id="overview-heading" className="sr-only">
        Dashboard overview
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.kicker}
            className={`group relative ${c.wide ? "sm:col-span-2 lg:col-span-1" : ""}`}
          >
            <div
              className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${c.accent} opacity-70 blur-[1px] transition duration-300 group-hover:opacity-100`}
              aria-hidden
            />
            <div className="relative rounded-2xl border border-white/80 bg-white/90 p-5 shadow-elevate backdrop-blur-sm transition duration-300 group-hover:bg-white">
              <div
                className={`mb-4 h-1 w-12 rounded-full bg-gradient-to-r ${c.accent}`}
                aria-hidden
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {c.kicker}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {c.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {c.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
