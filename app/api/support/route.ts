import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "WOW Baza Support <onboarding@resend.dev>",
    to: process.env.SUPPORT_EMAIL!,
    subject: `[Support] ${subject}`,
    html: `
      <h2>New Support Request</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Subject:</b> ${subject}</p>
      <p><b>Message:</b></p>
      <p>${message}</p>
    `,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ success: true });
}