// src/view/sections/TabsSection/schema.js
export default {
    label: "Contenedor de Pestañas (Tabs)",
    isContainer: true,
    fields: [
        {
            name: "background_color",
            label: "Color de Fondo del Contenedor",
            type: "color",
            default: "#ffffff"
        },
        {
            name: "tabs_color",
            label: "Color de Texto de Pestañas",
            type: "color",
            default: "#666666"
        },
        {
            name: "indicator_color",
            label: "Color de la línea (Indicador)",
            type: "color",
            default: "var(--color-red-700)"
        },
        {
            name: "alignment",
            label: "Alineación de pestañas",
            type: "select",
            default: "left",
            options: [
                { label: "Izquierda", value: "flex-start" },
                { label: "Centro", value: "center" },
                { label: "Derecha", value: "flex-end" }
            ]
        },
        {
            name: "variant",
            label: "Estilo de pestañas",
            type: "select",
            default: "standard",
            options: [
                { label: "Estándar", value: "standard" },
                { label: "Ancho Completo (Full Width)", value: "fullWidth" },
                { label: "Desplazable (Scrollable)", value: "scrollable" }
            ]
        }
    ]
};