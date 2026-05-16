export type AlertSeverity = "info" | "warning" | "critical";

export type RoadClosure = {
  id: string;
  title: string;
  road: string;
  window: string;
  detail: string;
  severity: AlertSeverity;
};

export type TrafficAccident = {
  id: string;
  location: string;
  reportedAt: string;
  lanes: string;
  detail: string;
  severity: AlertSeverity;
};

export type UpcomingEvent = {
  id: string;
  name: string;
  date: string;
  area: string;
  detail: string;
};

export const mockRoadClosures: RoadClosure[] = [
  {
    id: "rc-1",
    title: "Scheduled utility works",
    road: "Victoria Ave (southbound, Anderson St → Archer St)",
    window: "Mon 9 Jun — Fri 13 Jun · Night works 8pm–5am",
    detail:
      "Single lane closure. Live Traffic–style feed placeholder for TfNSW / council integrations.",
    severity: "warning",
  },
  {
    id: "rc-2",
    title: "Festival precinct setup",
    road: "The Concourse forecourt & surrounding lanes",
    window: "Sat 21 Jun · 6am — 10pm",
    detail: "Full pedestrian priority; deliveries via Brown St only.",
    severity: "info",
  },
];

export const mockAccidents: TrafficAccident[] = [
  {
    id: "ac-1",
    location: "Pacific Hwy / Mowbray Rd intersection",
    reportedAt: "16 May 2026 · 07:42 AEDT",
    lanes: "Two city lanes blocked northbound",
    detail:
      "Placeholder incident card — connect to Live Traffic or equivalent API.",
    severity: "critical",
  },
  {
    id: "ac-2",
    location: "Archer St near Railway St",
    reportedAt: "16 May 2026 · 08:10 AEDT",
    lanes: "Emerge lane only — cleared expected",
    detail: "Tow on site; monitor for business access on laneways.",
    severity: "warning",
  },
];

export const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: "ev-1",
    name: "Chatswood Night Market (pilot)",
    date: "Fri 27 Jun 2026",
    area: "Victoria Ave & Concourse",
    detail: "Trader load-in from 3pm; public from 5pm.",
  },
  {
    id: "ev-2",
    name: "Youth music stage — school holidays",
    date: "Wed 9 Jul 2026",
    area: "Wisteria Walk",
    detail: "Noise management plan active; businesses notified via polygon alert.",
  },
];
