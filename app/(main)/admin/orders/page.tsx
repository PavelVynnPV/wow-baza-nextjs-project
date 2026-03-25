import { createClient } from "@/lib/supabase/server";
import OrderStatus from "./OrderStatus";
import OrderFilters from "./OrderFilters";
import ArchiveButton from "./ArchiveButton";

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>;
}) {
  const { status, date } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    query = query
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString());
  }

  const { data: orders } = await query;

  const totalRevenue = orders?.reduce((sum, o) => sum + (o.price ?? 0), 0) ?? 0;

  const { data: servers } = await supabase.from("servers").select("*");

  const getServerName = (serverId: number) =>
    servers?.find((s) => s.id === serverId)?.name ?? "—";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-3xl font-bold">Orders</h1>
        <div className="flex items-center gap-4">
          {" "}
          <ArchiveButton />
          <div className="bg-[#2F292D] rounded-xl px-6 py-3">
            <p className="text-white/50 text-sm">Total Revenue</p>
            <p className="text-[#FF9500] font-bold text-xl">
              $ {totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <OrderFilters currentStatus={status} currentDate={date} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "New",
            status: "new",
            color: "bg-blue-500/20 text-blue-400",
          },
          {
            label: "In Progress",
            status: "in_progress",
            color: "bg-yellow-500/20 text-yellow-400",
          },
          {
            label: "Done",
            status: "done",
            color: "bg-green-500/20 text-green-400",
          },
        ].map((s) => (
          <div key={s.status} className="bg-[#2F292D] rounded-xl p-4">
            <p className="text-white/50 text-sm">{s.label}</p>
            <p className={`font-bold text-xl ${s.color.split(" ")[1]}`}>
              {orders?.filter((o) => o.status === s.status).length ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#2F292D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                ID
              </th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                Email
              </th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                Nickname
              </th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                Amount
              </th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                Faction
              </th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                Server
              </th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                Price
              </th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                Date
              </th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-white/50"
                >
                  No Orders Yet
                </td>
              </tr>
            )}
            {orders?.map((order) => {
              const isNew =
                order.status === "paid" &&
                new Date(order.created_at) >
                  new Date(Date.now() - 24 * 60 * 60 * 1000);

              return (
                <tr
                  key={order.id}
                  className={`border-b border-white/5 hover:bg-white/5 transition-all ${isNew ? "bg-green-500/5" : ""}`}
                >
                  <td className="px-6 py-4 text-white/50 text-sm flex items-center gap-2">
                    #{order.id}
                    {isNew && (
                      <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse">
                        NEW
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 text-white text-sm">
                    {order.user_email ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm">
                    {order.nickname}
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm capitalize">
                    {order.faction}
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm">
                    {getServerName(order.server_id)}
                  </td>
                  <td className="px-6 py-4 text-white font-bold text-sm">
                    $ {order.price}
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatus orderId={order.id} status={order.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
