export default {
    label: "Calificaciones Destacadas",
    icon: "Star",
    isContainer: false,
    fields: [
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
    ]
}