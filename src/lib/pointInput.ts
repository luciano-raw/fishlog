export function parsePointInput(form: FormData) {
  const name = form.get("name");
  const latitude = form.get("lat"), longitude = form.get("lng");
  if (typeof name !== "string" || !name.trim() || name.trim().length > 150) throw new Error("Escribe un nombre de hasta 150 caracteres.");
  if (typeof latitude !== "string" || !latitude.trim() || typeof longitude !== "string" || !longitude.trim()) throw new Error("Selecciona la ubicación en el mapa o usa tu GPS.");
  const lat = Number(latitude), lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) throw new Error("La ubicación no es válida. Vuelve a seleccionarla.");
  return { name: name.trim(), lat, lng };
}

export function pointText(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || value.trim().length > 1000) throw new Error("La descripción debe tener hasta 1000 caracteres.");
  return value.trim() || null;
}

export function pointPhotoFile(value: FormDataEntryValue | null, maxBytes: number): File | null {
  if (value === null || value instanceof File && value.size === 0) return null;
  if (!(value instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(value.type) || value.size > maxBytes) throw new Error("No pudimos procesar la foto. Vuelve a seleccionarla o continúa sin foto.");
  return value;
}
