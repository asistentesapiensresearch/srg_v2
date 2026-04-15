export default {
    label: "Información de Graduados (Sección)",
    icon: "BoxSelect",
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
            name: "description",
            label: "Descripción para la tabla de Graduados",
            type: "text",
            default: "El 14% de la última promoción eligió estudiar en universidades internacionales. Y tanto en las mejores universidades nacionales como de otros países, el 12% obtuvo beca."
        }
    ]
};