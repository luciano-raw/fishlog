import { captureImage } from "@/lib/captureShare";
export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return captureImage((await params).id, new URL(request.url).searchParams.get("download") === "1");
}
