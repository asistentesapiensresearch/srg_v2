export default {
    label: "Bloque de Texto",
    icon: "Type",
    fields: [
        {
            name: "content",
            label: "Contenido",
            type: "textarea",
            default: "Escribe tu texto aquí..."
        },
        {
            name: "align",
            label: "Alineación",
            type: "select",
            default: "left",
            options: [
                { label: "Izquierda", value: "left" },
                { label: "Centro", value: "center" },
                { label: "Derecha", value: "right" },
                { label: "Justificado", value: "justify" }
            ]
        },
        {
            name: "color",
            label: "Color del Texto",
            type: "color",
            default: "#333333"
        },
        {
            name: "fontSize",
            label: "Tamaño Fuente",
            type: "text",
            default: "1rem",
            help: "Ej: 16px, 1.2rem, large"
        },
        {
            name: "font",
            label: "Tipografía",
            type: "select",
            default: "sans-serif", // Corregido: antes decía 'left'
            options: [
                { label: "Sans Serif (Estándar)", value: "sans-serif" },
                { label: "Serif (Clásica)", value: "serif" },
                { label: "Monospace (Código)", value: "monospace" },
                { label: "Cursive", value: "cursive" },
                { label: "Fantasy", value: "fantasy" }
            ]
        },
        // 🔥 NUEVOS CAMPOS DE PADDING 🔥
        {
            name: "paddingTop",
            label: "Espaciado Superior",
            type: "text",
            default: "32px",
            help: "Ej: 0, 20px, 4rem"
        },
        {
            name: "paddingBottom",
            label: "Espaciado Inferior",
            type: "text",
            default: "32px",
            help: "Ej: 0, 20px, 4rem"
        },
        {
            name: "paddingX",
            label: "Espaciado Lateral (Izq/Der)",
            type: "text",
            default: "16px",
            help: "Útil para separar del borde en móviles"
        }
    ]
};