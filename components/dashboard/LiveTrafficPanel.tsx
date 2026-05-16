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
    return "bg-rose-100 text-rose-800 ring-1 ring-rose-200";
  if (sev === "warning")
    return "bg-amber-100 text-amber-900 ring-1 ring-amber-200";
  return "bg-sky-100 text-sky-900 ring-1 ring-sky-200";
}

function ClosureCard({ c }: { c: RoadClosure }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{c.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles(c.severity)}`}
        >
          {c.severity}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-800">{c.road}</p>
      <p className="mt-1 text-xs text-slate-500">{c.window}</p>
      <p className="mt-2 text-sm text-slate-600">{c.detail}</p>
    </article>
  );
}

function AccidentCard({ a }: { a: TrafficAccident }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{a.location}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles(a.severity)}`}
        >
          {a.severity}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">{a.reportedAt}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{a.lanes}</p>
      <p className="mt-2 text-sm text-slate-600">{a.detail}</p>
    </article>
  );
}

function EventCard({ e }: { e: UpcomingEvent }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900">{e.name}</h3>
      <p className="mt-1 text-sm text-council-800">{e.date}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{e.area}</p>
      <p className="mt-2 text-sm text-slate-600">{e.detail}</p>
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
      <div className="mb-4">
        <h2
          id="alerts-heading"
          className="text-lg font-semibold text-slate-900 md:text-xl"
        >
          Live traffic &amp; precinct feed
        </h2>
        <p className="text-sm text-slate-500">
          Structured for TfNSW Live Traffic / event APIs — mock data for now.
        </p>
      </div>

      {/* Tabs: horizontal scroll on narrow screens */}
      <div
        className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
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
              className={`shrink-0 rounded-full px-4 py-2 text-left text-sm font-medium transition ${
                selected
                  ? "bg-council-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="block">{t.label}</span>
              <span
                className={`block text-xs font-normal ${selected ? "text-council-100" : "text-slate-500"}`}
              >
                {t.hint}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4"
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
