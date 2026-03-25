"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-yellow-500/20 text-yellow-400",
  done: "bg-green-500/20 text-green-400",
};

export default function OrderStatus({
  orderId,
  status: initialStatus,
}: {
  orderId: number;
  status: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const supabase = createClient();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
  };

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-yellow-500/20 text-yellow-400",
    done: "bg-green-500/20 text-green-400",
    paid: "bg-purple-500/20 text-purple-400",
    pending_payment: "bg-gray-500/20 text-gray-400",
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      className={`px-2 py-1 rounded text-xs font-semibold outline-none cursor-pointer ${statusColors[status] ?? "bg-white/10 text-white"}`}
    >
      <option value="new">New</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
      <option value="paid">Paid</option>
    </select>
  );
}
