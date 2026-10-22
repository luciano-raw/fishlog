import { auth } from "@clerk/nextjs/server";
import { parsePlaces, placeSearchUrl } from "@/lib/placeSearch";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Inicia sesión para buscar lugares." }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim();
  if (query.length < 3 || query.length > 120) return Response.json({ error: "Escribe entre 3 y 120 caracteres." }, { status: 400 });
  try {
    const url = placeSearchUrl(query, params.get("chile") !== "false", process.env.PLACE_SEARCH_URL || undefined);
    const response = await fetch(url, {
      headers: { "User-Agent": "Fishlog/1.0 (https://fishlog-cnc2.vercel.app)", "Accept": "application/json" },
      signal: AbortSignal.timeout(8000), next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`Place provider returned ${response.status}`);
    return Response.json({ places: parsePlaces(await response.json()) }, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch (error) {
    console.error("Place search failed", error);
    return Response.json({ error: "La búsqueda no está disponible en este momento. Puedes seguir eligiendo el punto en el mapa." }, { status: 503 });
  }
}
