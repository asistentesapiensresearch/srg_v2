export default {
    label: "Redes Sociales (Dinámico)",
    icon: "Share2",
    isContainer: false,
    fields: [
        { name: "data_settings", label: "🔌 ORIGEN DE DATOS", type: "separator" },
        {
            name: "dataSourceMode",
            label: "Modo de Origen",
            type: "select",
            default: "context",
            options: [
                { label: "Buscar en Base de Datos", value: "custom" }
            ],
            help: "Automático usa los datos de la página actual. Buscar te permite traer redes de cualquier registro."
        },
        {
            name: "modelName",
            label: "Tabla / Modelo (BD)",
            type: "select",
            default: "Institution",
            options: [
                { label: "Institución (Institution)", value: "Institution" },
                { label: "Investigación (Research)", value: "Research" }
                // Puedes agregar más modelos aquí si los tienes en tu schema de Amplify
            ],
            condition: "dataSourceMode === 'custom'"
        },
        {
            name: "searchField",
            label: "Campo a filtrar",
            type: "text",
            default: "id",
            help: "Ej: id, name, slug",
            condition: "dataSourceMode === 'custom'"
        },
        {
            name: "searchValue",
            label: "Valor a buscar",
            type: "text",
            default: "",
            help: "El valor exacto para encontrar el registro.",
            condition: "dataSourceMode === 'custom'"
        },
        {
            name: "targetField",
            label: "Campo JSON de Redes",
            type: "text",
            default: "socialMedia",
            help: "El campo en la BD que guarda el JSON (ej: socialMedia o rectorSocial)"
        },

        { name: "style_settings", label: "🎨 ESTILO Y DISEÑO", type: "separator" },
        {
            name: "alignment",
            label: "Alineación",
            type: "select",
            default: "center",
            options: [
                { label: "Izquierda", value: "flex-start" },
                { label: "Centro", value: "center" },
                { label: "Derecha", value: "flex-end" }
            ]
        },
        { name: "icon_size", label: "Tamaño del Icono (px)", type: "number", default: 24 },
        { name: "gap", label: "Separación entre iconos", type: "number", default: 2 },
        { name: "icon_color", label: "Color de los Iconos", type: "color", default: "#4b5563" },
        { name: "hover_color", label: "Color al pasar el mouse", type: "color", default: "#c10008" },
        {
            name: "marginTop",
            label: "Margen superior",
            type: "number",
            default: "10",
        },

        { name: "content_settings", label: "⚙️ CONTENIDO", type: "separator" },
        {
            name: "show_website",
            label: "Mostrar icono de Sitio Web",
            type: "checkbox",
            default: true,
            help: "Si el registro tiene un campo 'website' configurado, mostrará un icono de mundo."
        },
    ]
};