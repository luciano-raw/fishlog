import { captureImage } from "@/lib/captureShare";
export const runtime = "nodejs";
export const alt = "Captura compartida en Fishlog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  return captureImage((await params).id);
}
