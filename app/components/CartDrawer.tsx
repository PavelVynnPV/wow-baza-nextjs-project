"use client";

import { useCart } from "@/app/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, removeItem, clearCart, total, count } = useCart();

  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (loading) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to checkout!");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();

    if (data.url) {
      const orders = items.map((item) => ({
        product_id: item.product_id,
        user_email: user.email,
        server_id: item.server_id,
        faction: item.faction,
        nickname: item.nickname,
        amount: item.amount,
        price: item.price,
        status: "in_progress",
      }));

      await supabase.from("orders").insert(orders);
      clearCart();
      window.location.href = data.url;
    } else {
      alert("Checkout error. Please try again.");
      setLoading(false);
    }
  };

  const handleCryptoCheckout = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to checkout!");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/crypto-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, total }),
    });

    const data = await res.json();
    console.log("checkout response:", data); 


    if (data.payment_url) {
      const orders = items.map((item: any) => ({
        product_id: item.product_id,
        user_email: user.email,
        server_id: item.server_id,
        faction: item.faction,
        nickname: item.nickname,
        amount: item.amount,
        price: item.price,
        status: "in_progress",
      }));

      await supabase.from("orders").insert(orders);
      clearCart();
      window.location.href = data.payment_url;
    } else {
      alert("Crypto checkout error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-200" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#1a1a1a] z-201 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-[#FF9500]" />
            <h2 className="text-white font-bold text-lg">Cart ({count})</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
              <ShoppingCart className="w-16 h-16" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-xl p-4 flex gap-4"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-xs mt-1 capitalize">
                    {item.faction} · {item.amount}
                  </p>
                  <p className="text-white/50 text-xs">{item.nickname}</p>
                  <p className="text-[#FF9500] font-bold mt-2">
                    $ {item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-white hover:text-red-400 transition-all cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-white/50">Total</span>
              <span className="text-white font-bold text-xl">
                $ {total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50"
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
            <button
              onClick={handleCryptoCheckout}
              disabled={loading}
              className="w-full bg-[#1a1a2e] hover:bg-[#1a1a2e]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50 border border-white/20 flex items-center justify-center gap-2"
            >
              💎 Pay with Crypto
            </button>
            <button
              onClick={clearCart}
              className="w-full bg-red-500/20 hover:bg-red-500/30 transition-all rounded-lg py-3 font-bold text-red-400 cursor-pointer text-sm"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
