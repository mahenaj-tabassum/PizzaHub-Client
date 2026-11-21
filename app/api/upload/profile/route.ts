import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024;

// Simple in-memory rate limit: 10 uploads per IP per 10 minutes.
// (Per server instance. Enough to stop casual abuse.)
const WINDOW_MS = 10 * 60 * 1000;
const MAX_UPLOADS = 10;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_UPLOADS) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// Check the real file signature (magic bytes)
async function isRealImage(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer());

  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;

  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

  return isPng || isJpeg;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Image service is not configured." },
        { status: 500 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: "Too many uploads. Please try again later." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Please select an image." },
        { status: 400 },
      );
    }

    if (!["image/png", "image/jpeg"].includes(image.type)) {
      return NextResponse.json(
        { message: "Only PNG and JPG images are supported." },
        { status: 400 },
      );
    }

    if (image.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "Image must be smaller than 2 MB." },
        { status: 400 },
      );
    }

    if (!(await isRealImage(image))) {
      return NextResponse.json(
        { message: "This file is not a valid PNG or JPG image." },
        { status: 400 },
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      { method: "POST", body: uploadData },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return NextResponse.json(
        { message: "Image upload failed." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: result.data.url });
  } catch {
    return NextResponse.json(
      { message: "Unable to upload image." },
      { status: 500 },
    );
  }
}
