// src/view/sections/WysiwygSection/schema.js
export default {
    label: "Editor Enriquecido",
    fields: [
        { 
            name: "content", 
            label: "Contenido del Artículo", 
            type: "wysiwyg", // Aquí se activa el RichTextEditorInpt
            default: "<h1>Título inicial</h1><p>Comienza a escribir aquí...</p>" 
        },
        {
            name: "className", 
            label: "Clase (css separadas por espacios)", 
            type: "text", 
            default: ''
        },
        {
            name: "customCss", 
            label: "Estilos personalizados", 
            type: "cssCode", 
            default: ''
        },
        {
            name: "maxWidth",
            label: "Ancho del contenedor",
            type: "select",
            default: "lg",
            options: [
                { label: "Pequeño (sm)", value: "sm" },
                { label: "Mediano (md)", value: "md" },
                { label: "Grande (lg)", value: "lg" },
                { label: "Pantalla Completa (xl)", value: "xl" }
            ]
        },
        { 
            name: "paddingY", 
            label: "Espaciado Vertical (1-10)", 
            type: "number", 
            default: 4 
        }
    ]
};