import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Image service is not configured." },
        { status: 500 },
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

    if (image.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image must be smaller than 2 MB." },
        { status: 400 },
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { message: "Image upload failed." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      url: result.data.url,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to upload image." },
      { status: 500 },
    );
  }
}
