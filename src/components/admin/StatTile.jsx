export default function StatTile({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-600">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-neutral-400" aria-hidden />}
      </div>
      <p className="mt-3 text-[28px] font-semibold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}
