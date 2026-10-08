# Enciclopedia Chile — versión 1.0, 8 de octubre de 2026

## Archivos
- `enciclopedia_chile.json`: fichas y fuentes; campos equivalentes a descripción, dónde encontrarlo y señuelos/moscas.
- `indice_regional.json`: índice de las 16 regiones, por rango bibliográfico.
- `imagenes_manifest.json`: procedencia, crédito y permiso de cada recurso.
- `imagenes_publicables/`: 7 imágenes declaradas de dominio público por USFWS.
- `imagenes_referencia/`: imágenes extraídas de documentos oficiales, para revisión interna. Su publicación en una app requiere verificar o conseguir permiso del titular.
- `Enciclopedia_Peces_Chile_2026.pdf`: resumen ilustrado con fichas e índice regional.

## Carga sugerida
Usar `id` como clave estable y `nombre_cientifico` para buscar. Conservar alias por separado: “cauque”, “puye”, “tollo” y “lenguado” pueden nombrar especies diferentes. No fusionar fichas por nombre común.

Mostrar únicamente `imagen_publicable` en la app. Si es null, usar una imagen pendiente o un marcador neutro; no reemplazarla por la foto de otra especie. Las imágenes de referencia están fuera de la ruta publicable y nunca deben activarse automáticamente. Conservar crédito y enlace a la fuente incluso para dominio público. Las fotos USFWS identifican la especie: no documentan una captura ni una localidad chilena.

La distribución es una traducción editorial de fuentes con distinta antigüedad; los códigos regionales son propios de este paquete, no códigos administrativos oficiales. No mostrar el índice como “presencia confirmada”. Para una futura capa de lugares, guardar cada registro con cuenca, coordenadas, fecha, autor y evidencia de identificación. No se incluye mapa de puntos porque esta investigación no verifica coordenadas por especie.

Las 17 fichas de reconocimiento y conservación no muestran técnicas de captura. Para las otras fichas, la técnica es orientación editorial general y siempre depende del reglamento vigente del lugar. No codificar permisos, cuotas o temporadas a partir de estos perfiles.

Revisar las categorías RCE actuales aparte: las fichas antiguas a veces mezclan clasificaciones históricas, UICN y normas chilenas. Esta versión evita una insignia legal única cuando no ha sido validada para cada zona.

## Prioridad por hábitat
- Río frío/estero de montaña: truchas donde existan registros; también bagrecitos y otros nativos, sin asumir que todo pez pequeño es una trucha.
- Tramo medio o bajo: perca trucha y pejerreyes según la cuenca; carmelitas, pochas y bagres como fauna para reconocer.
- Aguas lentas y humedales: carpa donde esté introducida; fauna nativa pequeña cerca de vegetación.
- Lagos/embalses: separar del filtro río; pejerrey argentino no se confirma en cualquier embalse por extrapolación.
- Río conectado al mar: distinguir salmones migratorios, puyes y róbalo; la presencia puede variar con el ciclo de vida.

## Derechos del contenido
Los textos de las fichas son síntesis redactadas para esta app, con fuentes citadas. Las ilustraciones y fotografías conservan los derechos de sus autores. Que un archivo esté en un sitio estatal no significa que todas sus imágenes tengan licencia abierta. La guía MMA–ONU de 2025 permite ciertos usos de enseñanza/investigación con cita; eso no acredita por sí solo permiso para redistribución en una app comercial.
