import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const bodySchema = z
  .object({
    // admin কখনোই অনুমোদিত নয়
    role: z.enum(["customer", "vendor"]),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        { message: "Please sign in first." },
        { status: 401 },
      );
    }

    if (session.user.isBlocked) {
      return NextResponse.json(
        { message: "Your account has been blocked." },
        { status: 403 },
      );
    }

    // রোল শুধু একবার বেছে নেওয়া যায়। আগে বাছাই হয়ে থাকলে আর বদলানো যাবে না।
    if (session.user.roleSelected !== false) {
      return NextResponse.json(
        { message: "Your account role is already set." },
        { status: 409 },
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please choose Customer or Restaurant owner." },
        { status: 400 },
      );
    }

    const ctx = await auth.$context;

    // user id সবসময় সেশন থেকে আসে, ক্লায়েন্টের পাঠানো কিছু থেকে নয়
    await ctx.internalAdapter.updateUser(session.user.id, {
      role: parsed.data.role,
      roleSelected: true,
    });

    return NextResponse.json({ role: parsed.data.role });
  } catch {
    return NextResponse.json(
      { message: "Could not save your role. Please try again." },
      { status: 500 },
    );
  }
}
