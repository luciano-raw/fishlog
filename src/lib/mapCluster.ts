export type ClusterPointType = "catch" | "spot" | "hazard" | "shop";

const categories = [
  { type: "catch", color: "#a4ff3d", label: "capturas" },
  { type: "spot", color: "#3b82f6", label: "spots" },
  { type: "hazard", color: "#ef4444", label: "peligros" },
  { type: "shop", color: "#fcd34d", label: "tiendas" },
] as const;

export function clusterAppearance(types: ClusterPointType[]) {
  const groups = categories.map(category => ({ ...category, count: types.filter(type => type === category.type).length })).filter(category => category.count > 0);
  const total = types.length;
  const mixed = groups.length > 1;
  let position = 0;
  const stops = groups.map(group => {
    const start = position;
    position += group.count / total * 100;
    return `${group.color} ${start.toFixed(3)}% ${position.toFixed(3)}%`;
  });
  return {
    total, mixed,
    warning: mixed && groups.some(group => group.type === "hazard"),
    background: mixed ? `conic-gradient(${stops.join(", ")})` : groups[0]?.color ?? "#1A1F1B",
    label: `${total} puntos: ${groups.map(group => `${group.count} ${group.label}`).join(", ")}. Toca para ampliar.`,
  };
}

export function clusterHtml(types: ClusterPointType[]) {
  const cluster = clusterAppearance(types);
  return `<div class="fishlog-cluster${cluster.mixed ? " fishlog-cluster-mixed" : ""}" style="background:${cluster.background}" role="img" aria-label="${cluster.label}" title="${cluster.label}"><span class="fishlog-cluster-count">${cluster.total}</span>${cluster.warning ? '<span class="fishlog-cluster-warning" aria-hidden="true"><svg viewBox="0 0 24 24" width="17" height="17" fill="#ef4444" stroke="#fff" stroke-width="1.6"><path d="M10.3 3.8 1.8 18.5A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.5L13.7 3.8a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r=".7" fill="#fff" stroke="none"/></svg></span>' : ""}</div>`;
}
