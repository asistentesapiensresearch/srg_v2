export default {
    label: "Feed de Instagram",
    icon: "Instagram",
    fields: [
        { name: "profile_settings", label: "👤 PERFIL DE INSTAGRAM", type: "separator" },
        {
            name: "username",
            label: "Nombre de Usuario",
            type: "text",
            default: "@tu_cuenta",
            placeholder: "@colegio_boston"
        },
        {
            name: "profile_picture",
            label: "Foto de Perfil",
            type: "image_uploader",
            help: "Sube el logo o avatar de la cuenta"
        },
        {
            name: "bio",
            label: "Biografía / Información",
            type: "textarea",
            default: "Educación de calidad para el futuro. 📚✨ #Barranquilla"
        },

        { name: "stats_settings", label: "📊 ESTADÍSTICAS", type: "separator" },
        { name: "posts_count", label: "Publicaciones", type: "text", default: "1.2k" },
        { name: "followers_count", label: "Seguidores", type: "text", default: "15.4k" },
        { name: "following_count", label: "Seguidos", type: "text", default: "450" },

        { name: "feed_settings", label: "📸 ÚLTIMOS POSTS", type: "separator" },
        {
            name: "posts",
            label: "Lista de Publicaciones",
            type: "jsonCode",
            default: JSON.stringify([
                { "image": "", "likes": "120", "comments": "12", "type": "image" },
                { "image": "", "likes": "85", "comments": "5", "type": "video" },
                { "image": "", "likes": "210", "comments": "45", "type": "image" }
            ], null, 2),
            help: "Sube las imágenes a 'Media' y pega las URLs o usa el uploader si lo prefieres."
        },

        { name: "style_settings", label: "🎨 ESTILO", type: "separator" },
        { name: "columns", label: "Columnas (Desktop)", type: "number", default: 3, min: 2, max: 4 },
        { name: "primary_color", label: "Color del Botón", type: "color", default: "#E1306C" },
        { name: "show_stats", label: "Mostrar barra de estadísticas", type: "checkbox", default: true }
    ]
};