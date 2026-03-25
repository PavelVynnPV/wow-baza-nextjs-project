"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function OrderFilters({
  currentStatus,
  currentDate,
}: {
  currentStatus?: string;
  currentDate?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/admin/orders?${params.toString()}`);
  };

  const statuses = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "paid", label: "Paid" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter("status", s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              (currentStatus ?? "all") === s.value
                ? "bg-[#FF9500] text-white"
                : "bg-white/10 text-white/50 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <input
        type="date"
        value={currentDate ?? ""}
        onChange={(e) => setFilter("date", e.target.value)}
        className="bg-white/10 rounded-lg px-4 py-2 text-white outline-none cursor-pointer text-sm"
      />

      {(currentStatus || currentDate) && (
        <button
          onClick={() => router.push("/admin/orders")}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}