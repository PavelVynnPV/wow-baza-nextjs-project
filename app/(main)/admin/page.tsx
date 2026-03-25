import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Package, Gamepad2, ShoppingCart, Users } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { count: gamesCount },
    { count: productsCount },
    { count: ordersCount },
    { data: { users } },
  ] = await Promise.all([
    supabase.from("games").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    adminSupabase.auth.admin.listUsers(),
  ]);

  const stats = [
    { label: "Games", value: gamesCount ?? 0, icon: Gamepad2, color: "bg-blue-500" },
    { label: "Products", value: productsCount ?? 0, icon: Package, color: "bg-green-500" },
    { label: "Orders", value: ordersCount ?? 0, icon: ShoppingCart, color: "bg-[#FF9500]" },
    { label: "Users", value: users?.length ?? 0, icon: Users, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-white text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#2F292D] rounded-xl p-6 flex items-center gap-4">
            <div className={`${stat.color} rounded-lg p-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/50 text-sm">{stat.label}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}