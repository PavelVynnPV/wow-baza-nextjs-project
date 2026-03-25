"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function GameForm({
  game,
  isNew,
}: {
  game: any;
  isNew: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: game?.title ?? "",
    slug: game?.slug ?? "",
    patch: game?.patch ?? "",
    description: game?.description ?? "",
    image_url: game?.image_url ?? "",
    order: game?.order ?? 0,
    is_active: game?.is_active ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const { data, error } = await supabase.from("games").insert(form);
      console.log('insert:', data, error)
    } else {
      const { data, error } = await supabase.from("games").update(form).eq("id", game.id);
      console.log('update:', data, error)
    }
  
    router.push("/admin/games");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this game?")) return;
    await supabase.from("games").delete().eq("id", game.id);
    router.push("/admin/games");
    router.refresh();
  };

  const inputClass = "bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40 w-full";

  return (
    <form onSubmit={handleSubmit} className="bg-[#2F292D] rounded-xl p-6 flex flex-col gap-4 max-w-[600px]">
      <div>
        <label className="text-white/50 text-sm mb-1 block">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="WOW Burning Crusade" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Slug</label>
        <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="w_burning_crusade" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Patch</label>
        <input name="patch" value={form.patch} onChange={handleChange} className={inputClass} placeholder="Burning Crusade Patch 2.5.5" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className={`${inputClass} h-[120px] resize-none`} placeholder="Game description..." />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Image URL</label>
        <input name="image_url" value={form.image_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Order</label>
        <input name="order" type="number" value={form.order} onChange={handleChange} className={inputClass} />
      </div>
      <div className="flex items-center gap-3">
        <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
        <label className="text-white text-sm">Active</label>
      </div>

      <div className="flex gap-3 mt-4">
        <button type="submit" disabled={loading}
          className="flex-1 bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50">
          {loading ? "Saving..." : isNew ? "Add Game" : "Save Changes"}
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