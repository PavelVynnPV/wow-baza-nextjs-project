"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Gamepad2,
  Package,
  Image,
  ShoppingCart,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/slider", label: "Slider", icon: Image },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] flex">
      <div className="w-[250px] bg-[#2F292D] flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-white font-bold text-xl">WOW BAZA Admin</h1>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold ${
                pathname === item.href
                  ? "bg-[#FF9500] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold w-full cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="ml-[250px] flex-1 p-8">
        {children}
      </div>
    </div>
  );
}