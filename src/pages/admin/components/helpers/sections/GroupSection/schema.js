export default {
    label: "Grupo / Contenedor",
    icon: "BoxSelect",
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
            name: "padding_y",
            label: "Espaciado Vertical (Padding)",
            type: "number",
            default: 20
        },
        {
            name: "padding_x",
            label: "Espaciado Horizontal (Padding)",
            type: "number",
            default: 20
        }
    ]
};