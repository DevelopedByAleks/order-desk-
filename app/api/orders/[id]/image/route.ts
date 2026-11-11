import { errorStatus, getOrderImage, orderError } from "@/lib/orders"
import { parseOrderId } from "@/lib/validations/orders"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseOrderId((await params).id)
  if (id === null) return new Response(null, { status: 400 })

  try {
    const image = await getOrderImage(id)
    if (!image) return new Response(null, { status: 404 })

    return new Response(Uint8Array.from(image.bytes), {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (cause) {
    const error = orderError(cause)
    return Response.json({ success: false, error }, { status: errorStatus[error.kind] })
  }
}
