export default {
    label: "Embed Contenido",
    icon: "Maximize",
    isContainer: false,
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
            name: "dataSourceMode",
            label: "Modo de Origen",
            type: "select",
            default: "context",
            options: [
                { label: "Buscar en Base de Datos", value: "custom" }
            ],
            help: "Automático usa los datos de la página actual. Buscar te permite traer redes de cualquier registro."
        },
        {
            name: "modelName",
            label: "Tabla / Modelo (BD)",
            type: "select",
            default: "Institution",
            options: [
                { label: "Institución (Institution)", value: "Institution" },
                { label: "Investigación (Research)", value: "Research" }
            ],
            condition: "dataSourceMode === 'custom'"
        },
        {
            name: "searchField",
            label: "Campo a filtrar",
            type: "text",
            default: "id",
            help: "Ej: id, name, slug",
            condition: "dataSourceMode === 'custom'"
        },
        {
            name: "searchValue",
            label: "Valor a buscar",
            type: "text",
            default: "",
            help: "El valor exacto para encontrar el registro.",
            condition: "dataSourceMode === 'custom'"
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