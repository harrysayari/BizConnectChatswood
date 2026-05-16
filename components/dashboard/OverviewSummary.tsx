export function OverviewSummary() {
  return (
    <section
      id="section-overview"
      className="scroll-mt-28 md:scroll-mt-24"
      aria-labelledby="overview-heading"
    >
      <h2 id="overview-heading" className="sr-only">
        Dashboard overview
      </h2>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Coverage
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">Chatswood</p>
          <p className="mt-1 text-sm text-slate-600">
            CBD &amp; Victoria Ave corridor focus for prototype.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Data source
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">Places</p>
          <p className="mt-1 text-sm text-slate-600">
            Normalised to Google Places fields for import.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Alerts pipeline
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">Live-ready</p>
          <p className="mt-1 text-sm text-slate-600">
            Road closures, incidents, and events in one panel for targeting.
          </p>
        </div>
      </div>
    </section>
  );
}
