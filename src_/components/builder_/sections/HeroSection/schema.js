// Esto le dice a tu editor qué inputs mostrar en la barra lateral
export default {
    label: "Hero Banner",
    fields: [
        { name: "title", label: "Título Principal", type: "text", default: "Bienvenido" },
        { name: "subtitle", label: "Subtítulo", type: "textarea", default: "Descripción aquí" },
        { name: "buttonText", label: "Texto Botón", type: "text", default: "Comprar" },
        { name: "backgroundColor", label: "Color de Fondo", type: "color", default: "#f5f5f5" },
    ]
};