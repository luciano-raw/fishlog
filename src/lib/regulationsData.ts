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

export const regulationsData: RegionRegulation[] = [
  {
    id: "nacional",
    name: "🇨🇱 Normas Nacionales y Pesca Marítima",
    generalSeason: "Todo el año (sujeto a veda por especie)",
    generalLimit: "Máximo 10 ejemplares por jornada en mar.",
    exceptions: [
      {
        location: "Pesca Marítima (Límites por especie)",
        details: "Bonito (6), Sierra (6), Baunco (5), Pintacha o bilagay (5), Rollizo (5), Roncacho o lorna (5), Sargo (5), Toremo o vidriola (4), Corvina (3), Lenguado (3), Acha (1), Pejeperro (1), Salmón chinook en mar (1), Vieja negra (1). Devolución obligatoria: Tollo común y Pejegallo."
      },
      {
        location: "Pesca Marítima (Vedas y Tallas)",
        details: "Corvina: Veda 1 oct a 30 nov. \nLenguado común: Talla mínima 40 cm. \nMerluza común: Veda 1 a 30 septiembre. \nJurel: Talla mínima 26 cm horquilla (Arica a Los Lagos). \nCojinoba del norte: Veda 1 a 31 agosto, mín 30 cm (Arica a Coquimbo)."
      },
      {
        location: "Prevención Didymo",
        details: "Remover, lavar y secar equipos, embarcaciones y vehículos. Inmersión 1 a 2 min en solución 500 ml lavalozas por 10 L agua. No verter agua de limpieza al río."
      },
      {
        location: "Especies Nativas (Peces de agua dulce)",
        details: "Evitar captura dirigida y devolver: Cauque, Pejerrey del norte, Bagre grande, Bagrecito, Carmelita, Trucha negra, Puye chico."
      },
      {
        location: "Restricción Nocturna Nacional",
        details: "Desde embarcaciones, prohibido de 21:00 a 06:00 a menos de 500m de desembocaduras y desagües."
      }
    ]
  },
  {
    id: "arica-y-parinacota",
    name: "Región de Arica y Parinacota",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Nota regional",
        details: "Diferenciar reglas de aguas continentales de las de mar."
      }
    ]
  },
  {
    id: "tarapaca",
    name: "Región de Tarapacá",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Peces nativos",
        details: "La regla regional no autoriza la captura de peces nativos protegidos."
      }
    ]
  },
  {
    id: "antofagasta",
    name: "Región de Antofagasta",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Aguas Altoandinas",
        details: "Consultar protección específica de aguas altoandinas."
      }
    ]
  },
  {
    id: "atacama",
    name: "Región de Atacama",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Pesca de Mar (Cojinoba del norte)",
        details: "Veda del 1 al 31 de agosto. Talla mínima 30 cm."
      }
    ]
  },
  {
    id: "coquimbo",
    name: "Región de Coquimbo",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Pesca de Mar (Cojinoba del norte)",
        details: "Veda del 1 al 31 de agosto. Talla mínima 30 cm."
      }
    ]
  },
  {
    id: "valparaiso",
    name: "Región de Valparaíso",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Estero Ojos de Agua y afluentes",
        details: "Cierre permanente. Se prohíbe la pesca indefinidamente desde su nacimiento hasta desembocar en el río Juncal."
      }
    ]
  },
  {
    id: "metropolitana",
    name: "Región Metropolitana",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Aguas Continentales",
        details: "Sin litoral; se aplican las reglas generales de agua dulce según el lugar."
      }
    ]
  },
  {
    id: "ohiggins",
    name: "Región de O'Higgins",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Cuerpos de Agua",
        details: "Existen diferencias entre pesca de costa marina y pesca en embalses/ríos. Revisar normativa específica."
      }
    ]
  },
  {
    id: "maule",
    name: "Región del Maule",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Pejerrey Chileno",
        details: "Temporada: 16 dic a 15 ago. Veda: 16 ago a 15 dic. Máximo 15 ejemplares por día."
      },
      {
        location: "Pejerrey Argentino",
        details: "Ríos y esteros: 16 dic a 15 ago. Lagunas, embalses y tranques: Todo el año. Máximo 73 ejemplares."
      },
      {
        location: "Pesca de Costa",
        details: "Corvina: Veda oct-nov. Lenguado: Talla min 40cm, máx 3. Pejegallo y tollo común: Devolución obligatoria."
      },
      {
        location: "Especies Nativas",
        details: "Cauque del Maule no es pejerrey argentino, requiere protección."
      }
    ]
  },
  {
    id: "nuble",
    name: "Región de Ñuble",
    generalSeason: "16 de octubre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: []
  },
  {
    id: "biobio",
    name: "Región del Biobío",
    generalSeason: "16 de octubre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: []
  },
  {
    id: "araucania",
    name: "Región de La Araucanía",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Cuencas de Toltén e Imperial (Salmón Chinook)",
        details: "Temporada: 15 de septiembre al 31 de marzo. Límite: 1 ejemplar sin límite de peso. Hay cierres territoriales específicos (ej. puente Medina del Allipén)."
      },
      {
        location: "Restricción Nocturna",
        details: "Se prohíbe toda pesca continental desde una hora después de la puesta de sol hasta una hora antes del amanecer."
      }
    ]
  },
  {
    id: "los-rios",
    name: "Región de Los Ríos",
    generalSeason: "9 de octubre 2026 al 30 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Restricción Nocturna Regional",
        details: "Prohibición de 22:00 a 06:00."
      },
      {
        location: "Humedal Huitag (Lago Calafquén)",
        details: "Zona de exclusión para pesca recreativa."
      },
      {
        location: "Río Calcurrupe (y afluentes / radios Maihue y Ranco)",
        details: "Truchas: Devolución obligatoria, señuelo simple, anzuelos sin rebarba.\nChinook: Hasta 3 ejemplares sin límite de peso."
      },
      {
        location: "Coñaripe, Neltume, Fuy, Enco, Mañío y San Pedro",
        details: "Medidas exclusivas de pesca con mosca, anzuelo sin rebarba, devolución y temporadas propias."
      },
      {
        location: "Huishue, Gris y cursos señalados",
        details: "Solo mosca, anzuelo simple sin rebarba y devolución obligatoria."
      }
    ]
  },
  {
    id: "los-lagos",
    name: "Región de Los Lagos",
    generalSeason: "13 de noviembre 2026 al 2 de mayo 2027",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Restricción Nocturna Regional",
        details: "Restricción de 22:00 a 06:00 para aguas especiales."
      },
      {
        location: "Llanquihue, Rupanco, Puyehue, Maullín, Rahue, Pilmaiquén, Puelo",
        details: "Apertura anticipada: 4 sep al 12 nov. Devolver TODAS las capturas."
      },
      {
        location: "Llanquihue, Rupanco, Puyehue, Maullín, Pilmaiquén",
        details: "Temporada general: 2do viernes nov a 1er domingo mayo.\nDevolver truchas/nativas. Máx conjunto: 1 salar, coho o chinook."
      },
      {
        location: "Cuenca Puelo y Río Rahue",
        details: "Temporada: 2do viernes nov al 31 de mayo.\nDevolver truchas/nativas. Máx conjunto: 1 salar, coho o chinook."
      },
      {
        location: "Provincia de Palena, Río Petrohué y Lago Todos Los Santos",
        details: "Temporada: 1 de nov al 1er domingo de mayo.\nMáximo: 1 salar, coho o chinook; devolver las demás."
      },
      {
        location: "Aparejos Permitidos",
        details: "En estas aguas especiales, rige señuelo artificial con anzuelo simple sin rebarba."
      }
    ]
  },
  {
    id: "aysen",
    name: "Región de Aysén",
    generalSeason: "12 de octubre al 6 de mayo",
    generalLimit: "Dinámico (Ver excepciones por períodos)",
    exceptions: [
      {
        location: "Ríos (Salvo Chinook)",
        details: "12 oct a 30 nov: Devolución obligatoria.\n1 dic a 28 feb: Retención (3 ejemp / 15 kg).\n1 mar a 6 mayo: Devolución obligatoria."
      },
      {
        location: "Lagos (Salvo Chinook)",
        details: "12 oct a 9 nov: Devolución obligatoria.\n10 nov a 1 abr: Retención (3 ejemp / 15 kg).\n2 abr a 6 mayo: Devolución obligatoria."
      },
      {
        location: "Salmón Chinook",
        details: "Temporada: 12 oct al 15 ene. Hasta 2 ejemplares sin límite de peso. Veda: 16 ene al 11 oct."
      },
      {
        location: "Río Paloma",
        details: "Solo devolución toda la temporada. Zonas de desove prohibidas."
      }
    ]
  },
  {
    id: "magallanes",
    name: "Región de Magallanes",
    generalSeason: "16 de octubre al 14 de abril",
    generalLimit: "Hasta 3 ejemplares / 15 kg.",
    exceptions: [
      {
        location: "Áreas de desembocadura",
        details: "Cierre anticipado el 28 de febrero para áreas hasta 5km hacia el interior."
      },
      {
        location: "Lago Fagnano",
        details: "Temporada de pesca: Todo el año."
      },
      {
        location: "Laguna Parrillar (Trucha de arroyo)",
        details: "Temporada: 16 oct al 28 feb. Devolución obligatoria, anzuelo sin rebarba."
      },
      {
        location: "Lagos Deseado y Despreciado, Ríos Grande, Blanco y García",
        details: "Devolución obligatoria, señuelo artificial simple y anzuelo sin rebarba."
      }
    ]
  }
];
