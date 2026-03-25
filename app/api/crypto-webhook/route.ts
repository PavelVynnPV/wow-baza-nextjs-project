import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("NOWPayments webhook:", body);

    if (body.payment_status === "finished" || body.payment_status === "confirmed") {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const orderId = body.order_id as string;
      const userId = orderId.split("_")[1];

      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("user_id", userId)
        .eq("status", "pending_payment");

      await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Crypto webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}