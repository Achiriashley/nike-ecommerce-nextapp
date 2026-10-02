import OrdersTable from "@/components/admin/OrdersTable";
import { loadOrders } from "@/lib/server/adminData";

export const metadata = { title: "Orders" };

export default async function AdminOrders() {
  const { orders, available } = await loadOrders();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Orders</h1>
        <p className="mt-1 text-neutral-600">Orders are created when a customer starts checkout. Update the status as you confirm payment and ship.</p>
      </div>
      {available ? (
        <OrdersTable orders={orders} />
      ) : (
        <p className="rounded-2xl border bg-white p-5 text-sm text-neutral-700">Orders need a database connection. Set <code className="rounded bg-surface px-1">MONGO_DB</code> to record and manage orders.</p>
      )}
    </div>
  );
}
