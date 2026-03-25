import Link from "next/link";

export default function CheckoutCancel() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-white">
      <div className="text-center flex flex-col items-center gap-6">
        <div className="text-7xl">😕</div>
        <h1 className="text-4xl font-bold">Payment Cancelled</h1>
        <p className="text-white/50 max-w-[400px]">
          Your payment was cancelled. Your cart is still saved — you can try again anytime.
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