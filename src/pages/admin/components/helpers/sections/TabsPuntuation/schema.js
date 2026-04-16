export default {
    label: "Tabs puntuación",
    icon: "Star",
    isContainer: false,
    fields: [
        {
            name: "data_settings",
            label: "🔌 CONEXIÓN Y BÚSQUEDA",
            type: "separator"
        },
        {
            name: "excelSource",
            label: "Seleccionar Fuente de Datos Archivo Excel",
            type: "select",
            default: "Micro-Posionamiento",
            options: [
                { label: "U-Sapiens", value: "U" },
                { label: "ASC-Sapiens", value: "ASC" },
                { label: "Mejores ASC", value: "M-ASC" },
                { label: "ART-Sapiens", value: "ART" },
                { label: "Mejores ART", value: "M-ART" },
                { label: "DTI-Sapiens", value: "DTI" },
                { label: "Mejores DTI", value: "M-DTI" },
                { label: "GNC-Sapiens", value: "GNC" },
                { label: "Mejores GNC", value: "M-GNC" },
                { label: "FRH-Sapiens", value: "FRH" },
                { label: "Mejores FRH", value: "M-FRH" },
                { label: "REV-Sapiens", value: "REV" },
                { label: "POST-Sapiens", value: "POST" },
                { label: "PRE-Sapiens", value: "PRE" },
                { label: "Col-Sapiens", value: "COL" },
                { label: "100 Mejores por Materia", value: "M-TOP" },
                { label: "Micrositios / Universidades / Encuentra / Grupos", value: "E-Grupos"},
                { label: "Micrositios / Universidades / Encuentra / Revistas", value: "E-Revistas"},
                { label: "Micrositios / Colegios / Posiciones", value: "Micro-Posionamiento"}
            ],
        },
        { name: "custom", label: "🎨Titulo custom", type: "separator" },
        //personalizacion de los estilos
        { name: "style_settings", label: "🎨 ESTILOS", type: "separator" },
        { name: "textcolor", label: "Color del Texto(Las Etiquetas)", type: "color", default: "#1f2937" },
        { name: "titleTabsPuntuation", label: "Titulo Del Componente", type: "text", default: "Posiciones según 100 Mejores por Materia 2026" },
        { name: "sizeTitleTabs", label: "Tamaño Del Titulo Del Componente(en px)", type: "number", default: 20 },
        { name: "HoverCardsPuntuation", label: "Cantidad del Hover", type: "number", default: 1 },
    ]
}