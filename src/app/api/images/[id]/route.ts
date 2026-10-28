import { connectDb } from "@/lib/db";
import { isObjectId } from "@/lib/ids";
import { StoredImage } from "@/models/stored-image";

// Public: these are the logos and screenshots shown on the site. Each upload
// has its own id and never changes, so browsers and CDNs can cache it forever.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isObjectId(id)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    await connectDb();
    const image = await StoredImage.findById(id).select("data contentType");
    if (!image) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(new Uint8Array(image.data), {
      headers: {
        "Content-Type": image.contentType,
        "Content-Length": String(image.data.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[images] lookup failed", error);
    return new Response("Unavailable", { status: 503 });
  }
}
