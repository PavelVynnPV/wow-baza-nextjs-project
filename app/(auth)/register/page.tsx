"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRegistered(true);
    setLoading(false);
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center px-4">
        <div className="bg-[#2F292D] rounded-xl p-8 w-full max-w-[400px] text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-white text-2xl font-bold mb-4">
            Check your email!
          </h1>
          <p className="text-white/50 text-sm mb-6 leading-6">
            Sent to <span className="text-[#FF9500]">{email}</span> A
            confirmation link has been sent to your email. Please click the link
            to activate your account.
          </p>
          <Link
            href="/login"
            className="block w-full bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center px-4">
      <div className="bg-[#2F292D] rounded-xl p-8 w-full max-w-[400px]">
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          Register
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-white/50 text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF9500] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
