// src/pages/admin/components/helpers/sections/ChartSection/schema.js
export default {
    label: "Galería de Gráficos (Highcharts)",
    id: "chart_section",
    isContainer: false,
    icon: "BarChart2",
    fields: [
        {
            name: "sectionTitle",
            label: "Título de la Sección",
            type: "text",
            default: ""
        },
        {
            name: "chartManager",
            label: "Gestión de Gráficos",
            type: "chart_manager_input",
            default: {
                fileId: "",
                fileName: "",
                token: "",
                charts: []
            },
            // IMPORTANTE: Asegúrate de que el modal interno de 'chart_manager_input'
            // permita guardar la propiedad 'mapScope' si quieres usar mapas específicos.
            // Por defecto usará 'custom/world' si no se define.
        },
        {
            name: "height",
            label: "Altura Mínima Inicial (px)", // Cambio de label para reflejar funcionalidad
            type: "number",
            default: 200,
            help: "El usuario podrá agrandar el gráfico arrastrando la esquina inferior."
        },
        {
            name: "width",
            label: "Ancho Mínimo Inicial (px)", // Cambio de label para reflejar funcionalidad
            type: "number",
            default: 200,
            help: "El usuario podrá agrandar el gráfico arrastrando la esquina inferior."
        },
        {
            name: "thumbnailsMode",
            label: "Visibilidad de Miniaturas",
            type: "select",
            default: "auto",
            options: [
                { label: "Automático (Si hay >= 2)", value: "auto" },
                { label: "Siempre Visible", value: "always" },
                { label: "Ocultar", value: "never" }
            ]
        }
    ]
};