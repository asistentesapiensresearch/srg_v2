export default {
    label: "Carga Base de Datos",
    icon: "Database",
    isContainer: false,
    fields: [
        {
            name: "modelName",
            label: "Tabla / Modelo (BD)",
            type: "select",
            default: "Institution",
            options: [
                { label: "Institución (Institution)", value: "Institution" },
                { label: "Investigación (Research)", value: "Research" }
            ],
        },
        {
            name: "searchField",
            label: "Campo a filtrar",
            type: "text",
            default: "id",
            help: "Ej: id, name, slug",
        },
        {
            name: "searchValue",
            label: "Valor a buscar",
            type: "text",
            default: "",
            help: "Ej: 1, John Doe, john-doe"
        }
    ]
};