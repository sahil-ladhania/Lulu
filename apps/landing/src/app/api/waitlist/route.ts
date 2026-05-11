import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore — no types for this package
import disposableDomains from "disposable-email-domains";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, city } = body;

    // ── Field validation ──────────────────────────────────────────────────────
    if (!name || !email || !city) {
      return NextResponse.json(
        { error: "name, email and city are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "invalid email address." },
        { status: 400 }
      );
    }

    // ── Disposable email block ────────────────────────────────────────────────
    const emailDomain = email.split("@")[1].toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: "please use a real email address." },
        { status: 400 }
      );
    }

    // ── Name split for Resend ─────────────────────────────────────────────────
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // ── Supabase insert — only thing we wait for ──────────────────────────────
    const supabaseResult = await supabase
      .from("waitlist_entries")
      .insert([{ name, email, city }]);

    // ── Duplicate email (Supabase unique constraint) ──────────────────────────
    if ((supabaseResult as any).error?.code === "23505") {
      return NextResponse.json(
        { error: "already on the list." },
        { status: 409 }
      );
    }

    // ── Supabase hard failure ─────────────────────────────────────────────────
    if ((supabaseResult as any).error) {
      console.error("supabase error:", (supabaseResult as any).error);
      throw new Error("database error");
    }

    // ── Resend contact + confirmation email — fire and forget ─────────────────
    resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    }).catch((err: unknown) => console.error("resend contact error:", err));

    // ── Confirmation email — fire and forget, never blocks response ───────────
    resend.emails.send({
      from: "lulu. <hello@getluluapp.in>",
      to: email,
      subject: "you're on the list.",
      html: `
        <div style="background:#0F0D0B;color:#F5F0E6;font-family:'Helvetica Neue',sans-serif;padding:48px 40px;max-width:480px;margin:0 auto;">
          <p style="font-size:22px;font-weight:500;letter-spacing:-0.03em;margin:0 0 24px;">
            lulu<span style="color:#E89B23;">.</span>
          </p>
          <p style="font-size:28px;font-weight:500;letter-spacing:-0.03em;margin:0 0 16px;line-height:1.1;">
            you're on the list, ${firstName}.
          </p>
          <p style="font-size:15px;color:#F5F0E6;opacity:0.5;line-height:1.6;margin:0 0 32px;">
            we're launching city by city. when lulu goes live in ${city}, you'll be the first to know.
          </p>
          <p style="font-size:13px;color:#F5F0E6;opacity:0.25;margin:0;">
            match deeper, reveal later.
          </p>
        </div>
      `,
    }).catch((emailErr: unknown) => console.error("confirmation email error:", emailErr));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("waitlist error:", err);
    return NextResponse.json(
      { error: "something went wrong. try again." },
      { status: 500 }
    );
  }
}
