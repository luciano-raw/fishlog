export function parseShopInput(form: FormData) {
  function text(key: string, max: number, required = false) {
    const entry = form.get(key);
    if (entry !== null && typeof entry !== "string") throw new Error("Datos de tienda inválidos.");
    const value = (entry ?? "").trim();
    if (required && !value) throw new Error("El nombre de la tienda es obligatorio.");
    if (value.length > max) throw new Error(`El campo ${key} supera el largo permitido.`);
    return value || null;
  }
  const name = text("name", 120, true)!;
  const description = text("description", 1200);
  const address = text("address", 250);
  const website = text("website", 500);
  if (website) {
    let url: URL;
    try { url = new URL(website); } catch { throw new Error("El enlace debe comenzar con https:// o http://."); }
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("El enlace de la tienda no es válido.");
  }
  const lat = form.get("lat"), lng = form.get("lng");
  if (typeof lat !== "string" || !lat.trim() || typeof lng !== "string" || !lng.trim()) throw new Error("Selecciona la ubicación de la tienda en el mapa.");
  const locationLat = Number(lat), locationLng = Number(lng);
  if (!Number.isFinite(locationLat) || !Number.isFinite(locationLng) || Math.abs(locationLat) > 90 || Math.abs(locationLng) > 180) throw new Error("La ubicación no es válida.");
  return { name, description, address, website, locationLat, locationLng };
}
