"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex justify-center items-center -mt-[100px]">
      <div className="bg-[#2F292D] rounded-xl p-8 w-full max-w-[400px]">
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          Forgot Password
        </h1>

        {success ? (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-green-400 text-sm">
              Check your email — we sent a reset link!
            </p>
            <Link href="/login" className="text-[#FF9500] hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-white/50 text-sm text-center">
              Remember password?{" "}
              <Link href="/login" className="text-[#FF9500] hover:underline">
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}