export interface RuleException {
  location: string;
  details: string;
}

export interface RegionRegulation {
  id: string;
  name: string;
  generalSeason: string;
  generalLimit: string;
  exceptions: RuleException[];
  pdfUrl?: string;
}

// Data de prueba temporal. Cuando tengas el archivo final, reemplazaremos esto.
export const regulationsData: RegionRegulation[] = [
  {
    id: "arica-y-parinacota",
    name: "Región de Arica y Parinacota",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "tarapaca",
    name: "Región de Tarapacá",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "antofagasta",
    name: "Región de Antofagasta",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "atacama",
    name: "Región de Atacama",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "coquimbo",
    name: "Región de Coquimbo",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "valparaiso",
    name: "Región de Valparaíso",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "metropolitana",
    name: "Región Metropolitana",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "ohiggins",
    name: "Región de O'Higgins",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "maule",
    name: "Región del Maule",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "nuble",
    name: "Región de Ñuble",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "biobio",
    name: "Región del Biobío",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "araucania",
    name: "Región de La Araucanía",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "los-rios",
    name: "Región de Los Ríos",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "los-lagos",
    name: "Región de Los Lagos",
    generalSeason: "2do viernes de Noviembre al 1er domingo de Mayo",
    generalLimit: "Máximo 3 piezas o 15kg por pescador.",
    exceptions: [
      { location: "Río Petrohué", details: "Pesca con mosca y devolución obligatoria. Cierre anticipado." },
      { location: "Lago Llanquihue", details: "Límite de 2 piezas, se prohíbe arrastre." }
    ],
    pdfUrl: "https://ejemplo.com/pdf-los-lagos.pdf"
  },
  {
    id: "aysen",
    name: "Región de Aysén",
    generalSeason: "2do viernes de Octubre al 1er domingo de Mayo",
    generalLimit: "En desarrollo...",
    exceptions: [],
  },
  {
    id: "magallanes",
    name: "Región de Magallanes",
    generalSeason: "En desarrollo...",
    generalLimit: "En desarrollo...",
    exceptions: [],
  }
];
