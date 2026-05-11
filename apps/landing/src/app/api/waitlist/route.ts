import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore — no types for this package
import disposableDomains from "disposable-email-domains";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    // ── Supabase insert ───────────────────────────────────────────────────────
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("waitlist error:", err);
    return NextResponse.json(
      { error: "something went wrong. try again." },
      { status: 500 }
    );
  }
}
