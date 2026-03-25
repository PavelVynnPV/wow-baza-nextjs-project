import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

export default async function AdminSlider() {
  const supabase = await createClient();

  const { data: slides } = await supabase
    .from("slides")
    .select("*")
    .order("order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-3xl font-bold">Slider</h1>
        <Link
          href="/admin/slider/new"
          className="flex items-center gap-2 bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all px-4 py-2 rounded-lg text-white font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </Link>
      </div>

      <div className="bg-[#2F292D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Slide</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Title</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Game</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Order</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Status</th>
              <th className="text-white/50 text-sm font-semibold text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides?.map((slide) => (
              <tr key={slide.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-6 py-4">
                  <img src={slide.image_url} alt={slide.title_game_name} className="w-16 h-10 rounded object-cover" />
                </td>
                <td className="px-6 py-4 text-white font-semibold text-sm">{slide.title_game_name}</td>
                <td className="px-6 py-4 text-white/50 text-sm">{slide.slug}</td>
                <td className="px-6 py-4 text-white/50 text-sm">{slide.order}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${slide.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {slide.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/slider/${slide.id}`}
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