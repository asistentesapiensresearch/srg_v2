export default {
    label: "Rector Section",
    icon: "Maximize",
    isContainer: true,
    fields: [
        {
            name: "provider",
            label: "Tipo de contenido a renderizar",
            type: "select",
            default: "googleMap",
            options: [
                { label: "Google Maps", value: "googleMap" },
                { label: "Instagram", value: "instagram" },
                { label: "Facebook", value: "facebook" },
            ],
        },
        {
            name: "height",
            label: "Altura (px)",
            type: "number",
            default: 500
        },
        {
            name: "borderRadius",
            label: "Bordes Redondeados",
            type: "number",
            default: 6
        },
        {
            name: "shadow",
            label: "Sombra",
            type: "boolean",
            default: true
        },
        { name: "shadowColor", label: "Color de la sombra", type: "color", default: "rgba(0,0,0,0.08)" },
    ]
};