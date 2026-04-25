export default {
    label: "Carga Datos excel",
    icon: "Database",
    isContainer: false,
    fields: [
         {
            name: "typePage",
            label: "Seleccione para que tipo de página es el Header",
            type: "select",
            default: "micro-col",
            options: [
                { label: "Investigaciones", value: "investigation" },
                { label: "Micrositios Colegio", value: "micro-col" },
                { label: "Micrositios Universidad", value: "micro-uni" },
            ],
        },
        {
            name: "data_settings",
            label: "🔌 CONEXIÓN Y BÚSQUEDA",
            type: "separator",
        },
        {
            name: "sourceConfig",
            label: "Conexión de Datos",
            type: "data_source_manager",
            default: { type: 'sheet', url: '' }
        },
        {
            name: "filterField",
            label: "Columna de Búsqueda (Alias)",
            type: "text",
            default: "Colegio",
            help: "Alias de la columna para buscar la entidad (ej: Colegios, ID, etc)",
            condition: "typePage === 'micro-col' || typePage === 'micro-uni'"
        },
        {
            name: "filterValue",
            label: "Valor a Buscar",
            type: "text",
            default: "Colegio Boston Internacional",
            help: "El valor exacto de la entidad que deseas mostrar.",
            condition: "typePage === 'micro-col' || typePage === 'micro-uni'"
        },
        {
            name: "identifierExcel",
            label: "Seleccionar Fuente de Datos Archivo Excel para su identificador interno",
            type: "select",
            default: "M-TOP",
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
    ]
};