import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import mapboxgl from "mapbox-gl";
import { api } from "../lib/api.js";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

export function Dashboard() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: api.businesses.list,
  });

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [151.1836, -33.7969], // Chatswood
      zoom: 15,
    });
  }, []);

  useEffect(() => {
    if (!map.current || !businesses) return;
    businesses.forEach((business) => {
      new mapboxgl.Marker()
        .setLngLat(business.location.coordinates as [number, number])
        .setPopup(new mapboxgl.Popup().setText(business.name))
        .addTo(map.current!);
    });
  }, [businesses]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: 300, padding: 16, borderRight: "1px solid #eee", overflowY: "auto" }}>
        <h2>Businesses</h2>
        {businesses?.map((b) => (
          <div key={b.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <strong>{b.name}</strong>
            <div style={{ fontSize: 12, color: "#666" }}>{b.address}</div>
          </div>
        ))}
      </aside>
      <div ref={mapContainer} style={{ flex: 1 }} />
    </div>
  );
}
