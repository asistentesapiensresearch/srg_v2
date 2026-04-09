export default {
    label: "Carrusel de Cards",
    icon: "IdCard",
    isContainer: false,
    fields: [
        {
            name: "title",
            label: "Título de la seccion",
            type: "text",
            default: "Características del colegio"
        },
        {
            name: "itemsCustom",
            label: "Items",
            type: "list",
            fields: [
                {
                    name: "icon",
                    label: "Icono",
                    type: "select",
                    default: "Mail",
                    options: [
                        { label: "Globe", value: "Globe" },
                        { label: "Calendario", value: "Calendar" },
                        { label: "Casa", value: "House" },
                        { label: "Usuarios", value: "Users" },
                        { label: "Usuario", value: "User" },
                        { label: "Mapa", value: "MapPin" },
                        { label: "Book", value: "Book" },
                        { label: "Star", value: "Star" },
                    ]
                },
                {
                    name: "label",
                    label: "Título",
                    type: "text"
                },
                {
                    name: "value",
                    label: "Texto",
                    type: "text"
                },
                {
                    name: "tag",
                    label: "Etiquetas",
                    type: "text"
                },
            ]
        },
        { name: "style_settings", label: "🎨 ESTILO VISUAL", type: "separator" },
        { name: "itemsPerView", label: "Testimonios visibles (PC)", type: "number", default: 3, min: 1, max: 4 },
        { name: "gap", label: "Espaciado entre testimonios", type: "number", default: 15, min: 1, max: 40 },
        { name: "autoplay", label: "Reproducción Automática", type: "checkbox", default: true },
        { name: "showArrows", label: "Mostrar Flechas", type: "checkbox", default: true },
        { name: "showDots", label: "Mostrar Puntos (Paginación)", type: "checkbox", default: true },
    ]
};