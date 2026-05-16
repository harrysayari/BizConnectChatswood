"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

/** Chatswood CBD — approximate centre for default map view */
const CHATSWOOD_DEFAULT = { lat: -33.7969, lng: 151.1811 };

export default function GoogleMapEmbed({ apiKey }: { apiKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    setOptions({ key: apiKey, v: "weekly" });

    Promise.all([
      importLibrary("maps"),
      importLibrary("marker"),
    ])
      .then(([{ Map }, { Marker }]) => {
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";

        const map = new Map(containerRef.current, {
          center: CHATSWOOD_DEFAULT,
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        new Marker({
          map,
          position: CHATSWOOD_DEFAULT,
          title: "Chatswood",
        });

        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Could not load Google Maps.";
          setLoadError(msg);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
  }, [apiKey]);

  if (loadError) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[13px] bg-gradient-to-br from-rose-50 to-rose-100/80 p-6 text-center text-sm text-rose-900 md:min-h-[320px]">
        <p className="font-medium">Google Maps failed to load</p>
        <p className="max-w-md text-rose-800/90">{loadError}</p>
        <p className="max-w-md text-xs text-rose-700/90">
          Confirm <strong>Maps JavaScript API</strong> is enabled, billing is
          active, and <code className="rounded bg-rose-100 px-1">localhost</code>{" "}
          is allowed on your API key (HTTP referrer restriction).
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] min-h-[220px] w-full sm:aspect-[16/9] sm:min-h-[280px] md:min-h-[320px]">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[13px] bg-gradient-to-br from-slate-100 to-slate-200/80 text-sm font-medium text-slate-500">
          Loading map…
        </div>
      )}
      <div
        ref={containerRef}
        className="absolute inset-0 rounded-[13px]"
        role="presentation"
      />
    </div>
  );
}
