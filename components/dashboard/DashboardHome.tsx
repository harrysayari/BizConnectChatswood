import { BusinessDirectory } from "@/components/dashboard/BusinessDirectory";
import { LiveTrafficPanel } from "@/components/dashboard/LiveTrafficPanel";
import { MapMockup } from "@/components/dashboard/MapMockup";
import { OverviewSummary } from "@/components/dashboard/OverviewSummary";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  mockAccidents,
  mockRoadClosures,
  mockUpcomingEvents,
} from "@/lib/mockAlerts";
import { mockBusinesses } from "@/lib/mockBusinesses";

export function DashboardHome() {
  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:gap-12">
        <OverviewSummary />

        {/* Desktop: map + alerts side by side below overview */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1 lg:min-w-0">
            <MapMockup />
          </div>
          <div className="flex-1 lg:max-w-xl xl:max-w-none">
            <LiveTrafficPanel
              closures={mockRoadClosures}
              accidents={mockAccidents}
              events={mockUpcomingEvents}
            />
          </div>
        </div>

        <BusinessDirectory rows={mockBusinesses} />
      </div>
    </DashboardShell>
  );
}
