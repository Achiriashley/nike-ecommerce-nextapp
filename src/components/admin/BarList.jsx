// Single-series horizontal bars; each value is printed, so the bars never carry meaning alone.
export default function BarList({ title, rows, format = (v) => v, empty = "No data yet" }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="rounded-2xl border bg-white p-5" aria-label={title}>
      <h2 className="font-semibold text-ink">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">{empty}</p>
      ) : (
        <table className="mt-4 w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="group" title={`${r.label}: ${format(r.value)}`}>
                <th scope="row" className="w-28 py-1.5 pr-3 text-left font-normal capitalize text-neutral-700">{r.label}</th>
                <td className="py-1.5">
                  <div className="h-2.5 rounded-r bg-surface">
                    <div className="h-full rounded-r-[4px] bg-ink transition-opacity group-hover:opacity-80" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
                  </div>
                </td>
                <td className="w-16 py-1.5 pl-3 text-right font-medium tabular-nums text-ink">{format(r.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
