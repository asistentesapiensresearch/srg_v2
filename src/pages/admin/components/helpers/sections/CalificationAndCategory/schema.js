export default {
    label: "Calificación y categoría",
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
            default: "Colegios",
            help: "Alias de la columna para buscar la entidad (ej: Colegios, ID, etc)"
        },
        {
            name: "filterValue",
            label: "Valor a Buscar",
            type: "text",
            default: "Colegio Boston Internacional",
            help: "El valor exacto de la entidad que deseas mostrar."
        },

        //personalizacion de los estilos
        { name: "style_settings", label: "🎨 ESTILOS", type: "separator" },
        { name: "titleColor", label: "Color del Título", type: "color", default: "#C10007" },
        { name: "iconColor", label: "Color del Icono", type: "color", default: "#EF4444" },
        { name: "circleColor", label: "Color del Círculo Pequeño", type: "color", default: "#DC2626" },
        { name: "largeCircleColor", label: "Color del Círculo Grande", type: "color", default: "#ababab" },
        { name: "textColor", label: "Color del Texto", type: "color", default: "#FFFFFF" },
        { name: "hoverEffect", label: "Activar Efecto Hover", type: "select", options: [{ label: "Sí", value: true }, { label: "No", value: false }], default: true },
        { name: "hoverIntensity", label: "Intensidad del Hover", type: "select", options: [{ label: "Ninguno", value: "none" }, { label: "Pequeño", value: "small" }, { label: "Medio", value: "medium" }, { label: "Grande", value: "large" }], default: "medium" }
        ]
    }