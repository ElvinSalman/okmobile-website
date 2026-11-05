import { inquirySchema } from "@/lib/inquiry";
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 12000)
    return Response.json({ error: "invalid" }, { status: 400 });
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (
        new URL(origin).host !==
        (request.headers.get("host") || new URL(request.url).host)
      )
        return Response.json({ error: "forbidden" }, { status: 403 });
    } catch {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
  }
  let data;
  try {
    data = inquirySchema.safeParse(await request.json());
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  if (!data.success)
    return Response.json({ error: "invalid" }, { status: 400 });
  const endpoint = process.env.INQUIRY_WEBHOOK_URL;
  if (!endpoint)
    return Response.json({ error: "unavailable" }, { status: 503 });
  try {
    if (new URL(endpoint).protocol !== "https:")
      throw new Error("HTTPS required");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.data),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!res.ok) throw new Error("Delivery failed");
    return Response.json({ delivered: true });
  } catch {
    return Response.json({ error: "failed" }, { status: 502 });
  }
}
