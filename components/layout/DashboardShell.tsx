"use client";

import { useCallback, useEffect, useState } from "react";

export const SECTION_IDS = {
  overview: "section-overview",
  businesses: "section-businesses",
  alerts: "section-alerts",
  map: "section-map",
} as const;

export type MobileTabId = keyof typeof SECTION_IDS;

export function useScrollToSection() {
  const scrollTo = useCallback((id: MobileTabId) => {
    const el = document.getElementById(SECTION_IDS[id]);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return { SECTION_IDS, scrollTo };
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setDrawerOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-dvh text-slate-900">
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col bg-gradient-sidebar shadow-sidebar md:flex"
        aria-label="Main navigation"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgb(56_189_248/0.15),transparent_50%)]" />
        <SidebarBrand />
        <nav className="relative flex flex-1 flex-col gap-1 p-3 pt-2">
          <SidebarLinks onNavigate={() => setDrawerOpen(false)} />
        </nav>
        <div className="relative z-10 border-t border-white/10 p-4 text-xs leading-relaxed text-slate-500">
          Willoughby Council · Staff dashboard
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        />
        <div
          className={`absolute left-0 top-0 flex h-full w-[min(100%,288px)] max-w-[85vw] flex-col bg-gradient-sidebar shadow-2xl transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <SidebarBrand compact />
            <button
              type="button"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            <SidebarLinks onNavigate={() => setDrawerOpen(false)} />
          </nav>
        </div>
      </div>

      <div className="flex min-h-dvh flex-1 flex-col md:pl-[272px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/70 bg-white/75 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur-xl md:px-8">
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-elevate transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold tracking-tight text-slate-900 md:text-lg">
              BizConnect · Chatswood
            </p>
            <p className="truncate text-xs text-slate-500 md:text-sm">
              Business intelligence &amp; spatial communications
            </p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-council-600 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-council-900/25 sm:inline-flex">
            <span
              className="h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_8px_rgb(255_255_255/0.8)]"
              aria-hidden
            />
            Willoughby LGA
          </span>
        </header>

        <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 md:px-8 md:pb-10 md:pt-8">
          {children}
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}

function SidebarBrand({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`relative z-10 flex items-center gap-3 ${compact ? "" : "border-b border-white/10 px-5 py-5"}`}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-council-400 via-council-600 to-teal-700 text-sm font-bold text-white shadow-lg shadow-black/30 ring-2 ring-white/15"
        aria-hidden
      >
        W
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight text-white">
          Willoughby Council
        </p>
        {!compact && (
          <p className="truncate text-xs text-slate-400">Operations portal</p>
        )}
      </div>
    </div>
  );
}

const navItems: { id: MobileTabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "businesses", label: "Businesses" },
  { id: "alerts", label: "Live & events" },
  { id: "map", label: "Map" },
];

function SidebarLinks({ onNavigate }: { onNavigate: () => void }) {
  const { scrollTo } = useScrollToSection();
  return (
    <>
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            scrollTo(item.id);
            onNavigate();
          }}
          className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
        >
          {item.label}
        </button>
      ))}
      <div className="my-3 border-t border-white/10" />
      <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        Soon
      </p>
      <p className="px-3 py-2 text-xs leading-relaxed text-slate-500">
        Polygon alerts, verification queue, WhatsApp handoff
      </p>
    </>
  );
}

function MobileBottomNav() {
  const { scrollTo } = useScrollToSection();
  const [active, setActive] = useState<MobileTabId>("overview");

  useEffect(() => {
    const ids: [MobileTabId, string][] = [
      ["overview", "section-overview"],
      ["businesses", "section-businesses"],
      ["alerts", "section-alerts"],
      ["map", "section-map"],
    ];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          const found = ids.find(([, sid]) => sid === visible.target.id);
          if (found)
            setActive((prev) => (prev === found[0] ? prev : found[0]));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    ids.forEach(([, sid]) => {
      const el = document.getElementById(sid);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <nav
      className="safe-pb fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-2 md:hidden"
      aria-label="Section navigation"
    >
      <div className="mx-auto flex max-w-lg justify-between gap-1 rounded-2xl border border-slate-200/90 bg-white/90 p-1.5 shadow-elevate backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActive(item.id);
                scrollTo(item.id);
              }}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold leading-tight transition sm:text-xs ${
                isActive
                  ? "text-council-800"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span
                className={`rounded-xl p-1.5 transition ${
                  isActive
                    ? "bg-gradient-to-br from-council-100 to-teal-50 text-council-800 shadow-inner shadow-council-900/10"
                    : ""
                }`}
              >
                {item.id === "overview" && <IconHome active={isActive} />}
                {item.id === "businesses" && (
                  <IconBuilding active={isActive} />
                )}
                {item.id === "alerts" && <IconBell active={isActive} />}
                {item.id === "map" && <IconMap active={isActive} />}
              </span>
              <span className="line-clamp-2 text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-current"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHome({ active }: { active?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={active ? "text-council-700" : "text-slate-400"}
    >
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-7H10v7H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBuilding({ active }: { active?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={active ? "text-council-700" : "text-slate-400"}
    >
      <path
        d="M9 21V5.5a1.5 1.5 0 011.5-1.5h8a1.5 1.5 0 011.5 1.5V21M9 21H4.5A1.5 1.5 0 013 19.5V11h6M9 21h6M7 11v3M17 11v2M14 15h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBell({ active }: { active?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={active ? "text-council-700" : "text-slate-400"}
    >
      <path
        d="M12 4a5 5 0 00-5 5v4l-2 3h14l-2-3V9a5 5 0 00-5-5zM9 20h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMap({ active }: { active?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={active ? "text-council-700" : "text-slate-400"}
    >
      <path
        d="M4 7.5L10 5l8 3 2-.75V18l-8 3-6-2.2L4 18V7.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 5v12.8M16 8v10"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}
