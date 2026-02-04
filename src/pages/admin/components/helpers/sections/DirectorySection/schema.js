// src/pages/admin/components/helpers/sections/DirectorySection/schema.js
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
            default: "list",
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

        { name: "itemsPerColumn", label: "Items por fila", type: "number", default: 3 },
        { name: "showAds", label: "Activar Publicidad Inmersa", type: "switch", default: true },
        { name: "itemsPerAds", label: "Publicidad cada (X) items", type: "number", default: 3 },
        { name: "primaryColor", label: "Color de Acento", type: "color", default: "#c10008" }
    ]
};