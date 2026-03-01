export default {
    label: "Video de YouTube",
    icon: "Youtube",
    fields: [
        { name: "video_settings", label: "📺 CONFIGURACIÓN DEL VIDEO", type: "separator" },
        {
            name: "url",
            label: "URL del Video",
            type: "text",
            default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            placeholder: "Pega el enlace de YouTube aquí"
        },
        {
            name: "aspect_ratio",
            label: "Relación de Aspecto",
            type: "select",
            default: "16/9",
            options: [
                { label: "Panorámico (16:9)", value: "16/9" },
                { label: "Estándar (4:3)", value: "4/3" },
                { label: "Cuadrado (1:1)", value: "1/1" },
                { label: "Vertical (9:16)", value: "9/16" }
            ]
        },

        { name: "playback_settings", label: "⚙️ OPCIONES DE REPRODUCCIÓN", type: "separator" },
        { name: "autoplay", label: "Reproducción Automática", type: "checkbox", default: false, help: "Nota: La mayoría de navegadores requieren 'Silenciar' para el Autoplay." },
        { name: "mute", label: "Silenciar (Mute)", type: "checkbox", default: false },
        { name: "loop", label: "Repetir en Bucle", type: "checkbox", default: false },
        { name: "show_controls", label: "Mostrar Controles", type: "checkbox", default: true },
        { name: "modest_branding", label: "Ocultar Logo YouTube (Modest Branding)", type: "checkbox", default: true },

        { name: "design_settings", label: "🎨 DISEÑO DEL CONTENEDOR", type: "separator" },
        {
            name: "container_width",
            label: "Ancho del Contenedor",
            type: "select",
            default: "lg",
            options: [
                { label: "Pequeño (sm)", value: "sm" },
                { label: "Mediano (md)", value: "md" },
                { label: "Grande (lg)", value: "lg" },
                { label: "Ancho Total", value: false }
            ]
        },
        { name: "border_radius", label: "Radio de Borde (px)", type: "number", default: 12 },
        { name: "padding_y", label: "Espaciado Vertical (unidades)", type: "number", default: 4 },
        { name: "background_color", label: "Color de Fondo de Sección", type: "color", default: "transparent" }
    ]
};