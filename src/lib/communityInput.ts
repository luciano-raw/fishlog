export function recordId(value: unknown): string {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(value)) throw new Error("Registro inválido.");
  return value;
}
export function pointType(value: unknown): "spot" | "hazard" {
  if (value !== "spot" && value !== "hazard") throw new Error("Solo se puede comentar en spots y peligros.");
  return value;
}
export function commentBody(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 1000) throw new Error("Escribe un comentario de entre 1 y 1000 caracteres.");
  return value.trim();
}
