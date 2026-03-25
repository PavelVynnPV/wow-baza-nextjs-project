import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, total } = await req.json();

    const response = await axios.post(
      "https://api.nowpayments.io/v1/payment",
      {
        price_amount: total,
        price_currency: "usd",
        pay_currency: "usdttrc20",
        order_id: `order_${user.id}_${Date.now()}`,
        order_description: `WOW BAZA Order - ${items.length} items`,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/crypto-webhook`,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = response.data;

    return NextResponse.json({
      payment_id: payment.payment_id,
      pay_address: payment.pay_address,
      pay_amount: payment.pay_amount,
      pay_currency: payment.pay_currency,
      payment_url: `https://nowpayments.io/payment/?iid=${payment.payment_id}`,
    });

  } catch (error: any) {
    console.error("NOWPayments error:", error?.response?.data ?? error);
    return NextResponse.json({ error: "Crypto checkout failed" }, { status: 500 });
  }
}