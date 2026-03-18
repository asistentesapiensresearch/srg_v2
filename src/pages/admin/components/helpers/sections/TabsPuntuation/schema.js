export default {
    label: "Tabs puntuación",
    icon: "Star",
    isContainer: false,
    fields: [
        {
            name: "data_settings",
            label: "🔌 CONEXIÓN Y BÚSQUEDA",
            type: "separator"
        },
        {
            name: "sourceConfig",
            label: "Conexión de Datos",
            type: "data_source_manager",
            default: { type: 'sheet', url: '' }
        },
        {
            name: "filterField",
            label: "Columna de Búsqueda (Alias)",
            type: "text",
            default: "id_institucion",
            help: "Alias de la columna para buscar la entidad (ej: id_colegio)"
        },
        {
            name: "filterValue",
            label: "Valor a Buscar",
            type: "text",
            default: "COL-001",
            help: "El valor exacto de la entidad que deseas mostrar."
        },

        //personalizacion de los estilos
        { name: "style_settings", label: "🎨 ESTILOS", type: "separator" },
        { name: "textcolor", label: "Color del Texto", type: "color", default: "#1f2937" },
    ]
}