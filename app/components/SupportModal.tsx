"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SupportModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError("Something went wrong. Try again.");
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="fixed right-0 left-0 inset-0 z-300 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#2F292D] rounded-xl p-8 w-full max-w-[450px] z-301 mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-white text-2xl font-bold mb-6">Support</h2>

        {success ? (
          <div className="text-center py-6">
            <p className="text-green-400 text-lg font-semibold mb-2">Message sent!</p>
            <p className="text-white/50 text-sm">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40 resize-none"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}