export default {
    label: "Calificaciones Destacadas",
    icon: "Star",
    isContainer: false,
    fields: [
        {
            name: "excelSource",
            label: "Seleccionar Fuente de Datos Archivo Excel",
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
                { label: "Col-Sapiens", value: "Col" },
                { label: "100 Mejores por Materia", value: "M-TOP" },
                { label: "Micrositios / Universidades / Encuentra / Grupos", value: "E-Grupos"},
                { label: "Micrositios / Universidades / Encuentra / Revistas", value: "E-Revistas"},
                { label: "Micrositios / Colegios / Posiciones", value: "Micro-Posionamiento"}
            ],
        },
    ]
}