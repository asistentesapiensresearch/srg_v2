export default {
    label: "Info Item",
    icon: "info",
    isContainer: false,
    fields: [
        {
            name: "mode",
            label: "Origen del contenido",
            type: "select",
            default: "custom",
            options: [
                { label: "Personalizado", value: "custom" },
                { label: "Base de datos", value: "database" }
            ]
        },
        // is Custom
        {
            name: "itemsCustom",
            label: "Items",
            type: "list",
            condition: "mode === 'custom'",
            fields: [
                {
                    name: "icon",
                    label: "Icono",
                    type: "select",
                    default: "Mail",
                    options: [
                        { label: "Mail", value: "Mail" },
                        { label: "Phone", value: "Phone" },
                        { label: "MapPin", value: "MapPin" },
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
                }
            ]
        },
        {
            name: "selectValue",
            label: "Campo que deseas seleccionar para renderizar información",
            type: "text",
            default: "",
            help: "El valor exacto para renderizar los datos del json obtenido del registro, ejemplo: admisiones, embebed, etc",
            condition: "mode === 'database'"
        },
        { name: "style_settings", label: "🎨 ESTILO Y DISEÑO", type: "separator" },
        {
            name: "sizeIcon",
            label: "Tamaño icono",
            type: "number",
            default: 24
        },
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
        },
    ]
};