import { normalizeError } from "@/shared/errors";
import { getOrderImage } from "@/modules/orders/service";

// Остаётся Route Handler'ом: <img src> умеет только GET.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const image = await getOrderImage(Number((await params).id));
    if (!image) return new Response(null, { status: 404 });

    return new Response(Buffer.from(image.bytes), {
      headers: {
        "Content-Type": image.mime,
        "Cache-Control": "private, max-age=31536000, immutable", // URL содержит ?v=имя файла
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (cause) {
    return new Response(null, { status: normalizeError(cause).kind === "infrastructure" ? 503 : 500 });
  }
}
