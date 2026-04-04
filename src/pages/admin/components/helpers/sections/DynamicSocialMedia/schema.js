export default {
    label: "Redes Sociales (Dinámico)",
    icon: "Share2",
    isContainer: false,
    fields: [
        { name: "data_settings", label: "🔌 ORIGEN DE DATOS", type: "separator" },
        {
            name: "targetField",
            label: "Seleccione la redes que necesita",
            type: "select",
            default: "socialMedia",
            options: [
                { label: "Redes Instituto", value: "socialMedia" },
                { label: "Redes Rector", value: "rectorSocial" },
            ]
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