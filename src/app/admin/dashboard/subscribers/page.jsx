import { Mail } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { loadSubscribers } from "@/lib/server/adminData";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Subscribers" };

export default async function AdminSubscribers() {
  const { subscribers, available } = await loadSubscribers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Subscribers</h1>
        <p className="mt-1 text-neutral-600">People who joined the newsletter from the store.</p>
      </div>
      {!available ? (
        <p className="rounded-2xl border bg-white p-5 text-sm text-neutral-700">Subscribers need a database connection. Set <code className="rounded bg-surface px-1">MONGO_DB</code> to collect sign-ups.</p>
      ) : subscribers.length === 0 ? (
        <EmptyState icon={Mail} title="No subscribers yet" description="Sign-ups from the newsletter form in the footer will appear here." className="bg-white" />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-surface/60 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 text-ink">{s.email}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
