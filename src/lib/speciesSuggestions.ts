export type SpeciesOption = { id: string; name: string; scientificName: string };

export function normalizeSpecies(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim().replace(/\s+/g, " ");
}

export function suggestSpecies(options: SpeciesOption[], value: string, limit = 6): SpeciesOption[] {
  const query = normalizeSpecies(value);
  if (!query) return [];
  const words = query.split(" ");
  return options.map((option, index) => {
    const name = normalizeSpecies(option.name);
    const scientific = normalizeSpecies(option.scientificName);
    const matches = words.every(word => `${name} ${scientific}`.includes(word));
    const rank = name === query ? 0 : name.startsWith(query) ? 1 : name.split(/\s|\//).some(word => word.startsWith(query)) ? 2 : 3;
    return { option, index, matches, rank };
  }).filter(item => item.matches).sort((a, b) => a.rank - b.rank || a.index - b.index).slice(0, limit).map(item => item.option);
}
