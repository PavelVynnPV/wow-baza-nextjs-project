"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex justify-center items-center -mt-[100px]">
      <div className="bg-[#2F292D] rounded-xl p-8 w-full max-w-[400px]">
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          New Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}