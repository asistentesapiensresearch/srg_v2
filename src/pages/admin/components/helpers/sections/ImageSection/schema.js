// src/components/builder/sections/ImageSection/schema.js
export default {
    label: "Imagen",
    fields: [
        // ========== IMAGEN ==========
        {
            name: "src",
            label: "Imagen",
            type: "image_uploader", // 🔥 Tipo especial para usar FileUploader
            default: "",
            help: "Sube una imagen desde tu computadora"
        },
        {
            name: "alt",
            label: "Texto alternativo",
            type: "text",
            default: "Imagen",
            help: "Describe la imagen para accesibilidad y SEO"
        },

        // ========== DIMENSIONES ==========
        {
            name: "section_dimensions",
            label: "📐 DIMENSIONES",
            type: "separator"
        },
        {
            name: "width",
            label: "Ancho",
            type: "text",
            default: "100%",
            help: "Ej: 100%, 800px, 50vw"
        },
        {
            name: "height",
            label: "Altura",
            type: "text",
            default: "400px",
            help: "Ej: 400px, 50vh, auto"
        },
        {
            name: "max_width",
            label: "Ancho máximo",
            type: "text",
            default: "1200px",
            help: "Evita que la imagen se estire demasiado"
        },

        // ========== AJUSTES DE IMAGEN ==========
        {
            name: "section_fit",
            label: "🎯 AJUSTE",
            type: "separator"
        },
        {
            name: "object_fit",
            label: "Modo de ajuste",
            type: "select",
            default: "cover",
            options: [
                { label: "Cubrir (cover)", value: "cover" },
                { label: "Contener (contain)", value: "contain" },
                { label: "Rellenar (fill)", value: "fill" },
                { label: "Ninguno (none)", value: "none" },
                { label: "Reducir (scale-down)", value: "scale-down" }
            ],
            help: "Cómo se ajusta la imagen al contenedor"
        },
        {
            name: "object_position",
            label: "Posición del objeto",
            type: "select",
            default: "center",
            options: [
                { label: "Centro", value: "center" },
                { label: "Arriba", value: "top" },
                { label: "Abajo", value: "bottom" },
                { label: "Izquierda", value: "left" },
                { label: "Derecha", value: "right" },
                { label: "Arriba izquierda", value: "top left" },
                { label: "Arriba derecha", value: "top right" },
                { label: "Abajo izquierda", value: "bottom left" },
                { label: "Abajo derecha", value: "bottom right" }
            ]
        },

        // ========== BORDES Y EFECTOS ==========
        {
            name: "section_effects",
            label: "✨ EFECTOS",
            type: "separator"
        },
        {
            name: "border_radius",
            label: "Radio de borde",
            type: "text",
            default: "0px",
            help: "Ej: 8px, 50% (círculo), 16px 16px 0 0"
        },
        {
            name: "box_shadow",
            label: "Sombra",
            type: "select",
            default: "none",
            options: [
                { label: "Sin sombra", value: "none" },
                { label: "Ligera", value: "0 2px 8px rgba(0,0,0,0.1)" },
                { label: "Media", value: "0 4px 16px rgba(0,0,0,0.15)" },
                { label: "Fuerte", value: "0 8px 24px rgba(0,0,0,0.2)" },
                { label: "Extra fuerte", value: "0 12px 32px rgba(0,0,0,0.25)" }
            ]
        },
        {
            name: "border",
            label: "Borde",
            type: "text",
            default: "none",
            help: "Ej: 2px solid #000, 1px dashed #ccc"
        },

        // ========== LAYOUT ==========
        {
            name: "section_layout",
            label: "📏 DISEÑO",
            type: "separator"
        },
        {
            name: "container_width",
            label: "Ancho del contenedor",
            type: "select",
            default: "lg",
            options: [
                { label: "Extra pequeño (600px)", value: "xs" },
                { label: "Pequeño (900px)", value: "sm" },
                { label: "Mediano (1200px)", value: "md" },
                { label: "Grande (1536px)", value: "lg" },
                { label: "Extra grande (1920px)", value: "xl" },
                { label: "Sin límite", value: false }
            ]
        },
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

        // ========== ESPACIADO ==========
        {
            name: "section_spacing",
            label: "📐 ESPACIADO",
            type: "separator"
        },
        {
            name: "padding_top",
            label: "Padding superior",
            type: "number",
            default: 2,
            min: 0,
            max: 20,
            help: "Unidades (1 = 8px)"
        },
        {
            name: "padding_bottom",
            label: "Padding inferior",
            type: "number",
            default: 2,
            min: 0,
            max: 20
        },
        {
            name: "padding_horizontal",
            label: "Padding horizontal",
            type: "number",
            default: 2,
            min: 0,
            max: 20
        },
        {
            name: "margin_top",
            label: "Margen superior",
            type: "number",
            default: 0,
            min: 0,
            max: 20
        },
        {
            name: "margin_bottom",
            label: "Margen inferior",
            type: "number",
            default: 0,
            min: 0,
            max: 20
        },

        // ========== FONDO ==========
        {
            name: "section_background",
            label: "🎨 FONDO DE LA SECCIÓN",
            type: "separator"
        },
        {
            name: "background_color",
            label: "Color de fondo",
            type: "color",
            default: "#ffffff",
            help: "Color de fondo de la sección completa"
        },

        // ========== EFECTOS HOVER ==========
        {
            name: "section_hover",
            label: "✨ EFECTOS AL PASAR EL MOUSE",
            type: "separator"
        },
        {
            name: "hover_scale",
            label: "Escalar al hover",
            type: "switch",
            default: false,
            help: "Agranda la imagen al pasar el mouse"
        },
        {
            name: "hover_opacity",
            label: "Opacidad al hover",
            type: "number",
            default: 1,
            min: 0,
            max: 1,
            step: 0.1,
            help: "0 = transparente, 1 = opaco"
        },

        // ========== ENLACE (OPCIONAL) ==========
        {
            name: "section_link",
            label: "🔗 ENLACE (OPCIONAL)",
            type: "separator"
        },
        {
            name: "link_url",
            label: "URL del enlace",
            type: "text",
            default: "",
            help: "Si deseas que la imagen sea clickeable"
        },
        {
            name: "link_target",
            label: "Abrir enlace en",
            type: "select",
            default: "_self",
            options: [
                { label: "Misma pestaña", value: "_self" },
                { label: "Nueva pestaña", value: "_blank" }
            ]
        }
    ]
};