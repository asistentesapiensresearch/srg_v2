export default {
    label: "Grid Responsivo",
    icon: "LayoutGrid",
    isContainer: true,
    fields: [
        { name: "layout_settings", label: "📐 ESTRUCTURA DE COLUMNAS", type: "separator" },
        {
            name: "layout_type",
            label: "Tipo de Distribución",
            type: "select",
            default: "even",
            options: [
                { label: "Columnas Iguales", value: "even" },
                { label: "Anchos Personalizados", value: "custom" }
            ],
            help: "Elige si todas las celdas miden lo mismo o si tienen anchos diferentes."
        },

        // --- MODO: COLUMNAS IGUALES ---
        { name: "columns_desktop", label: "Columnas PC", type: "number", default: 3, min: 1, max: 12, condition: "layout_type === 'even'" },
        { name: "columns_tablet", label: "Columnas Tablet", type: "number", default: 2, min: 1, max: 12, condition: "layout_type === 'even'" },
        { name: "columns_mobile", label: "Columnas Móvil", type: "number", default: 1, min: 1, max: 12, condition: "layout_type === 'even'" },

        // --- MODO: PERSONALIZADO ---
        {
            name: "custom_desktop",
            label: "Anchos en PC (Suman 12)",
            type: "text",
            default: "5,7",
            condition: "layout_type === 'custom'",
            help: "MUI usa 12 columnas. Ej: 6,6 (50/50) | 5,7 (~40/60) | 4,8 (33/66) | 3,6,3"
        },
        {
            name: "custom_tablet",
            label: "Anchos en Tablet (Suman 12)",
            type: "text",
            default: "6,6",
            condition: "layout_type === 'custom'"
        },
        {
            name: "custom_mobile",
            label: "Anchos en Móvil (Suman 12)",
            type: "text",
            default: "12,12",
            condition: "layout_type === 'custom'",
            help: "Generalmente en móvil queremos 12 (100%) para cada elemento."
        },

        {
            name: "gap",
            label: "Espaciado (Gap)",
            type: "number",
            default: 3,
            help: "Espacio entre celdas"
        },
        { name: "style_settings", label: "🎨 ESTILO Y DISEÑO", type: "separator" },
        { name: "title", label: "Título de la Sección", type: "text", default: "" },
        { name: "padding_y", label: "Padding Vertical", type: "number", default: 8 },
        {
            name: "isBackground",
            label: "Habilitar color de fondo",
            type: "boolean",
            default: false,
        },
        { name: "background_color", label: "Color de Fondo", type: "color", default: "#ffffff", condition: "isBackground === true"},
    ]
};