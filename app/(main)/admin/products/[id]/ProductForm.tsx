"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProductForm({
  product,
  isNew,
}: {
  product: any;
  isNew: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: product?.title ?? "",
    game_slug: product?.game_slug ?? "",
    category: product?.category ?? "",
    price: product?.price ?? 0,
    currency: product?.currency ?? "$",
    faction: product?.faction ?? "",
    features: product?.features ?? "",
    image_url: product?.image_url ?? "",
    server_id: product?.server_id ?? "",
    order: product?.order ?? 0,
    is_active: product?.is_active ?? true,
    is_bestseller: product?.is_bestseller ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isNew) {
      const { error } = await supabase.from("products").insert(form);
      console.log("insert error:", error);
    } else {
      const { error } = await supabase.from("products").update(form).eq("id", product.id);
      console.log("update error:", error);
    }

    router.push("/admin/products");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("delete this product?")) return;
    await supabase.from("products").delete().eq("id", product.id);
    router.push("/admin/products");
    router.refresh();
  };

  const inputClass = "bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40 w-full";

  return (
    <form onSubmit={handleSubmit} className="bg-[#2F292D] rounded-xl p-6 flex flex-col gap-4 max-w-[600px]">
      <div>
        <label className="text-white/50 text-sm mb-1 block">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Spineshatter [EU] PVP GOLD" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Game Slug</label>
        <input name="game_slug" value={form.game_slug} onChange={handleChange} className={inputClass} placeholder="w_burning_crusade" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Category</label>
        <input name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="gold" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Faction</label>
        <select name="faction" value={form.faction} onChange={handleChange} className={inputClass}>
          <option value="">Select faction</option>
          <option value="horde">Horde</option>
          <option value="alliance">Alliance</option>
        </select>
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Features (comma separated)</label>
        <textarea name="features" value={form.features} onChange={handleChange} className={`${inputClass} h-[80px] resize-none`} placeholder="Fast leveling, Safe manual play" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Image URL</label>
        <input name="image_url" value={form.image_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Server ID</label>
        <input name="server_id" type="number" value={form.server_id} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Order</label>
        <input name="order" type="number" value={form.order} onChange={handleChange} className={inputClass} />
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-3">
          <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
          <label className="text-white text-sm">Active</label>
        </div>
        <div className="flex items-center gap-3">
          <input name="is_bestseller" type="checkbox" checked={form.is_bestseller} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
          <label className="text-white text-sm">Bestseller</label>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button type="submit" disabled={loading}
          className="flex-1 bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50">
          {loading ? "Saving..." : isNew ? "Add Product" : "Save Changes"}
        </button>
        {!isNew && (
          <button type="button" onClick={handleDelete}
            className="bg-red-500/20 hover:bg-red-500/40 transition-all rounded-lg py-3 px-6 font-bold text-red-400 cursor-pointer">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}