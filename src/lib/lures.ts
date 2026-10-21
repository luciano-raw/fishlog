export const LURE_TYPES = [
  { value: "bait", label: "Carnada natural" },
  { value: "spinner", label: "Spinner" },
  { value: "spoon", label: "Cuchara" },
  { value: "hard", label: "Señuelo duro (minnow, crankbait...)" },
  { value: "soft", label: "Señuelo blando (vinilo, goma)" },
  { value: "fly", label: "Mosca" },
  { value: "jig", label: "Jig" },
  { value: "other", label: "Otro" },
] as const;

export function lureLabel(value: string | null | undefined) {
  return LURE_TYPES.find(option => option.value === value)?.label ?? null;
}

export function parseLureType(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || !lureLabel(value)) throw new Error("Selecciona un tipo de señuelo válido.");
  return value;
}
