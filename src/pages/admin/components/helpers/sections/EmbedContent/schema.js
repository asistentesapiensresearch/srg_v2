export default {
    label: "Embed Contenido",
    icon: "Maximize",
    isContainer: false,
    fields: [
        {
            name: "url",
            label: "URL del Contenido",
            type: "text",
            default: "",
            placeholder: "https://...",
            help: "Pega la URL del mapa, página de Facebook o post de Instagram"
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