// src/view/sections/CssCode/schema.js
export default {
    label: "Bloque de Estilos CSS",
    isContainer: true, // Para que puedas meter hijos dentro y estilizarlos
    fields: [
        {
            name: "label",
            label: "Etiqueta en Capas",
            type: "text",
            default: "Personalización CSS"
        },
        {
            name: "css_code",
            label: "Código CSS Personalizado",
            type: "textarea",
            default: "/* Usa .custom-scope para referirte a este contenedor */\n.custom-scope {\n  padding: 20px;\n}\n\n.custom-scope h4 {\n  color: red !important;\n}",
            help: "Usa el selector '.custom-scope' para aplicar estilos solo a este bloque."
        }
    ]
};