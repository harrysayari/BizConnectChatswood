import type { BusinessPlaceRow } from "@/lib/mockBusinesses";

function WebsiteLink({ uri }: { uri: string }) {
  if (!uri) {
    return <span className="text-slate-400">—</span>;
  }
  const short = uri.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <a
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      className="text-council-700 underline decoration-council-300 underline-offset-2 hover:text-council-800"
    >
      <span className="break-all">{short}</span>
    </a>
  );
}

export function BusinessDirectory({ rows }: { rows: BusinessPlaceRow[] }) {
  return (
    <section
      id="section-businesses"
      className="scroll-mt-28 md:scroll-mt-24"
      aria-labelledby="businesses-heading"
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="businesses-heading"
            className="text-lg font-semibold text-slate-900 md:text-xl"
          >
            Chatswood business directory
          </h2>
          <p className="text-sm text-slate-500">
            Google Places–aligned fields: display name, phone, address, website.
          </p>
        </div>
        <p className="text-xs text-slate-400">{rows.length} records (sample)</p>
      </div>

      {/* Mobile + sm: cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((b) => (
          <li
            key={b.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft"
          >
            <p className="font-semibold text-slate-900">{b.displayName}</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Phone
                </dt>
                <dd>
                  <a
                    href={`tel:${b.nationalPhoneNumber.replace(/\s/g, "")}`}
                    className="font-medium text-slate-800 hover:text-council-700"
                  >
                    {b.nationalPhoneNumber}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Address
                </dt>
                <dd className="text-slate-700">{b.formattedAddress}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Website
                </dt>
                <dd className="break-words">
                  <WebsiteLink uri={b.websiteUri} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* md+: table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {b.displayName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <a
                      href={`tel:${b.nationalPhoneNumber.replace(/\s/g, "")}`}
                      className="hover:text-council-700"
                    >
                      {b.nationalPhoneNumber}
                    </a>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-700">
                    {b.formattedAddress}
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-slate-700">
                    <WebsiteLink uri={b.websiteUri} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
