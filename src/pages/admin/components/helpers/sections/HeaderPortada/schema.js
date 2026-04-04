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
        // Fuente de datos, importante mantener esto actualizado en todos los schemas que lo usen
        {
            name: "excelSource",
            label: "Seleccionar Fuente de Datos Archivo Excel",
            type: "select",
            default: "M-TOP",
            options: [
                { label: "COLSAPIENS", value: "COL" },
                { label: "Mejores 100", value: "M-TOP" }
            ],
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