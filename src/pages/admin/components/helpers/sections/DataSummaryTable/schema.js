export default {
    label: "Tabla de Ficha Técnica",
    icon: "TableProperties",
    fields: [
        { name: "data_settings", label: "🔌 CONEXIÓN Y BÚSQUEDA", type: "separator" },
        {
            name: "sourceConfig",
            label: "Conexión de Datos",
            type: "data_source_manager",
            default: { type: 'sheet', url: '' }
        },
        {
            name: "filterField",
            label: "Columna de Búsqueda (Alias)",
            type: "text",
            default: "id_institucion",
            help: "Alias de la columna para buscar la entidad (ej: id_colegio)"
        },
        {
            name: "filterValue",
            label: "Valor a Buscar",
            type: "text",
            default: "COL-001",
            help: "El valor exacto de la entidad que deseas mostrar."
        },

        // 🔥 SECCIÓN: ENRIQUECIMIENTO DE DATOS (IGUAL AL DIRECTORIO)
        { name: "enrichment_settings", label: "🔗 ENRIQUECIMIENTO (BD)", type: "separator" },
        {
            name: "enableEnrichment",
            label: "Activar Enriquecimiento de Datos",
            type: "boolean",
            default: false,
        },
        {
            name: "enrichmentKey",
            label: "Columna de Coincidencia (Alias)",
            type: "text",
            default: "nombre",
        },
        {
            name: "enrichmentType",
            label: "Filtrar BD por Tipo (Opcional)",
            type: "select",
            default: "",
            options: [
                { label: "Cualquiera (Sin filtro)", value: "" },
                { label: "Educativa", value: "EDUCATIONAL" },
                { label: "Organizacional", value: "ORGANIZATIONAL" },
                { label: "Otra", value: "OTHER" }
            ]
        },
        {
            name: "enrichmentSubtype",
            label: "Filtrar BD por Subtipo (Opcional)",
            type: "select",
            default: "",
            options: [
                { label: "Cualquiera (Sin filtro)", value: "" },
                { label: "Universidad", value: "university" },
                { label: "Colegio / Escuela", value: "school" },
                { label: "ONG", value: "ngo" },
                { label: "Gubernamental", value: "governmental" },
                { label: "Privada", value: "private" },
                { label: "Pública", value: "public" }
            ]
        },

        // 🔥 SECCIÓN: AGRUPACIÓN HISTÓRICA
        { name: "grouping_settings", label: "📚 VERSIÓN Y VIGENCIA", type: "separator" },
        {
            name: "versionColumn",
            label: "Columna de Versión/Vigencia (Alias)",
            type: "text",
            help: "Columna que diferencia las versiones (ej: 'year').",
            default: ""
        },
        {
            name: "targetVersion",
            label: "Valor Principal a Mostrar",
            type: "text",
            help: "El valor de la columna 'Versión' que debe salir en esta tabla (ej: '2025-2026'). Si se deja vacío, tomará el más reciente.",
            default: ""
        },

        // CONFIGURACIÓN VISUAL
        { name: "table_settings", label: "📐 ESTRUCTURA DE LA TABLA", type: "separator" },
        {
            name: "tableLayout",
            label: "Configuración de Filas (JSON)",
            type: "jsonCode",
            default: JSON.stringify([
                [
                    { "label": "Sector:", "field": "sector" },
                    { "label": "Calendario:", "field": "calendario" }
                ],
                [
                    { "label": "Rectoría:", "field": "rectorName", "type": "link", "urlField": "rectorSocial", "icon": "linkedin", "colSpan": 2 }
                ],
                [
                    { "label": "", "field": "email", "type": "email", "icon": "mail", "colSpan": 2 }
                ]
            ], null, 2)
        },
        
        { name: "style_settings", label: "🎨 ESTILOS", type: "separator" },
        { name: "borderColor", label: "Color de Bordes", type: "color", default: "#e5e7eb" },
        { name: "labelColor", label: "Color de Etiquetas", type: "color", default: "#1f2937" }
    ]
};