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
        {
            name: "dataSourceMode",
            label: "Modo de Origen",
            type: "select",
            default: "custom",
            options: [
                { label: "Buscar en Base de Datos", value: "custom" }
            ],
            condition: "mode === 'database'"
        },
        {
            name: "modelName",
            label: "Tabla / Modelo (BD)",
            type: "select",
            default: "Institution",
            options: [
                { label: "Institución (Institution)", value: "Institution" },
                { label: "Investigación (Research)", value: "Research" }
            ],
            condition: "mode === 'database'"
        },
        {
            name: "searchField",
            label: "Campo a filtrar",
            type: "text",
            default: "id",
            help: "Ej: id, name, slug",
            condition: "mode === 'database'"
        },
        {
            name: "searchValue",
            label: "Valor a buscar",
            type: "text",
            default: "",
            help: "El valor exacto para encontrar el registro.",
            condition: "mode === 'database'"
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