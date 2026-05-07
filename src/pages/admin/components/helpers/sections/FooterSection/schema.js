
export default {
    label: "Footer Personalizado",
    icon: "ClipboardList",
    isContainer: true,
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
            name: "navRankings",
            label: "Navegación Rankings",
            type: "list",
            condition: "typePage === 'investigation'",
            fields: [
                {
                    name: "label",
                    label: "Título de la navegación",
                    type: "text",
                    help: "Col-sapiens"
                },
                {
                    name: "link",
                    label: "slug de la navegación",
                    type: "text",
                    help: "/losmejorescolegios-colsapiens"
                }
            ]
        },
        {
            name: "navGroups",
            label: "Navegación Grupos",
            type: "list",
            condition: "typePage === 'investigation'",
            fields: [
                {
                    name: "label",
                    label: "Título de la navegación",
                    type: "text",
                    help: "Col-Sapiens"
                },
                {
                    name: "link",
                    label: "slug de la navegación",
                    type: "text",
                    help: "/losmejorescolegios-colsapiens"
                }
            ]
        },
        {
            name: "navArticles",
            label: "Navegación Revistas",
            type: "list",
            condition: "typePage === 'investigation'",
            fields: [
               {
                    name: "label",
                    label: "Título de la navegación",
                    type: "text",
                    help: "Col-sapiens"
                },
                {
                    name: "link",
                    label: "slug de la navegación",
                    type: "text",
                    help: "/losmejorescolegios-colsapiens"
                }
            ]
        },
    ],
};