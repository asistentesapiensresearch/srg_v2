// src/pages/admin/components/helpers/sections/ChartSection/schema.js
export default {
    label: "Galería de Gráficos (Highcharts)",
    isContainer: false,
    icon: "BarChart2",
    fields: [
        {
            name: "chartManager", // Campo maestro
            label: "Gestión de Gráficos",
            type: "chart_manager_input", // Nuevo tipo de input
            default: {
                fileId: "",
                fileName: "",
                token: "",
                charts: [] // Array de configuraciones { sheetName, alias, type, axis... }
            }
        },
        {
            name: "height",
            label: "Altura del Gráfico Principal (px)",
            type: "number",
            default: 500
        }
    ]
};