import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 32 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: "IMGBB_API_KEY_NOT_CONFIGURED" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const name = formData.get("name");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, message: "IMAGE_FILE_REQUIRED" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(image.type)) {
      return NextResponse.json(
        { success: false, message: "UNSUPPORTED_IMAGE_TYPE" },
        { status: 400 }
      );
    }

    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "IMAGE_TOO_LARGE" },
        { status: 400 }
      );
    }

    const upstreamFormData = new FormData();
    upstreamFormData.append("image", image);

    if (typeof name === "string" && name.trim()) {
      upstreamFormData.append("name", name.trim());
    }

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: upstreamFormData,
      cache: "no-store",
    });

    const result = await imgbbResponse.json();

    if (!imgbbResponse.ok || !result?.success || !result?.data?.url) {
      return NextResponse.json(
        { success: false, message: result?.error?.message || "IMGBB_UPLOAD_FAILED" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.data.url,
      displayUrl: result.data.display_url,
      deleteUrl: result.data.delete_url,
    });
  } catch (error) {
    console.error("ImgBB upload failed:", error);
    return NextResponse.json(
      { success: false, message: "UPLOAD_REQUEST_FAILED" },
      { status: 500 }
    );
  }
}