export default {
    label: "Header Portada",
    icon: "AppWindow",
    isContainer: true,
    fields: [
        {
            name: "typePage",
            label: "Seleccione para que tipo de página es el Header",
            type: "select",
            default: "micro-col",
            options: [
                { label: "Investigaciones", value: "investigation" },
                { label: "Micrositios Colegio", value: "micro-col" },
                { label: "Micrositios Universidad", value: "micro-uni" },
            ],
        },
        {
            name: "data_settings",
            label: "🔌 CONEXIÓN Y BÚSQUEDA",
            type: "separator",
            condition: "typePage === 'micro-col' || typePage === 'micro-uni'"
        },
        // Fuente de datos, importante mantener esto actualizado en todos los schemas que lo usen
        {
            name: "excelSource",
            label: "Seleccionar Fuente de Datos Archivo Excel",
            type: "select",
            default: "M-TOP",
            options: [
                { label: "U-Sapiens", value: "U" },
                { label: "ASC-Sapiens", value: "ASC" },
                { label: "Mejores ASC", value: "M-ASC" },
                { label: "ART-Sapiens", value: "ART" },
                { label: "Mejores ART", value: "M-ART" },
                { label: "DTI-Sapiens", value: "DTI" },
                { label: "Mejores DTI", value: "M-DTI" },
                { label: "GNC-Sapiens", value: "GNC" },
                { label: "Mejores GNC", value: "M-GNC" },
                { label: "FRH-Sapiens", value: "FRH" },
                { label: "Mejores FRH", value: "M-FRH" },
                { label: "REV-Sapiens", value: "REV" },
                { label: "POST-Sapiens", value: "POST" },
                { label: "PRE-Sapiens", value: "PRE" },
                { label: "Col-Sapiens", value: "COL" },
                { label: "100 Mejores por Materia", value: "M-TOP" },
                { label: "Micrositios / Universidades / Encuentra / Grupos", value: "E-Grupos"},
                { label: "Micrositios / Universidades / Encuentra / Revistas", value: "E-Revistas"},
                { label: "Micrositios / Colegios / Posiciones", value: "Micro-Posionamiento"}
            ],
            condition: "typePage === 'micro-col' || typePage === 'micro-uni'"
        },
        {
            name: "property_header",
            label: "Propiedades para el header",
            type: "separator",
            condition: "typePage === 'investigation'"
        },
        // Imagen
        {
            name: "src",
            label: "Imagen",
            type: "image_uploader", // 🔥 Tipo especial para usar FileUploader
            default: "",
            help: "Sube una imagen desde tu computadora",
            condition: "typePage === 'investigation'"
        },
        // fin
        {
            name: "country",
            label: "País",
            type: "text",
            default: "Colombia",
            help: "Escriba el país donde corresponda el análisis",
            condition: "typePage === 'investigation'"
        },
        {
            name: "title",
            label: "Título",
            type: "text",
            default: "Ranking Col-Sapiens 2025-2026",
            help: "Escriba el título del header",
            condition: "typePage === 'investigation'"
        },
        {
            name: "subtitle",
            label: "Subtítulo",
            type: "text",
            default: "versión #13 del 9-sep-2025",
            help: "Escriba el subtitulo del header, ej: versión #13 del  9-sep-2025",
            condition: "typePage === 'investigation'"
        },
        {
            name: "shortDescription",
            label: "Descripción corta",
            type: "text",
            default: "Descripción corta.....",
            help: "Escriba la descrición corta del header...",
            condition: "typePage === 'investigation'"
        },
        {
            name: "itemsHighlights",
            label: "Items para el detallado de Highlights. Se recomienda no poner más de 8 items, si pone más de 8 que sea un número par, ejemplo 10,12,14 .... items",
            type: "list",
            fields: [
                {
                    name: "label",
                    label: "Título",
                    type: "text"
                },
                {
                    name: "value",
                    label: "Texto",
                    type: "text"
                }
            ],
            condition: "typePage === 'investigation'"
        },
        {
            name: "data_settings",
            label: "Perzonalización de Estilos",
            type: "separator"
        },
        {
            name: "height",
            label: "Altura",
            type: "text",
            default: "400px",
            help: "Ej: 400px, 50vh, auto"
        },
    ]
};