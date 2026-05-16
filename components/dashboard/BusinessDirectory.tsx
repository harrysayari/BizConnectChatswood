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
      className="font-medium text-council-700 underline decoration-council-300/80 underline-offset-2 transition hover:text-teal-700"
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
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="businesses-heading"
            className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl"
          >
            Chatswood business directory
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Google Places–aligned fields: display name, phone, address,
            website.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-slate-200/90 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm">
          {rows.length} records · sample
        </span>
      </div>

      <ul className="flex flex-col gap-4 md:hidden">
        {rows.map((b) => (
          <li
            key={b.id}
            className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-elevate backdrop-blur-sm transition hover:border-council-200/60 hover:shadow-lg"
          >
            <p className="text-base font-semibold text-slate-900">
              {b.displayName}
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Address
                </dt>
                <dd className="leading-relaxed text-slate-700">
                  {b.formattedAddress}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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

      <div className="hidden overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-elevate backdrop-blur-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200/80 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Business</th>
                <th className="px-5 py-4 font-semibold">Phone</th>
                <th className="px-5 py-4 font-semibold">Address</th>
                <th className="px-5 py-4 font-semibold">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90">
              {rows.map((b) => (
                <tr
                  key={b.id}
                  className="transition-colors hover:bg-council-50/40"
                >
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {b.displayName}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    <a
                      href={`tel:${b.nationalPhoneNumber.replace(/\s/g, "")}`}
                      className="font-medium hover:text-council-700"
                    >
                      {b.nationalPhoneNumber}
                    </a>
                  </td>
                  <td className="max-w-xs px-5 py-4 leading-relaxed text-slate-700">
                    {b.formattedAddress}
                  </td>
                  <td className="max-w-[200px] px-5 py-4 text-slate-700">
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
