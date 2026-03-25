import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export default async function AdminUsers() {
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { users } } = await adminSupabase.auth.admin.listUsers();

  return (
    <div>
      <h1 className="text-white text-3xl font-bold mb-8">Users</h1>

      <div className="bg-[#2F292D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Email</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Role</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Confirmed</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-6 py-4 text-white font-semibold text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.user_metadata?.role === 'admin' 
                      ? 'bg-[#FF9500]/20 text-[#FF9500]' 
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {user.user_metadata?.role ?? 'user'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.email_confirmed_at 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.email_confirmed_at ? 'Confirmed' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/50 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
