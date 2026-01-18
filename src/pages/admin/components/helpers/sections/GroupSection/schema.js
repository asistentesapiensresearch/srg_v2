// src/view/sections/GroupSection/schema.js
export default {
    label: "Grupo / Contenedor",
    isContainer: true, // Permite que tenga hijos en el editor
    fields: [
        {
            name: "label",
            label: "Nombre de la Pestaña / Capa",
            type: "text",
            default: "Nueva Pestaña"
        },
        {
            name: "background_color",
            label: "Color de Fondo",
            type: "color",
            default: "transparent"
        },
        {
            name: "padding",
            label: "Espaciado (Padding)",
            type: "number",
            default: 20
        }
    ]
};