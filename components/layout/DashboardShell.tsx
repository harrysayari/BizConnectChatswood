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
    <div className="flex min-h-dvh bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white shadow-sm md:flex"
        aria-label="Main navigation"
      >
        <SidebarBrand />
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <SidebarLinks onNavigate={() => setDrawerOpen(false)} />
        </nav>
        <div className="border-t border-slate-100 p-3 text-xs text-slate-500">
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
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        />
        <div
          className={`absolute left-0 top-0 flex h-full w-[min(100%,288px)] max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-200 ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <SidebarBrand compact />
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
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

      <div className="flex min-h-dvh flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:px-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 md:text-base">
              BizConnect · Chatswood
            </p>
            <p className="truncate text-xs text-slate-500 md:text-sm">
              Business intelligence &amp; spatial communications
            </p>
          </div>
          <span className="hidden rounded-full bg-council-100 px-3 py-1 text-xs font-medium text-council-800 sm:inline-flex">
            Willoughby LGA
          </span>
        </header>

        <main className="flex-1 px-4 pb-24 pt-4 sm:px-5 md:px-6 md:pb-8 md:pt-6">
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
      className={`flex items-center gap-2 ${compact ? "" : "border-b border-slate-100 px-5 py-4"}`}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-council-700 text-sm font-bold text-white"
        aria-hidden
      >
        W
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">
          Willoughby Council
        </p>
        {!compact && (
          <p className="truncate text-xs text-slate-500">Operations portal</p>
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
          className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          {item.label}
        </button>
      ))}
      <div className="my-2 border-t border-slate-100" />
      <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Soon
      </p>
      <p className="px-3 py-2 text-xs text-slate-500">
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
          if (found) setActive(found[0]);
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
      className="safe-pb fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 pt-1 backdrop-blur supports-[backdrop-filter]:bg-white/90 md:hidden"
      aria-label="Section navigation"
    >
      <div className="mx-auto flex max-w-lg justify-between gap-1">
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
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium leading-tight sm:text-xs ${
                isActive
                  ? "text-council-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span
                className={`rounded-md p-1.5 ${isActive ? "bg-council-100" : ""}`}
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
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
      className={active ? "text-council-700" : "text-slate-500"}
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
      className={active ? "text-council-700" : "text-slate-500"}
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
      className={active ? "text-council-700" : "text-slate-500"}
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
      className={active ? "text-council-700" : "text-slate-500"}
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
