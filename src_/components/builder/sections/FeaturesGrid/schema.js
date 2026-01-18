// src/components/builder/sections/FeaturesGrid/schema.js
export default {
    label: "Grid",
    fields: [
        { name: "columns", label: "Número de Columnas (1-12)", type: "number", default: "3", min: 0, max: 12 },
        { name: "title", label: "Título Principal", type: "text", default: "Bienvenido" },
        {
            name: "align_title",
            label: "Alineación del título",
            type: "select",
            default: "left",
            options: [
                { label: "Izquierda", value: "left" },
                { label: "Centro", value: "center" },
                { label: "Derecha", value: "end" }
            ]
        },
        { name: "desc", label: "Descripción", type: "textarea", default: "Descripción aquí" },
        {
            name: "align_desc",
            label: "Alineación de la descripción",
            type: "select",
            default: "left",
            options: [
                { label: "Izquierda", value: "left" },
                { label: "Centro", value: "center" },
                { label: "Derecha", value: "end" }
            ]
        },
        { name: "title_color", label: "Color título", type: "color", default: "#000000" },
        { name: "desc_color", label: "Color descripción ", type: "color", default: "#000000" },
        { name: "background_color", label: "Color de Fondo", type: "color", default: "#f5f5f5" }
    ]
};