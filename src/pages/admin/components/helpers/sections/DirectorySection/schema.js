// src/view/sections/DirectorySection/schema.js
export default {
    label: "Directorio Inteligente",
    fields: [
        { 
            name: "sourceConfig", 
            label: "Conexión de Datos", 
            type: "data_source_manager", 
            default: { type: 'sheet', url: '' } 
        },
        {
            name: "viewType",
            label: "Diseño Visual",
            type: "select",
            default: "list",
            options: [
                { label: "Cuadrícula (Cards)", value: "grid" },
                { label: "Lista Compacta", value: "list" }
            ]
        },
        { name: "itemsPerAds", label: "Publicidad cada (X) items", type: "number", default: 3 },
        { name: "itemsPerColumn", label: "Items por fila", type: "number", default: 3 },
        { name: "showAds", label: "Activar Publicidad Inmersa", type: "switch", default: true },
        { name: "filterFields", label: "Campos para filtrar (separados por coma)", type: "filters" },
        { name: "primaryColor", label: "Color de Acento", type: "color", default: "#c10008" }
    ]
};