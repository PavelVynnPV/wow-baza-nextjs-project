"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-white">
      <div className="text-center flex flex-col items-center gap-6">
        <div className="text-7xl">🎉</div>
        <h1 className="text-4xl font-bold">Payment Successful!</h1>
        <p className="text-white/50 max-w-[400px]">
          Your order has been placed successfully. We will process it shortly and contact you.
        </p>
        <Link
          href="/"
          className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 px-8 font-bold text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}