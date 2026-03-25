"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ArchiveButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleArchive = async () => {
    if (!confirm("Archive all done/paid orders older 30 days?")) return;

    setLoading(true);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error } = await supabase
      .from("orders")
      .update({ is_active: false })
      .in("status", ["done", "paid"])
      .lt("created_at", thirtyDaysAgo.toISOString());

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Archive successful");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleArchive}
      disabled={loading}
      className="px-4 py-2 bg-white/10 text-white/70 rounded-xl text-sm hover:bg-white/20 hover:text-white transition-all disabled:opacity-50"
    >
      {loading ? "Archiving..." : "Archive old (30d)"}
    </button>
  );
}