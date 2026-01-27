// src/view/sections/ChartSection/schema.js
export default {
    label: "Grafico",
    fields: [
        { name: "src", label: "URL de la imagen", type: "text", default: "" },
        { name: "alt", label: "Texto Alternativo", type: "text", default: "Descripción de la imagen" },
        { name: "height", label: "Altura (px)", type: "text", default: "400px" },
        { name: "objectFit", label: "Ajuste (cover/contain)", type: "text", default: "cover" },
        { name: "borderRadius", label: "Bordes Redondeados (px)", type: "text", default: "8px" },
    ]
};