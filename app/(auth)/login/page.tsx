"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked) return;

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setBlocked(true);
        setError("Too many attempts. Please try again in 5 minutes.");
        setTimeout(
          () => {
            setBlocked(false);
            setAttempts(0);
          },
          5 * 60 * 1000,
        );
      } else {
        setError(
          `Invalid email or password. Attempts left: ${5 - newAttempts}`,
        );
      }

      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex justify-center items-center -mt-[100px]">
      <div className="bg-[#2F292D] rounded-xl p-8 w-full max-w-[400px]">
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-white/40 hover:text-[#FF9500] text-xs transition-all"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading || blocked}
            className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50"
          >
            {blocked
              ? "Blocked for 5 minutes"
              : loading
                ? "Loading..."
                : "Login"}
          </button>

          <p className="text-white/50 text-sm text-center">
            Don't have an account?
            <Link href="/register" className="text-[#FF9500] hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
