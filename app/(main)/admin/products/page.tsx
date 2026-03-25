import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

export default async function AdminProducts() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-3xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all px-4 py-2 rounded-lg text-white font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-[#2F292D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Product</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Game</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Category</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Price</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Faction</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Status</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={product.image_url} alt={product.title} className="w-8 h-8 rounded object-cover" />
                  <span className="text-white font-semibold text-sm">{product.title}</span>
                </td>
                <td className="px-6 py-4 text-white/50 text-sm">{product.game_slug}</td>
                <td className="px-6 py-4 text-white/50 text-sm capitalize">{product.category}</td>
                <td className="px-6 py-4 text-white font-bold text-sm">$ {product.price}</td>
                <td className="px-6 py-4 text-white/50 text-sm capitalize">{product.faction}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${product.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex items-center gap-1 text-white/50 hover:text-white transition-all text-sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}