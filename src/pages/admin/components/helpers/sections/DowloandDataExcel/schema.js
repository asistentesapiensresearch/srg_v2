export default {
    label: "Carga Datos excel",
    icon: "Database",
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
            name: "identifierExcel",
            label: "Un identificador único para el Excel, es obliggatorio para poder consultar los datos del excel",
            type: "text",
            default: "",
            help: "Puede ser la hoja seleccionada, ej: COL, M-TOP, etc"
        },
    ]
};