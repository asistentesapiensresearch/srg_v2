// src/view/sections/FeaturesGrid/schema.js
export default {
    label: "Grid Responsivo",
    isContainer: true,
    fields: [
        { name: "layout_settings", label: "📐 ESTRUCTURA DE COLUMNAS", type: "separator" },
        {
            name: "columns_desktop",
            label: "Columnas en PC (Desktop)",
            type: "number",
            default: 3,
            min: 1,
            max: 12
        },
        {
            name: "columns_tablet",
            label: "Columnas en Tablet",
            type: "number",
            default: 2,
            min: 1,
            max: 12
        },
        {
            name: "columns_mobile",
            label: "Columnas en Móvil",
            type: "number",
            default: 1,
            min: 1,
            max: 12
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
        { name: "background_color", label: "Color de Fondo", type: "color", default: "#ffffff" },
        { name: "padding_y", label: "Padding Vertical", type: "number", default: 8 }
    ]
};