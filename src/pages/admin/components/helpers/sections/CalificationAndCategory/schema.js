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
                { label: "U-Sapiens", value: "U" },
                { label: "ASC-Sapiens", value: "ASC" },
                { label: "Mejores ASC", value: "M-ASC" },
                { label: "ART-Sapiens", value: "ART" },
                { label: "Mejores ART", value: "M-ART" },
                { label: "DTI-Sapiens", value: "DTI" },
                { label: "Mejores DTI", value: "M-DTI" },
                { label: "GNC-Sapiens", value: "GNC" },
                { label: "Mejores GNC", value: "M-GNC" },
                { label: "FRH-Sapiens", value: "FRH" },
                { label: "Mejores FRH", value: "M-FRH" },
                { label: "REV-Sapiens", value: "REV" },
                { label: "POST-Sapiens", value: "POST" },
                { label: "PRE-Sapiens", value: "PRE" },
                { label: "Col-Sapiens", value: "Col" },
                { label: "100 Mejores por Materia", value: "M-TOP" },
                { label: "Micrositios / Universidades / Encuentra / Grupos", value: "E-Grupos"},
                { label: "Micrositios / Universidades / Encuentra / Revistas", value: "E-Revistas"},
                { label: "Micrositios / Colegios / Posiciones", value: "Micro-Posionamiento"}
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