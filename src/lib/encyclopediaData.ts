export interface Species {
  id: string;
  name: string;
  scientificName: string;
  imageUrl?: string;
  description: string;
  habitat: string;
  recommendedLures: string;
}

export const encyclopediaData: Species[] = [
  {
    id: "trucha-fario",
    name: "Trucha Fario / Café",
    scientificName: "Salmo trutta",
    description: "Es un salmónido muy apreciado por los pescadores deportivos. Se caracteriza por su patrón de manchas rojas y negras rodeadas de un halo claro. Tienen un comportamiento territorial y cauteloso.",
    habitat: "Habita en ríos y lagos de aguas frías y bien oxigenadas, escondiéndose bajo troncos, rocas y pozones oscuros.",
    recommendedLures: "Moscas secas (ej. Elk Hair Caddis, Adams), ninfas (Hare's Ear, Pheasant Tail), y cucharillas giratorias pequeñas."
  },
  {
    id: "salmon-chinook",
    name: "Salmón Chinook / Rey",
    scientificName: "Oncorhynchus tshawytscha",
    description: "El más grande de los salmones del Pacífico. Es una especie anádroma que viaja desde el mar hacia los ríos para desovar y morir. Destaca por su gran tamaño y fuerza descomunal.",
    habitat: "Cuencas caudalosas del sur de Chile, destacando ríos como el Toltén, Imperial, Puelo, Petrohué y varias cuencas de Aysén.",
    recommendedLures: "Cucharillas muy pesadas (vibrax #5 o #6), señuelos articulados tipo caimán, y moscas grandes (Intruders) en colores fucsia o chartreuse."
  },
  {
    id: "pejerrey-chileno",
    name: "Pejerrey Chileno",
    scientificName: "Basilichthys australis",
    description: "Pez nativo endémico de Chile. Posee un cuerpo alargado y plateado. Es una especie de gran valor patrimonial y deportivo que actualmente se encuentra protegida con vedas estrictas.",
    habitat: "Ríos de aguas templadas a frías desde la Región de Coquimbo hasta la Región de Los Lagos.",
    recommendedLures: "Pesca con mosca usando pequeñas ninfas y emergentes (tamaños #16 al #20). Equipos ultraligeros."
  }
];
