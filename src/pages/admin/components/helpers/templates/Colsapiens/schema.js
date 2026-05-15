import { v4 as uuidv4 } from 'uuid';

export default {
    label: "Investigación Col-Sapiens",
    description: "Exportado desde el editor",
    getSections: () => [
    {
        "children": [],
        id: uuidv4(),
        "type": "DowloandDataExcel",
        "props": {
            "sourceConfig": {
                "columnAliases": {},
                "sheetName": "07-01-2026_BD todos los rankings_Alejo",
                "selectedSheet": 620832165,
                "columns": [],
                "sheetId": "1IHT31uRNhuzd44wZbDhKA9CEt19lih2OlBa1myFnIV0",
                "filters": [],
                "type": "sheet",
                "url": "",
                "token": ""
            },
            "filterValue": "Colegio Boston Internacional",
            "identifierExcel": "COL",
            "typePage": "investigation",
            "filterField": "Colegio"
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "BrandsGrid",
                "props": {
                    "marquee_direction": "left",
                    "columns": 4,
                    "title": "",
                    "show_names": false,
                    "grayscale": true,
                    "hover_scale": true,
                    "background_color": "#ffffff",
                    "pause_on_hover": true,
                    "brands_list": [
                        {
                            "createdAt": "2026-03-11T18:29:36.602Z",
                            "name": "EP",
                            "link": "https://elpais.com/america-colombia/2025-04-10/los-22-mejores-colegios-de-colombia-en-2024-2025.html",
                            "index": 0,
                            "id": "075f93bd-ff6d-4ed4-a2c9-076ae715c362",
                            "key": "brands/ep/1773253770884-EP_wp.webp",
                            "updatedAt": "2026-03-11T18:29:36.602Z"
                        },
                        {
                            "createdAt": "2026-03-11T18:28:33.849Z",
                            "name": "IREG",
                            "link": "https://ireg-observatory.org/en/initiatives/national-ranking?rankingid=386",
                            "index": 0,
                            "id": "68d4e457-b3d4-47c9-a4a2-dfeec8c6af4c",
                            "key": "brands/ireg/1773253710553-IREG_wp.webp",
                            "updatedAt": "2026-03-11T18:28:33.849Z"
                        },
                        {
                            "createdAt": "2026-03-11T18:29:14.301Z",
                            "name": "https://www.universityworldnews.com/post.php?story=20110204224146865",
                            "link": "UWN",
                            "index": 0,
                            "id": "f4d66962-ef06-4697-b269-857786e589ed",
                            "key": "brands/https://www.universityworldnews.com/post.php?story=20110204224146865/1773253749215-UWN_wp.webp",
                            "updatedAt": "2026-03-11T18:29:14.301Z"
                        },
                        {
                            "createdAt": "2026-03-11T18:31:35.006Z",
                            "name": "TCH",
                            "link": "https://www.chronicle.com/article/university-rankings-take-root-in-latin-america/",
                            "index": 0,
                            "id": "7bead0d0-a212-458f-b8d9-7ee4dd3266fb",
                            "key": "brands/tch/1773253892343-TCHE_wp.webp",
                            "updatedAt": "2026-03-11T18:31:35.006Z"
                        }
                    ],
                    "layout_mode": "marquee",
                    "isBackground": false,
                    "logo_height": 60,
                    "marquee_speed": 40
                }
            }
        ],
        id: uuidv4(),
        "type": "HeaderPortada",
        "props": {
            "country": "Colombia",
            "itemsHighlights": [
                {
                    "label": "2023-2024",
                    "value": "Nivel A+"
                },
                {
                    "label": "2023-2024",
                    "value": "Índice 0,80"
                },
                {
                    "label": "Colegios",
                    "value": "+14.500"
                },
                {
                    "label": "Municipios",
                    "value": "122"
                },
                {
                    "label": "Clasificados",
                    "value": "810"
                },
                {
                    "label": "A: 616",
                    "value": "B: 192"
                },
                {
                    "label": "Privados: 761",
                    "value": "Públicos: 49"
                }
            ],
            "src": "sections/images/temp/01f03479-afc9-4bc4-b825-e711321f2e2d/1777072054616-COL-Sapiens.webp",
            "typePage": "investigation",
            "subtitle": "versión #13 del 9-sep-2025",
            "alt": "Imagen de col-sapiens",
            "excelSource": "COL",
            "shortDescription": "Los mejores colegios colombianos clasificados en categorías de desempeño académico y en calificaciones por certificaciones y/o acreditaciones internacionales",
            "title": "Ranking Col-Sapiens 2025-2026",
            "height": "400px"
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "ResourcesNavSection",
                "props": {
                    "colorIcon": "#0a6cf5",
                    "resources": [
                        {
                            "icon": "Globe",
                            "description": "Análisis actualizado de instituciones educativas destacadas en Colombia, basado en indicadores académicos, innovación y desempeño integral.",
                            "url_resource": "https://www.google.com",
                            "label": "Reporte 2025-2026"
                        },
                        {
                            "icon": "NotebookPen",
                            "description": "Explicación del proceso de evaluación, criterios de clasificación y fuentes utilizadas para el análisis de los resultados.",
                            "url_resource": "https://www.google.com",
                            "label": "Metodología"
                        },
                        {
                            "icon": "Check",
                            "description": "Investigación que reúne a los colegios con mayor reconocimiento y desempeño académico del país en diferentes categorías.",
                            "url_resource": "https://www.google.com",
                            "label": "100 Mejores"
                        },
                        {
                            "icon": "StickyNote",
                            "description": "Espacio dedicado a explorar el impacto de las instituciones educativas en la formación, liderazgo y transformación social.",
                            "url_resource": "https://www.google.com",
                            "label": "Efecto Escuela"
                        }
                    ],
                    "sizeIcon": 40
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n.custom-scope {\n  padding: 20px;\n}\n\n.custom-scope h4 {\n  color: red !important;\n}"
        }
    },
    {
        "children": [
            {
                "children": [
                    {
                        "children": [
                            {
                                "children": [],
                                id: uuidv4(),
                                "type": "DirectorySection",
                                "props": {
                                    "identifier": "COL",
                                    "enrichmentType": "EDUCATIONAL",
                                    "quickFilters": "[\n  {\n    \"label\": \"Aliados\",\n    \"filters\": {\n      \"isLinked\": [true]\n    },\n    \"default\": true\n  },\n  {\n    \"label\": \"Todos\",\n    \"filters\": {}\n  }\n]",
                                    "showAds": false,
                                    "primaryColor": "#c10008",
                                    "groupByColumn": "DANE",
                                    "targetVersion": "2025-2026",
                                    "enrichmentKey": "DANE",
                                    "enableEnrichment": true,
                                    "enrichmentSubtype": "school",
                                    "sourceConfig": {
                                        "columnAliases": {
                                            "Star": "Stars",
                                            "Colegios": "Nombre",
                                            "Vinculada": "isLinked",
                                            "Cat": "Categoría",
                                            "Jor": "Jornada",
                                            "Cal_1": "Calificación",
                                            "Gén": "Género",
                                            "Aniversario": "Antiguedad"
                                        },
                                        "sheetName": "07-01-2026_BD todos los rankings",
                                        "selectedSheet": 620832165,
                                        "columns": [
                                            "Colegios",
                                            "Año",
                                            "Vinculada",
                                            "Cat",
                                            "Cal_1",
                                            "Gén",
                                            "Departamento",
                                            "Star",
                                            "Siglas acreditación",
                                            "Siglas certificación",
                                            "Aniversario",
                                            "Jor"
                                        ],
                                        "sheetId": "1XP93obLDmWjun-tOnHN8-IaMgk9jvwdI4M2gLDxF95g",
                                        "filters": [],
                                        "type": "sheet",
                                        "url": "",
                                        "token": ""
                                    },
                                    "viewType": "grid",
                                    "itemsPerAds": 2,
                                    "versionColumn": "Año",
                                    "quick_filters": "[\n  {\n    \"label\": \"Todos\",\n    \"filters\": {}\n  },\n  {\n    \"label\": \"Aliados\",\n    \"filters\": {\n      \"Vinculada\": \"Sí\"\n    }\n  }\n]",
                                    "itemsPerColumn": 2
                                }
                            }
                        ],
                        id: uuidv4(),
                        "type": "GroupSection",
                        "props": {
                            "padding": 20,
                            "background_color": "transparent",
                            "label": "Aliados"
                        }
                    },
                    {
                        "children": [
                            {
                                "children": [],
                                id: uuidv4(),
                                "type": "ChartSection",
                                "props": {
                                    "sectionTitle": "Indicadores Clave",
                                    "chartManager": {
                                        "fileName": "Copia de 22-07-2022_Pestaña Metrics Col-Sapiens_ACTUAL",
                                        "charts": [
                                            {
                                                "xAxis": "Año",
                                                "sheetName": "G1",
                                                "color": "#42858a",
                                                "series": [
                                                    "Clasificados",
                                                    "Total Colombia"
                                                ],
                                                "columnColors": {
                                                    "Clasificados": "#c10008",
                                                    "Total Colombia": "#1c75d2",
                                                    "Año": "#428589"
                                                },
                                                "sheetId": 1549430490,
                                                "alias": "Colegios clasificados vs totales",
                                                "id": 1770030676885,
                                                "type": "column"
                                            },
                                            {
                                                "columnAliases": {},
                                                "xAxis": "Año",
                                                "sheetName": "G2",
                                                "color": "#2c3e50",
                                                "series": [
                                                    "B",
                                                    "A",
                                                    "Clasificados"
                                                ],
                                                "columnColors": {},
                                                "sheetId": 276024246,
                                                "alias": "Número de colegios clasificados vs discriminados por calendario",
                                                "id": 1770065906019,
                                                "type": "column"
                                            }
                                        ],
                                        "fileId": "1wqUGblJdioNvham-Bugrong9kdSbV4IEu6yqL5UJReg",
                                        "token": ""
                                    },
                                    "height": 500
                                }
                            }
                        ],
                        id: uuidv4(),
                        "type": "GroupSection",
                        "props": {
                            "padding": 20,
                            "background_color": "transparent",
                            "label": "Metricas"
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "GroupSection",
                        "props": {
                            "padding": 20,
                            "background_color": "transparent",
                            "label": "Vinculate"
                        }
                    }
                ],
                id: uuidv4(),
                "type": "TabsSection",
                "props": {
                    "background_color": "#ffffff",
                    "variant": "standard",
                    "indicator_color": "var(--color-red-700)",
                    "tabs_color": "var(--color-red-700)",
                    "alignment": "left"
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n.custom-scope {\n  padding: 20px;\n}\n\n.custom-scope h4 {\n  color: red !important;\n}"
        }
    },
    {
        "children": [],
        id: uuidv4(),
        "type": "FooterSection",
        "props": {
            "typePage": "investigation",
            "navRankings": [
                {
                    "link": "/losmejorescolegios-colsapiens",
                    "label": " Col-Sapiens"
                }
            ],
            "Navegación Rankings": [
                {
                    "link": "/losmejorescolegios-colsapiens",
                    "label": "Col-sapiens"
                }
            ]
        }
    }
]
};