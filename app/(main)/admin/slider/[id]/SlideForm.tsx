"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SlideForm({
  slide,
  isNew,
}: {
  slide: any;
  isNew: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_frase: slide?.title_frase ?? "",
    title_game_name: slide?.title_game_name ?? "",
    slide_description: slide?.slide_description ?? "",
    slide_button: slide?.slide_button ?? "EXPLORE",
    image_url: slide?.image_url ?? "",
    slug: slide?.slug ?? "",
    order: slide?.order ?? 0,
    is_active: slide?.is_active ?? true,
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
      const { error } = await supabase.from("slides").insert(form);
      console.log("insert error:", error);
    } else {
      const { error } = await supabase.from("slides").update(form).eq("id", slide.id);
      console.log("update error:", error);
    }

    router.push("/admin/slider");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("delete this slide?")) return;
    await supabase.from("slides").delete().eq("id", slide.id);
    router.push("/admin/slider");
    router.refresh();
  };

  const inputClass = "bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40 w-full";

  return (
    <form onSubmit={handleSubmit} className="bg-[#2F292D] rounded-xl p-6 flex flex-col gap-4 max-w-[600px]">
      <div>
        <label className="text-white/50 text-sm mb-1 block">Title Frase</label>
        <input name="title_frase" value={form.title_frase} onChange={handleChange} className={inputClass} placeholder="New Adventure Awaits" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Game Name</label>
        <input name="title_game_name" value={form.title_game_name} onChange={handleChange} className={inputClass} placeholder="WOW Burning Crusade" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Description</label>
        <textarea name="slide_description" value={form.slide_description} onChange={handleChange} className={`${inputClass} h-[80px] resize-none`} placeholder="Short description..." />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Button Text</label>
        <input name="slide_button" value={form.slide_button} onChange={handleChange} className={inputClass} placeholder="EXPLORE" />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Image URL</label>
        <input name="image_url" value={form.image_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
      </div>
      <div>
        <label className="text-white/50 text-sm mb-1 block">Game Slug</label>
        <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="w_burning_crusade" />
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
          {loading ? "Saving..." : isNew ? "Add Slide" : "Save Changes"}
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