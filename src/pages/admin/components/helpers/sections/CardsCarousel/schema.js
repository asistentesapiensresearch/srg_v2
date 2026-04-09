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
                    label: "Texto",
                    type: "text"
                },
            ]
        },
        { name: "style_settings", label: "🎨 ESTILO Y DISEÑO", type: "separator" },
    ]
};