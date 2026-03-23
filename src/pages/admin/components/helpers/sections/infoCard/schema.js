export default {
    label: "Info Card",
    icon: "IdCard",
    isContainer: false,
    fields: [
        {
            name: "itemsCustom",
            label: "Items",
            type: "list",
            fields: [
                {
                    name: "label",
                    label: "Título",
                    type: "text"
                },
                {
                    name: "value",
                    label: "Texto",
                    type: "text"
                }
            ]
        },
        { name: "style_settings", label: "🎨 ESTILO Y DISEÑO", type: "separator" },
        {
            name: "paddingVertical",
            label: "Padding vertical",
            type: "number",
            default: 2
        },
        {
            name: "gap",
            label: "Separación entre cards",
            type: "number",
            default: 4
        },
        {
            name: "bgCard",
            label: "Color fondo de la card",
            type: "color",
            default: "#FCF3F4"
        },
        {
            name: "bgBorde",
            label: "Color fondo de la card",
            type: "color",
            default: "#C8102E"
        },
        /* 
        {
            name: "paddingItem",
            label: "Padding interno Item",
            type: "number",
            default: 0
        },
        {
            name: "spacingItem",
            label: "Espaciado entre items",
            type: "number",
            default: 2
        },
        {
            name: "spacingIconTitle",
            label: "Espaciado entre icono y título",
            type: "number",
            default: 2
        },
        {
            name: "colorIcon",
            label: "Color para el icono",
            type: "color",
            default: "#4b5563"
        },
        {
            name: "colorTitle",
            label: "Color para el titulo",
            type: "color",
            default: "#000"
        }, */
    ]
};