export default {
    label: "Editor Enriquecido",
    icon: "FileEdit",
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
            name: "paddingY", 
            label: "Espaciado Vertical (1-10)", 
            type: "number", 
            default: 4 
        }
    ]
};