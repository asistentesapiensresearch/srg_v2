export default {
    label: "Header Portada",
    icon: "AppWindow",
    isContainer: false,
    fields: [
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
    ]
};