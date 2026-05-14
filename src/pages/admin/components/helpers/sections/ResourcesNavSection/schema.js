export default {
    label: "Resources Nav Section",
    icon: "info",
    isContainer: false,
    fields: [
        // is Custom
        { name: "style_settings", label: "🎨 ESTILO Y DISEÑO", type: "separator" },
        {
            name: "resources",
            label: "Recursos para su navegación",
            type: "list",
            condition: "mode === 'custom'",
            fields: [
                {
                    name: "icon",
                    label: "Icono",
                    type: "select",
                    default: "Mail",
                    options: [
                        { label: "Globe", value: "Globe" },
                        { label: "NotebookPen", value: "NotebookPen" },
                        { label: "Check", value: "Check" },
                        { label: "StickyNote", value: "StickyNote" },
                    ]
                },
                {
                    name: "label",
                    label: "Título",
                    type: "text"
                },
                {
                    name: "url_resource",
                    label: "Url del recurso",
                    type: "text"
                },
                {
                    name: "description",
                    label: "Una pequeña descripción del recurso",
                    type: "textarea"
                }
            ]
        },
        { name: "style_settings", label: "🎨 ESTILO Y DISEÑO", type: "separator" },
        {
            name: "sizeIcon",
            label: "Tamaño icono",
            type: "number",
            default: 24
        },
        {
            name: "colorIcon",
            label: "Color para el icono",
            type: "color",
            default: "#4b5563"
        },
    ]
};