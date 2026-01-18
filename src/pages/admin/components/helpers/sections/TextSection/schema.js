// src/view/sections/TextSection/schema.js
export default {
    label: "Bloque de Texto",
    fields: [
        { name: "content", label: "Contenido", type: "textarea", default: "Escribe tu texto aquí..." },
        {
            name: "align",
            label: "Alineación (left, center, right)",
            type: "select",
            default: "left",
            options: [
                { label: "left", value: "left" },
                { label: "center", value: "center" },
                { label: "right", value: "right" }
            ]
        }, // Nota: requiere mejora en el editor
        { name: "color", label: "Color del Texto", type: "color", default: "#333333" },
        { name: "fontSize", label: "Tamaño Fuente (px/rem)", type: "text", default: "1rem" },
        {
            name: "font",
            label: "Fuente o estilo texto",
            type: "select",
            default: "left",
            options: [
                { label: "Cursive", value: "cursive" },
                { label: "fantasy", value: "fantasy" }
            ]
        },
    ]
};