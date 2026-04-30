export default {
    label: "Google Ad Manager",
    icon: "MonitorPlay",
    isContainer: false,
    fields: [
        {
            name: "client",
            label: "Div ID",
            type: "text",
            default: "div-gpt-ad-1662608593804-0",
            help: "Ingresa el ID del contenedor Div (ej: div-gpt-ad-1662608593804-0)"
        },
        {
            name: "slot",
            label: "Ad Unit Path",
            type: "text",
            default: "/52413523/2122",
            help: "Ingresa la ruta del bloque de anuncios (Ad Unit Path)"
        },
        {
            name: "format",
            label: "Formato",
            type: "select",
            default: "auto",
            options: [
                { label: "Automático", value: "auto" },
                { label: "Rectángulo", value: "rectangle" },
                { label: "Horizontal", value: "horizontal" },
                { label: "Vertical", value: "vertical" },
            ]
        },
        {
            name: "responsive",
            label: "Responsivo",
            type: "boolean",
            default: true,
            help: "Adapta el tamaño automáticamente al contenedor"
        },
        {
            name: "section_spacing",
            label: "📐 ESPACIADO",
            type: "separator"
        },
        {
            name: "padding",
            label: "Padding (px)",
            type: "number",
            default: 16,
            min: 0,
            max: 100
        },
        {
            name: "section_background",
            label: "🎨 FONDO",
            type: "separator"
        },
        {
            name: "background",
            label: "Color de fondo",
            type: "color",
            default: "transparent"
        }
    ]
};
