// src/view/sections/BrandsGrid/schema.js
export default {
    label: "Grilla de Marcas (Brands)",
    isContainer: false,
    fields: [
        {
            name: "title",
            label: "Título de la sección",
            type: "text",
            default: ""
        },
        {
            name: "show_names",
            label: "Mostrar nombres de marcas",
            type: "boolean",
            default: true
        },
        {
            name: "brands_list",
            label: "Marcas",
            type: "brandsList"
        },
        {
            name: "section_style",
            label: "Estilo Visual",
            type: "separator"
        },
        {
            name: "columns",
            label: "Columnas (Desktop)",
            type: "number",
            default: 4,
            min: 2,
            max: 8
        },
        {
            name: "logo_height",
            label: "Altura de logos (px)",
            type: "number",
            default: 60
        },
        {
            name: "background_color",
            label: "Color de fondo",
            type: "color",
            default: "#ffffff"
        },
        {
            name: "grayscale",
            label: "Logos en escala de grises",
            type: "boolean",
            default: false,
            help: "Los logos se verán a color al pasar el mouse"
        }
    ]
};