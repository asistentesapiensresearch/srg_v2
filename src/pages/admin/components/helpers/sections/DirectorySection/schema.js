export default {
    label: "Directorio Inteligente",
    icon: "BookUser",
    fields: [
        {
            name: "sourceConfig",
            label: "Conexión de Datos",
            type: "data_source_manager",
            default: { type: 'sheet', url: '' }
        },
        {
            name: "viewType",
            label: "Diseño Visual",
            type: "select",
            default: "grid",
            options: [
                { label: "Cuadrícula (Cards)", value: "grid" },
                { label: "Lista Compacta", value: "list" }
            ]
        },
        {
            name: "quickFilters",
            label: "Filtros Rápidos (Botones)",
            type: "jsonCode",
            default: JSON.stringify([
                { label: "Todos", filters: {} },
                { label: "Aliados", filters: { "Vinculada": "Si" } }
            ], null, 2),
            help: "Formato JSON: Un array de objetos con 'label' y el objeto 'filters' de Excel."
        },

        // 🔥 SECCIÓN: ENRIQUECIMIENTO DE DATOS
        {
            name: "enrichment_settings",
            label: "Vinculación con Base de Datos (Instituciones)",
            type: "separator"
        },
        {
            name: "enableEnrichment",
            label: "Activar Enriquecimiento de Datos",
            type: "boolean",
            default: false,
            help: "Si se activa, el sistema buscará la institución en la base de datos y completará la información faltante (Logo, Rector, Redes, etc)."
        },
        {
            name: "enrichmentKey",
            label: "Columna de Coincidencia (Excel)",
            type: "text",
            default: "Institucion",
            help: "Nombre exacto de la columna en el Excel que contiene el nombre de la institución para buscarla en la BD (ej: 'Nombre Colegio').",
        },

        // 🔥 UPDATE: CAMPO TIPO (SELECT) BASADO EN ENUM InstitutionType
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
            ],
            help: "Optimización: Solo busca instituciones de este tipo en la BD para evitar falsos positivos."
        },

        // 🔥 UPDATE: CAMPO SUBTIPO (SELECT) BASADO EN ENUM InstitutionSubtype
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
            ],
            help: "Optimización: Solo busca instituciones de este subtipo (ej: 'Privada')."
        },

        // AGRUPACIÓN HISTÓRICA
        {
            name: "grouping_settings",
            label: "Configuración de Agrupación (Histórico)",
            type: "separator"
        },
        {
            name: "groupByColumn",
            label: "Columna para Agrupar (ID Único)",
            type: "text",
            help: "Nombre exacto de la columna que identifica al registro (ej: 'Colegio', 'NIT', 'Nombre').",
            default: ""
        },
        {
            name: "versionColumn",
            label: "Columna de Versión/Vigencia",
            type: "text",
            help: "Nombre exacto de la columna que diferencia las versiones (ej: 'Año', 'Vigencia').",
            default: ""
        },
        {
            name: "targetVersion",
            label: "Valor Principal a Mostrar",
            type: "text",
            help: "El valor de la columna 'Versión' que debe salir en la tarjeta principal (ej: '2025-2026').",
            default: ""
        },

        // OPCIONES VISUALES
        { name: "itemsPerColumn", label: "Items por fila", type: "number", default: 3 },
        { name: "showAds", label: "Activar Publicidad Inmersa", type: "switch", default: true },
        { name: "itemsPerAds", label: "Publicidad cada (X) items", type: "number", default: 3 },
        { name: "primaryColor", label: "Color de Acento", type: "color", default: "#c10008" }
    ]
};