export default {
    label: "Calificación y categoría",
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
        //personalizacion de los estilos
        { name: "style_settings", label: "🎨 ESTILOS", type: "separator" },
        { name: "borderColor", label: "Color del Borde del Círculo", type: "color", default: "#DC2626" },
        { name: "innerCircleColor", label: "Color del Interior del Círculo", type: "color", default: "#ababab" },
        { name: "textColor", label: "Color del Texto", type: "color", default: "#FFFFFF" },
        { name: "hoverColor", label: "Color del Hover Interno", type: "color", default: "rgba(255,255,255,0.2)" },
        { name: "hoverEffect", label: "Activar Efecto Hover", type: "select", options: [{ label: "Sí", value: true }, { label: "No", value: false }], default: true },
        { name: "hoverIntensity", label: "Intensidad del Hover", type: "select", options: [ { label: "Pequeño", value: "small" }, { label: "Medio", value: "medium" }, { label: "Grande", value: "large" }], default: "medium" }
        ]
    }