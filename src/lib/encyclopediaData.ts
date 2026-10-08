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
    "id": "trucha_fario",
    "name": "Trucha fario / café",
    "scientificName": "Salmo trutta",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_publicables/trucha_fario.jpg",
    "description": "Trucha de tonos pardos, dorados o plateados. Suele mostrar puntos oscuros y rojos, algunos con halo claro; tiene aleta adiposa. La coloración cambia con el ambiente.",
    "habitat": "Ríos y esteros fríos, claros y oxigenados; pozones, orillas con raíces y refugios junto a piedras. También ocupa lagos.",
    "recommendedLures": "Ninfas de insectos acuáticos; moscas secas durante actividad superficial; streamers y pequeños señuelos artificiales según corriente y profundidad."
  },
  {
    "id": "trucha_arcoiris",
    "name": "Trucha arcoíris",
    "scientificName": "Oncorhynchus mykiss",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_publicables/trucha_arcoiris.jpg",
    "description": "Cuerpo con numerosos puntos negros y, con frecuencia, una banda rosada en los flancos. La cola suele tener puntos; posee aleta adiposa.",
    "habitat": "Corrientes frías y oxigenadas, correderas, entradas de pozones y lagos. La intensidad del flujo y la temperatura ayudan a ubicar hábitats compatibles.",
    "recommendedLures": "Ninfas y moscas secas de insectos; streamers y señuelos pequeños. Adaptar presentación a la profundidad."
  },
  {
    "id": "trucha_arroyo",
    "name": "Trucha de arroyo",
    "scientificName": "Salvelinus fontinalis",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_publicables/trucha_arroyo.jpg",
    "description": "Dorso con dibujos claros sinuosos, puntos rojos con halos azulados y bordes blancos en aletas inferiores. Es un salvelino, aunque se conoce como trucha.",
    "habitat": "Aguas especialmente frías y bien oxigenadas; arroyos y ambientes lacustres adecuados.",
    "recommendedLures": "Pequeñas ninfas, secas y streamers; priorizar presentaciones discretas."
  },
  {
    "id": "salmon_chinook",
    "name": "Salmón chinook / rey",
    "scientificName": "Oncorhynchus tshawytscha",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_publicables/salmon_chinook.jpg",
    "description": "Salmón robusto de gran talla. Presenta puntos oscuros en el dorso y la cola; los machos reproductivos pueden desarrollar mandíbula curvada y tonos oscuros.",
    "habitat": "Ríos conectados al mar, grandes pozones y tramos de migración; su presencia en agua dulce depende del ciclo de vida y de la cuenca.",
    "recommendedLures": "Streamers y señuelos artificiales adecuados al caudal; la ficha no fija una época de retorno local."
  },
  {
    "id": "salmon_coho",
    "name": "Salmón coho / plateado",
    "scientificName": "Oncorhynchus kisutch",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_publicables/salmon_coho.jpg",
    "description": "Salmón de flancos plateados fuera de reproducción; al madurar puede oscurecerse y mostrar tonos rojizos. El aspecto de los juveniles difiere del adulto.",
    "habitat": "Costa, estuarios y algunos cursos conectados al mar del sur. Distinguir presencia asociada a escapes de poblaciones que se reproducen naturalmente.",
    "recommendedLures": "Streamers y señuelos artificiales; comprobar primero presencia y reglas de la cuenca."
  },
  {
    "id": "salmon_atlantico",
    "name": "Salmón del Atlántico",
    "scientificName": "Salmo salar",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_publicables/salmon_atlantico.jpg",
    "description": "Salmón de cuerpo alargado, flancos plateados y manchas oscuras. Tiene aleta adiposa; no basta una fotografía distante para diferenciar todos los salmones.",
    "habitat": "Ambientes marinos y cursos continentales del sur donde existen registros. Parte de la presencia silvestre puede relacionarse con escapes de cultivo.",
    "recommendedLures": "Streamers y señuelos artificiales, sujetos a identificación y normativa local."
  },
  {
    "id": "perca_trucha",
    "name": "Perca trucha",
    "scientificName": "Percichthys trucha",
    "description": "Pez nativo de cuerpo relativamente alto, escamas visibles y dorsal con una sección espinosa y otra blanda. Carece de la pequeña aleta adiposa de los salmonídeos.",
    "habitat": "Lagos y tramos medios o bajos de ríos; fondos pedregosos, bordes de corriente y refugios. Consume invertebrados y peces.",
    "recommendedLures": "Pequeños streamers, imitaciones de invertebrados y señuelos artificiales. Consultar restricciones antes de dirigir la pesca."
  },
  {
    "id": "pejerrey_chileno",
    "name": "Pejerrey chileno",
    "scientificName": "Basilichthys australis",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/pejerrey_chileno.png",
    "description": "Pez alargado con franja longitudinal oscura y plateada. La boca no se proyecta hacia adelante como en los cauques del género Odontesthes.",
    "habitat": "Sectores transparentes de corriente suave, pozones y lagos, frecuentemente cerca de vegetación acuática.",
    "recommendedLures": "Imitaciones pequeñas de insectos e invertebrados; revisar si el método propuesto está permitido."
  },
  {
    "id": "pejerrey_argentino",
    "name": "Pejerrey argentino",
    "scientificName": "Odontesthes bonariensis",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/pejerrey_argentino.png",
    "description": "Pejerrey de cuerpo delgado, franja plateada y boca protráctil. Forma grupos y puede parecerse a pejerreyes nativos; confirmar rasgos antes de asignar especie.",
    "habitat": "Principalmente lagos, lagunas y embalses; aguas abiertas y márgenes según alimento y condiciones.",
    "recommendedLures": "Imitaciones pequeñas de alimento y montajes adecuados a la profundidad; verificar aparejos y carnadas autorizados."
  },
  {
    "id": "carpa",
    "name": "Carpa común",
    "scientificName": "Cyprinus carpio",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_publicables/carpa.jpg",
    "description": "Cuerpo robusto con escamas grandes y barbillas junto a la boca. Busca alimento cerca del fondo y tolera aguas más cálidas que las truchas.",
    "habitat": "Ríos lentos, lagunas, embalses y humedales con fondos blandos o vegetación.",
    "recommendedLures": "Moscas de fondo que imiten pequeños invertebrados; revisar reglas para otros montajes y cebos."
  },
  {
    "id": "cauque_maule",
    "name": "Cauque del Maule",
    "scientificName": "Odontesthes mauleanum",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/cauque_maule.png",
    "description": "Pejerrey nativo de cuerpo alargado y franja lateral plateada, con boca protráctil. El nombre cauque también se aplica informalmente a otros pejerreyes.",
    "habitat": "Tramos bajos de ríos, lagos y ambientes conectados a estuarios.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "pejerrey_norte",
    "name": "Pejerrey del norte",
    "scientificName": "Basilichthys microlepidotus",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/pejerrey_norte.png",
    "description": "Pejerrey pequeño a mediano, alargado, de escamas pequeñas y banda longitudinal. La identificación requiere separarlo de otros Basilichthys.",
    "habitat": "Ríos y cursos de la zona norte y central, con sectores de corriente moderada o lenta.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "pejerrey_loa",
    "name": "Pejerrey del Loa (taxón por resolver)",
    "scientificName": "Basilichthys sp. aff. semotilus",
    "description": "Pejerrey alargado con franja lateral, asociado a aguas del desierto. La ficha histórica utiliza Basilichthys semotilus, pero advierte una diferenciación taxonómica de los ejemplares chilenos.",
    "habitat": "Sistema del río Loa y sectores con vegetación acuática; hábitat muy localizado.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "bagrecito",
    "name": "Bagrecito",
    "scientificName": "Trichomycterus areolatus",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/bagrecito.png",
    "description": "Pez alargado, sin escamas, con tres pares de barbillas y coloración moteada. Permanece cerca del fondo y puede pasar inadvertido entre piedras.",
    "habitat": "Ríos y esteros; fondos de grava y piedras, refugios y sectores con corriente.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "carmelita",
    "name": "Carmelita",
    "scientificName": "Percilia gillissi",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/carmelita.png",
    "description": "Pez nativo pequeño, de cuerpo corto, con dos aletas dorsales y manchas o bandas oscuras. Su tamaño reducido puede llevar a confundirlo con juveniles de otras especies.",
    "habitat": "Ríos, esteros, lagos y humedales; cerca de piedras y vegetación en el fondo o las orillas.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "carmelita_concepcion",
    "name": "Carmelita de Concepción",
    "scientificName": "Percilia irwini",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/carmelita_concepcion.png",
    "description": "Pequeño pez con dos dorsales y patrón de bandas. Diferenciarlo de P. gillissi puede requerir examen especializado; la región por sí sola no basta.",
    "habitat": "Cuencas del centro sur, cerca de sustratos y refugios en ríos y ambientes lacustres.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "bagre_grande",
    "name": "Bagre grande",
    "scientificName": "Nematogenys inermis",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/bagre_grande.png",
    "description": "Bagre de cabeza ancha, cuerpo sin escamas y barbillas alrededor de la boca. Se distingue de bagrecitos, aunque juveniles pueden ser difíciles de separar.",
    "habitat": "Sectores de ríos y esteros con refugios y vegetación; las poblaciones actuales son localizadas y fragmentadas.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "pocha",
    "name": "Pocha",
    "scientificName": "Cheirodon pisciculus",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/pocha.png",
    "description": "Pez pequeño de cuerpo comprimido, plateado y con aleta adiposa. Separar especies de Cheirodon exige revisar rasgos finos, no sólo el color.",
    "habitat": "Ríos, esteros y canales de la zona central; sectores tranquilos con vegetación.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "pocha_lagos",
    "name": "Pocha de los lagos",
    "scientificName": "Cheirodon galusdae",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/pocha_lagos.png",
    "description": "Pequeño pez plateado, comprimido lateralmente y con aleta adiposa. Puede confundirse con otras pochas.",
    "habitat": "Ríos, esteros y canales, generalmente en sectores de baja velocidad y vegetación.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "perca_negra",
    "name": "Perca negra",
    "scientificName": "Percichthys melanops",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/perca_negra.png",
    "description": "Perca nativa de tonos oscuros, con dorsal espinosa y blanda. Puede confundirse con P. trucha; un color oscuro por sí solo no identifica la especie.",
    "habitat": "Ríos y ambientes lacustres del centro sur; fondos y refugios sumergidos.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "puye",
    "name": "Puye",
    "scientificName": "Galaxias maculatus",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/puye.png",
    "description": "Pez pequeño, alargado y sin escamas; las aletas dorsal y anal se sitúan hacia la parte posterior. Puede mostrar cuerpo translúcido y manchas.",
    "habitat": "Orillas de ríos, lagos y estuarios. Existen poblaciones con migración al mar y otras que completan su ciclo en agua dulce.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "puye_grande",
    "name": "Puye grande",
    "scientificName": "Galaxias platei",
    "description": "Puye alargado, sin escamas, de coloración parda y moteada. Alcanza tamaños mayores que otros pequeños galáxidos.",
    "habitat": "Lagos y ríos patagónicos; juveniles en márgenes y adultos frecuentemente en ambientes más profundos.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "peladilla",
    "name": "Peladilla",
    "scientificName": "Aplochiton zebra",
    "description": "Pez alargado con aleta adiposa y bandas oscuras en los flancos. Puede parecer un pequeño salmonídeo, pero pertenece a la fauna nativa.",
    "habitat": "Ríos y lagos del sur; ambientes fríos y conectados según la población.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "puye_rojo",
    "name": "Puye rojo",
    "scientificName": "Brachygalaxias bullocki",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/puye_rojo.png",
    "description": "Pez nativo muy pequeño, sin escamas, con tonalidades que pueden incluir una franja rojiza. No es un alevín de trucha.",
    "habitat": "Esteros, humedales y márgenes con vegetación y corriente lenta.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "karachi_chungara",
    "name": "Karachi de Chungará",
    "scientificName": "Orestias chungarensis",
    "description": "Pequeño pez altiplánico del género Orestias, sin aletas pélvicas. Su identificación debe considerar el lago de origen y rasgos especializados.",
    "habitat": "Lago Chungará, en el altiplano de Arica y Parinacota.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "karachi",
    "name": "Karachi",
    "scientificName": "Orestias agassii",
    "description": "Pez pequeño del altiplano, de cuerpo con escamas y sin aletas pélvicas. Separar especies de Orestias suele requerir especialistas.",
    "habitat": "Cursos, bofedales y humedales altoandinos; la ficha cita Collacagua, Isluga y salar de Huasco, entre otras localidades históricas.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "tollo_agua_dulce",
    "name": "Tollo de agua dulce",
    "scientificName": "Diplomystes nahuelbutaensis",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/tollo_agua_dulce.png",
    "description": "Bagre nativo sin escamas, con un par de barbillas maxilares y aleta adiposa. El nombre “tollo” aquí no corresponde a un tiburón marino.",
    "habitat": "Ríos del centro sur; fondos pedregosos y sectores bien oxigenados, con refugios.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "corvina",
    "name": "Corvina",
    "scientificName": "Cilus gilberti",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/corvina.png",
    "description": "Pez plateado, de cuerpo alargado y aletas dorsales continuas con una hendidura.",
    "habitat": "Playas arenosas y fondos blandos costeros; desembocaduras y zonas con alimento.",
    "recommendedLures": "Señuelos que imiten peces pequeños, adecuados al oleaje y fondo."
  },
  {
    "id": "lenguado",
    "name": "Lenguado chileno / de tres manchas",
    "scientificName": "Paralichthys adspersus",
    "description": "Pez plano, con ambos ojos en un lado del cuerpo y coloración de camuflaje. Las manchas no bastan siempre para separarlo de otros lenguados.",
    "habitat": "Fondos arenosos costeros; se camufla sobre el sustrato.",
    "recommendedLures": "Señuelos pequeños presentados cerca del fondo."
  },
  {
    "id": "robalo",
    "name": "Róbalo",
    "scientificName": "Eleginops maclovinus",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/robalo.png",
    "description": "Pez de cuerpo alargado y dos aletas dorsales, de tonos pardos o grisáceos.",
    "habitat": "Costa, estuarios y tramos bajos de ríos conectados al mar.",
    "recommendedLures": "Imitaciones de pequeños peces e invertebrados; adaptar a corriente y profundidad."
  },
  {
    "id": "pejerrey_mar",
    "name": "Pejerrey de mar",
    "scientificName": "Odontesthes regia",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/pejerrey_mar.png",
    "description": "Pejerrey alargado de flancos plateados, que forma cardúmenes.",
    "habitat": "Bahías, estuarios y aguas costeras; observar grupos cerca de la orilla.",
    "recommendedLures": "Imitaciones pequeñas; comprobar reglas de aparejos."
  },
  {
    "id": "sierra",
    "name": "Sierra",
    "scientificName": "Thyrsites atun",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/sierra.png",
    "description": "Pez muy alargado, de mandíbula prominente y dientes notorios.",
    "habitat": "Aguas costeras y cardúmenes a distintas profundidades.",
    "recommendedLures": "Señuelos que imiten pequeños peces; manipulación cuidadosa por los dientes."
  },
  {
    "id": "rollizo",
    "name": "Rollizo",
    "scientificName": "Pinguipes chilensis",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/rollizo.png",
    "description": "Pez alargado de labios gruesos; puede mostrar bandas de manchas claras.",
    "habitat": "Roqueríos costeros, grietas y fondo marino.",
    "recommendedLures": "Imitaciones de peces o invertebrados cerca del fondo."
  },
  {
    "id": "pejegallo",
    "name": "Pejegallo",
    "scientificName": "Callorhinchus callorynchus",
    "imageUrl": "/encyclopedia/Enciclopedia_Chile/imagenes_referencia/pejegallo.png",
    "description": "Pez cartilaginoso con hocico prominente semejante a una pequeña trompa; no es un pez óseo ni una raya.",
    "habitat": "Fondos costeros blandos, donde busca invertebrados.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  },
  {
    "id": "tollo_comun",
    "name": "Tollo común del norte",
    "scientificName": "Mustelus whitneyi",
    "description": "Tiburón costero de cuerpo esbelto y dos dorsales. La separación de otros Mustelus requiere revisar rasgos especializados.",
    "habitat": "Fondos de la plataforma costera del norte.",
    "recommendedLures": "Consulta técnicas específicas permitidas."
  }
];
