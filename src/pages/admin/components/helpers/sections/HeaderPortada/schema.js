export default {
    label: "Header Portada",
    icon: "AppWindow",
    isContainer: true,
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
            default: "Colegio",
            help: "Alias de la columna para buscar la entidad (ej: Colegios, ID, etc)"
        },
        {
            name: "filterValue",
            label: "Valor a Buscar",
            type: "text",
            default: "Colegio Boston Internacional",
            help: "El valor exacto de la entidad que deseas mostrar."
        },
        {
            name: "data_settings",
            label: "Perzonalización de Estilos",
            type: "separator"
        },
        {
            name: "height",
            label: "Altura",
            type: "text",
            default: "400px",
            help: "Ej: 400px, 50vh, auto"
        },
    ]
};