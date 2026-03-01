export default {
    label: "Grilla de Marcas (Brands)",
    icon: "Briefcase",
    isContainer: false,
    fields: [
        { name: "title", label: "Título de la sección", type: "text", default: "" },
        { name: "brands_list", label: "Marcas", type: "brandsList" },
        { name: "show_names", label: "Mostrar nombres de marcas", type: "checkbox", default: true },

        { name: "layout_settings", label: "📐 MODO DE VISUALIZACIÓN", type: "separator" },
        {
            name: "layout_mode",
            label: "Diseño",
            type: "select",
            default: "marquee",
            options: [
                { label: "Grilla Estática", value: "grid" },
                { label: "Carrusel Infinito (Marquee)", value: "marquee" }
            ]
        },

        // --- OPCIONES PARA GRILLA ---
        {
            name: "columns",
            label: "Columnas (Desktop)",
            type: "number",
            default: 4,
            min: 2,
            max: 8,
            condition: "layout_mode === 'grid'"
        },

        // --- OPCIONES PARA CARRUSEL ---
        {
            name: "marquee_direction",
            label: "Dirección del movimiento",
            type: "select",
            default: "left",
            options: [
                { label: "Hacia la Izquierda (←)", value: "left" },
                { label: "Hacia la Derecha (→)", value: "right" }
            ],
            condition: "layout_mode === 'marquee'"
        },
        {
            name: "marquee_speed",
            label: "Velocidad",
            type: "slider",
            default: 40,
            min: 10,
            max: 150,
            condition: "layout_mode === 'marquee'"
        },
        {
            name: "pause_on_hover",
            label: "Pausar al pasar el mouse",
            type: "checkbox",
            default: true,
            condition: "layout_mode === 'marquee'"
        },

        { name: "style_settings", label: "🎨 ESTILO VISUAL", type: "separator" },
        { name: "logo_height", label: "Altura de logos (px)", type: "number", default: 60 },
        { name: "background_color", label: "Color de fondo", type: "color", default: "#ffffff" },

        { name: "hover_settings", label: "✨ EFECTOS HOVER", type: "separator" },
        {
            name: "grayscale",
            label: "Modo Blanco y Negro",
            type: "checkbox",
            default: true,
            help: "Los logos se ven en gris y toman color al pasar el mouse."
        },
        {
            name: "hover_scale",
            label: "Agrandar al pasar el mouse",
            type: "checkbox",
            default: true
        }
    ]
};