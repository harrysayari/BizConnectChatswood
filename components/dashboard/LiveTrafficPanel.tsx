"use client";

import { useState } from "react";
import type {
  RoadClosure,
  TrafficAccident,
  UpcomingEvent,
} from "@/lib/mockAlerts";

type Tab = "closures" | "accidents" | "events";

const tabs: { id: Tab; label: string; hint: string }[] = [
  { id: "closures", label: "Road closures", hint: "Works & detours" },
  { id: "accidents", label: "Accidents", hint: "Live Traffic–ready" },
  { id: "events", label: "Upcoming events", hint: "Festivals & precincts" },
];

function severityStyles(sev: string) {
  if (sev === "critical")
    return "bg-rose-500/15 text-rose-900 ring-1 ring-rose-300/40";
  if (sev === "warning")
    return "bg-amber-500/15 text-amber-950 ring-1 ring-amber-400/35";
  return "bg-sky-500/12 text-sky-950 ring-1 ring-sky-400/35";
}

function ClosureCard({ c }: { c: RoadClosure }) {
  return (
    <article className="rounded-xl border border-slate-100/90 bg-white/95 p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug text-slate-900">{c.title}</h3>
        <span
          className={`shrink-0 rounded-lg px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${severityStyles(c.severity)}`}
        >
          {c.severity}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-800">{c.road}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{c.window}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.detail}</p>
    </article>
  );
}

function AccidentCard({ a }: { a: TrafficAccident }) {
  return (
    <article className="rounded-xl border border-slate-100/90 bg-white/95 p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug text-slate-900">
          {a.location}
        </h3>
        <span
          className={`shrink-0 rounded-lg px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${severityStyles(a.severity)}`}
        >
          {a.severity}
        </span>
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">{a.reportedAt}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{a.lanes}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{a.detail}</p>
    </article>
  );
}

function EventCard({ e }: { e: UpcomingEvent }) {
  return (
    <article className="rounded-xl border border-slate-100/90 bg-white/95 p-4 shadow-sm transition hover:border-council-200/60 hover:shadow-md">
      <h3 className="font-semibold leading-snug text-slate-900">{e.name}</h3>
      <p className="mt-2 text-sm font-semibold text-council-800">{e.date}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{e.area}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{e.detail}</p>
    </article>
  );
}

export function LiveTrafficPanel(props: {
  closures: RoadClosure[];
  accidents: TrafficAccident[];
  events: UpcomingEvent[];
}) {
  const [tab, setTab] = useState<Tab>("closures");

  return (
    <section
      id="section-alerts"
      className="scroll-mt-28 md:scroll-mt-24"
      aria-labelledby="alerts-heading"
    >
      <div className="mb-6">
        <h2
          id="alerts-heading"
          className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl"
        >
          Live traffic &amp; precinct feed
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
          Structured for TfNSW Live Traffic / event APIs — mock data for now.
        </p>
      </div>

      <div
        className="mb-4 flex min-w-0 gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1.5 shadow-inner backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Alert categories"
      >
        {tabs.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t.id)}
              className={`min-w-0 flex-1 shrink-0 rounded-xl px-3 py-2.5 text-left transition sm:min-w-[unset] sm:flex-none sm:px-4 ${
                selected
                  ? "bg-white text-slate-900 shadow-md shadow-slate-900/10 ring-1 ring-slate-200/80"
                  : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
              }`}
            >
              <span className="block text-xs font-bold sm:text-sm">
                {t.label}
              </span>
              <span
                className={`mt-0.5 block text-[10px] font-medium sm:text-xs ${selected ? "text-slate-500" : "text-slate-400"}`}
              >
                {t.hint}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="rounded-2xl border border-white/80 bg-gradient-to-b from-white/80 to-slate-50/90 p-4 shadow-soft backdrop-blur-sm sm:p-5"
        role="tabpanel"
      >
        {tab === "closures" && (
          <ul className="flex flex-col gap-3">
            {props.closures.map((c) => (
              <li key={c.id}>
                <ClosureCard c={c} />
              </li>
            ))}
          </ul>
        )}
        {tab === "accidents" && (
          <ul className="flex flex-col gap-3">
            {props.accidents.map((a) => (
              <li key={a.id}>
                <AccidentCard a={a} />
              </li>
            ))}
          </ul>
        )}
        {tab === "events" && (
          <ul className="flex flex-col gap-3">
            {props.events.map((e) => (
              <li key={e.id}>
                <EventCard e={e} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
