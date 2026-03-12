import { v4 as uuidv4 } from 'uuid';

export default {
    label: "Micrositio Colegio V2",
    description: "Exportado desde el editor",
    getSections: () => [
    {
        "children": [
            {
                "children": [
                    {
                        "children": [
                            {
                                "children": [],
                                id: uuidv4(),
                                "type": "Gallery",
                                "props": {
                                    "playInterval": 2000,
                                    "thumbnailBarPosition": "bottom",
                                    "galleryId": "b66a2ff7-e4d1-4ec5-a366-bf70e397a26a",
                                    "showFullscreenButton": true,
                                    "LazyLoadImages": true,
                                    "showPlayButton": false,
                                    "slideDuration": 550,
                                    "showBulletIndicators": true,
                                    "InfiniteLoop": true,
                                    "showSliderCounter": false,
                                    "slideInterval": 3000,
                                    "sourceType": "custom",
                                    "showThumbnails": true,
                                    "autoPlay": false,
                                    "showAutoplayButton": true,
                                    "showArrows": true
                                }
                            }
                        ],
                        id: uuidv4(),
                        "type": "GroupSection",
                        "props": {
                            "background_color": "transparent",
                            "padding_y": 0,
                            "label": "Galería",
                            "padding_x": 20
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "GroupSection",
                        "props": {
                            "background_color": "transparent",
                            "padding_y": 0,
                            "label": "Video",
                            "padding_x": 20
                        }
                    }
                ],
                id: uuidv4(),
                "type": "TabsSection",
                "props": {
                    "background_color": "#ffffff",
                    "variant": "standard",
                    "indicator_color": "var(--color-red-700)",
                    "tabs_color": "#666666",
                    "alignment": "flex-start"
                }
            },
            {
                "children": [
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "ImageSection",
                        "props": {
                            "border": "none",
                            "padding_horizontal": 2,
                            "src": "sections/images/temp/1d22d101-186a-4281-80f5-e76da7cd9485/1773254839163-Logocolegio_boston_internacional_barranquilla.webp",
                            "margin_top": 0,
                            "alt": "Imagen",
                            "padding_top": 2,
                            "object_fit": "cover",
                            "hover_opacity": 1,
                            "hover_scale": false,
                            "max_width": "200px",
                            "margin_bottom": 0,
                            "background_color": "#ffffff",
                            "width": "100%",
                            "object_position": "center",
                            "link_target": "_self",
                            "link_url": "",
                            "alignment": "center",
                            "padding_bottom": 2,
                            "border_radius": "0px",
                            "box_shadow": "none",
                            "container_width": "lg",
                            "height": "auto"
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "DataSummaryTable",
                        "props": {
                            "borderColor": "#e5e7eb",
                            "enrichmentType": "EDUCATIONAL",
                            "tableLayout": "[\n  [\n    {\n      \"label\": \"Categoría:\",\n      \"field\": \"categoria\",\n      \"type\": \"badge\",\n      \"prefix\": \"D\"\n    },\n    {\n      \"label\": \"Calificación:\",\n      \"field\": \"calificacion\",\n      \"type\": \"badge\"\n    }\n  ],\n  [\n    {\n      \"label\": \"Sector:\",\n      \"field\": \"sector\"\n    },\n    {\n      \"label\": \"Calendario:\",\n      \"field\": \"calendario\"\n    }\n  ],\n  [\n    {\n      \"label\": \"Genero:\",\n      \"field\": \"genero\"\n    },\n    {\n      \"label\": \"Ciudad:\",\n      \"field\": \"Ciudad\"\n    }\n  ],\n  [\n    {\n      \"label\": \"Rectoría:\",\n      \"field\": \"rectorName\",\n      \"type\": \"link\",\n      \"urlField\": \"rector_url\",\n      \"icon\": \"linkedin\",\n      \"colSpan\": 2\n    }\n  ],\n  [\n    {\n      \"label\": \"Admisiones:\",\n      \"field\": \"admisionesLabel\",\n      \"type\": \"link\",\n      \"urlField\": \"admisionesLink\",\n      \"colSpan\": 2\n    }\n  ],\n  [\n    {\n      \"label\": \"\",\n      \"field\": \"admisionesEmail\",\n      \"type\": \"email\",\n      \"icon\": \"mail\",\n      \"colSpan\": 2\n    }\n  ]\n]",
                            "filterField": "Colegios",
                            "labelColor": "#1f2937",
                            "enrichmentKey": "nombre",
                            "targetVersion": "2025-2026",
                            "enableEnrichment": true,
                            "enrichmentSubtype": "school",
                            "sourceConfig": {
                                "columnAliases": {
                                    "Sec": "sector",
                                    "Colegios": "nombre",
                                    "Cat": "categoria",
                                    "Cal_1": "calificacion",
                                    "Gén": "genero",
                                    "Año": "año",
                                    "Cal": "calendario"
                                },
                                "sheetName": "07-01-2026_BD todos los rankings_Brayan",
                                "selectedSheet": 620832165,
                                "columns": [
                                    "Cat",
                                    "Colegios",
                                    "Cal",
                                    "Sec",
                                    "Año",
                                    "Cal_1",
                                    "Gén",
                                    "Ciudad"
                                ],
                                "sheetId": "1XP93obLDmWjun-tOnHN8-IaMgk9jvwdI4M2gLDxF95g",
                                "filters": [],
                                "type": "sheet",
                                "url": "",
                                "token": ""
                            },
                            "sortColumn": "vigencia",
                            "filterValue": "+ Colegio Boston Internacional",
                            "versionColumn": "Año"
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "BrandsGrid",
                        "props": {
                            "background_color": "#ffffff",
                            "columns": 4,
                            "brands_list": [
                                {
                                    "createdAt": "2026-03-11T18:46:04.359Z",
                                    "name": "Cognia",
                                    "link": "https://www.cognia.org/",
                                    "index": 0,
                                    "id": "dbdb4ff3-1187-4378-a931-2466df39b5d3",
                                    "key": "brands/cognia/1773254747896-Cognia.webp",
                                    "updatedAt": "2026-03-11T18:46:04.359Z"
                                },
                                {
                                    "createdAt": "2026-03-11T18:45:08.202Z",
                                    "name": "ICAA",
                                    "link": "https://icaa.us/",
                                    "index": 0,
                                    "id": "0ed96e51-0a36-433e-bf82-374e03213f60",
                                    "key": "brands/icaa/1773254674110-International Christian Accrediting Association.webp",
                                    "updatedAt": "2026-03-11T18:45:08.202Z"
                                },
                                {
                                    "createdAt": "2026-03-11T18:46:51.484Z",
                                    "name": "Cambridge English",
                                    "link": "https://www.cambridgeenglish.org/es/information-for-preparation-centres/",
                                    "index": 0,
                                    "id": "a27daac8-8981-4d9c-9176-552496b91aeb",
                                    "key": "brands/cambridge_english/1773254774468-Preparation Centre-Cambridge English (PC-CE).webp",
                                    "updatedAt": "2026-03-11T18:46:51.484Z"
                                }
                            ],
                            "title": "",
                            "logo_height": 50,
                            "show_names": false,
                            "grayscale": false
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "WysiwygSection",
                        "props": {
                            "className": "linkWeb",
                            "content": "<p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://redboston.edu.co/\">https://redboston.edu.co/</a></p>",
                            "customCss": ".linkWeb {\n  text-align: center;\n}",
                            "maxWidth": "lg",
                            "paddingY": 0
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "DynamicSocialMedia",
                        "props": {
                            "modelName": "Institution",
                            "targetField": "socialMedia",
                            "searchField": "name",
                            "icon_color": "#4b5563",
                            "dataSourceMode": "custom",
                            "gap": 2,
                            "icon_size": 24,
                            "alignment": "center",
                            "hover_color": "#c10008",
                            "searchValue": "+ Colegio Boston Internacional",
                            "show_website": true
                        }
                    }
                ],
                id: uuidv4(),
                "type": "GroupSection",
                "props": {
                    "background_color": "transparent",
                    "padding_y": 0,
                    "label": "Nueva Pestaña",
                    "padding_x": 0
                }
            }
        ],
        id: uuidv4(),
        "type": "FeaturesGrid",
        "props": {
            "custom_desktop": "8,4",
            "background_color": "#ffffff",
            "gap": 3,
            "custom_tablet": "8,4",
            "layout_type": "custom",
            "padding_y": 0,
            "title": "",
            "columns_desktop": 2,
            "columns_mobile": 1,
            "columns_tablet": 2
        }
    },
    {
        "children": [],
        id: uuidv4(),
        "type": "TestimonialsCarousel",
        "props": {
            "targetEntityId": "1c078a6e-ceed-487c-9424-8b091df00ea4",
            "layout": "minimal",
            "showDots": true,
            "backgroundColor": "#f9fafb",
            "sourceMode": "custom",
            "primaryColor": "#c10008",
            "autoplay": true,
            "showArrows": true,
            "itemsPerView": 1
        }
    },
    {
        "children": [],
        id: uuidv4(),
        "type": "WysiwygSection",
        "props": {
            "className": "conoce",
            "content": "<h3>Conoce</h3><blockquote><p></p><img src=\"https://www.srg.com.co/img/redes/wiki.webp\" alt=\"Wikpedia logo\" width=\"200\" style=\"aspect-ratio: 1 / 1;\"><p>Nuestra institución surge de la necesidad manifiesta por los miembros de nuestra comunidad cristiana, padres de familia que vivían en los alrededores del plantel y, en especial, la visión del Pastor Carlos Reyes y su esposa Dilia de Reyes, fundadores del Concilio de Iglesias Boston. El pastor Carlos soñó un espacio en el que niños y jóvenes pudieran ser educados no solo académica sino espiritualmente. Su visión estuvo fundamentada en una educación cristiana, en el descubrimiento de nuestros valores, la capacidad para una convivencia sana, y el estudio del idioma inglés. Es así como, en el año 2002, inicia el preescolar Boston International bajo la dirección general de Luz Danis Reyes, hija menor de los pastores Carlos y Dilia. Un proyecto de fe al cual eventualmente se vincula Ingrid Reyes, hija mayor del matrimonio pastoral, como directora académica. Ha sido un proceso lleno de aventuras, en el cual la providencia de Dios ha sido una constante, y la visión de nuestros fundadores acertada. En el año 2003, el Pastor Carlos parte a la presencia del Señor, viendo materializada la fase inicial de su visión educativa. Su partida es hasta el día de hoy un inmenso vacío, pero su legado es evidente, y prolongado a través de su esposa Dilia, sus hijas Luz Danis e Ingrid, quienes hoy dirigen el Colegio Boston Internacional, y su hijo David, pastor presidente de la Iglesia Boston Central. Damos gracias a Dios por su guía y mano protectora en estos 15 años en los cuales nuestro propósito ha sido servirle a Él, y ser fieles a un legado y una visión que nacieron en su corazón.</p><p>24-10-2022</p></blockquote><p><a target=\"parent\" rel=\"noopener noreferrer nofollow\" class=\"pull-right btn btn-danger\" href=\"https://redboston.edu.co/index.php/nuestra-historia/\">Conocer más</a></p>",
            "customCss": ".conoce {\n  padding: 45px;\n  margin: 20px 0;\n  background-color: #EEE;\n  border-radius: 10px;\n}\n\nh3 {\n  font-size: 24px;\n  color: var(--color-red-700);\n  font-family: 'Roboto';\n  padding: 8px;\n  margin-top: 2px;\n  border-left: 2px solid rgb(217 83 79);\n  margin-bottom: 42px;\n  font-weight: bolder;\n}",
            "maxWidth": "xl",
            "paddingY": 2
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "WysiwygSection",
                "props": {
                    "className": "",
                    "content": "<h3>Analiza</h3>",
                    "customCss": "",
                    "maxWidth": "xl",
                    "paddingY": 0
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
                                        "type": "ChartSection",
                                        "props": {
                                            "sectionTitle": "",
                                            "width": 500,
                                            "chartManager": {
                                                "fileName": "01_Sí_Col-Sapiens_redboston_sh",
                                                "charts": [
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "Versión",
                                                        "sheetName": "H1",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Categoría",
                                                            "Calificación"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1882444936,
                                                        "alias": "Resultados históricos por categorías y calificaciones",
                                                        "id": 1773175296417,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H2",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "En la misma categoría y calificación",
                                                            "En la misma categoría",
                                                            "En la misma calificación"
                                                        ],
                                                        "columnColors": {
                                                            "En la misma categoría": "#ed2626",
                                                            "En la misma calificación": "#0abd4f"
                                                        },
                                                        "sheetId": 1829106418,
                                                        "alias": "Comparativo colegio con la misma categoría y calificación",
                                                        "id": 1773175298809,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "-",
                                                        "sheetName": "H3",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2013-14",
                                                            "2014-15",
                                                            "2015-16",
                                                            "2016-17",
                                                            "2017-18",
                                                            "2018-19",
                                                            "2019-20",
                                                            "2020-21",
                                                            "2021-22",
                                                            "2022-23",
                                                            "2023-24",
                                                            "2024-25",
                                                            "2025-26"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 545967769,
                                                        "alias": "Comparativo colegio vs número de colegios por categoría",
                                                        "id": 1773175377018,
                                                        "type": "spline"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H4",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Colegios"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 645144516,
                                                        "alias": "Ubicación de colegios con la misma categoría y calificación (versión actual)",
                                                        "id": 1773175653701,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H5",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Colegios"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1795554194,
                                                        "alias": "Calendario de colegios con la misma categoría y calificación (versión actual)",
                                                        "id": 1773175760702,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H6",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Colegios"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 2139303390,
                                                        "alias": "Colegios certificados y acreditados con la misma categoría y calificación (versión actual)",
                                                        "id": 1773175762288,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H7",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Colegios"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 28693545,
                                                        "alias": "Movimiento de colegios con la misma categoría y calificación ( versión actual)",
                                                        "id": 1773175764072,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H8",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Cognia",
                                                            "ICAA",
                                                            "EBN",
                                                            "PC-CE"
                                                        ],
                                                        "columnColors": {
                                                            "EBN": "#0bad1e",
                                                            "ICAA": "#f50505",
                                                            "Cognia": "#0573e1",
                                                            "PC-CE": "#c4d115"
                                                        },
                                                        "sheetId": 1058346997,
                                                        "alias": "Número de colegios certificados y/o acreditados por categoría",
                                                        "id": 1773175765090,
                                                        "type": "column"
                                                    }
                                                ],
                                                "fileId": "1fR3OIGiTSgq96HXsci2PtTITPqw4jqYzUFOJDC3OnE8",
                                                "token": ""
                                            },
                                            "thumbnailsMode": "always",
                                            "height": 200
                                        }
                                    }
                                ],
                                id: uuidv4(),
                                "type": "GroupSection",
                                "props": {
                                    "background_color": "transparent",
                                    "padding_y": 20,
                                    "label": "Col-sapiens",
                                    "padding_x": 20
                                }
                            },
                            {
                                "children": [
                                    {
                                        "children": [],
                                        id: uuidv4(),
                                        "type": "ChartSection",
                                        "props": {
                                            "sectionTitle": "",
                                            "width": 800,
                                            "chartManager": {
                                                "fileName": "02_Sí_100 Mejores_redboston_sh",
                                                "charts": [
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H1",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Ciencias",
                                                            "Inglés",
                                                            "Lectura",
                                                            "Matemáticas",
                                                            "Sociales",
                                                            "Top"
                                                        ],
                                                        "columnColors": {
                                                            "Sociales": "#e5620b",
                                                            "Matemáticas": "#dbbd29",
                                                            "Inglés": "#f40606",
                                                            "Lectura": "#048b0d"
                                                        },
                                                        "sheetId": 64048081,
                                                        "alias": "Posiciones históricas del colegio",
                                                        "id": 1773177699392,
                                                        "type": "column"
                                                    }
                                                ],
                                                "fileId": "1EXDVDYDw8tsFZkWNctYaYumfvxunWxJPo5JPnbYcFCc",
                                                "token": ""
                                            },
                                            "thumbnailsMode": "auto",
                                            "height": 500
                                        }
                                    }
                                ],
                                id: uuidv4(),
                                "type": "GroupSection",
                                "props": {
                                    "background_color": "transparent",
                                    "padding_y": 20,
                                    "label": "100 Mejores",
                                    "padding_x": 20
                                }
                            },
                            {
                                "children": [
                                    {
                                        "children": [],
                                        id: uuidv4(),
                                        "type": "ChartSection",
                                        "props": {
                                            "sectionTitle": "",
                                            "width": 800,
                                            "chartManager": {
                                                "fileName": "03_Si_Saber 11_redboston_sh",
                                                "charts": [
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H1",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Ciencias",
                                                            "Inglés",
                                                            "Lectura",
                                                            "Matemáticas",
                                                            "Sociales"
                                                        ],
                                                        "columnColors": {
                                                            "Sociales": "#fc7303",
                                                            "Matemáticas": "#f1d209",
                                                            "Inglés": "#f50505",
                                                            "Lectura": "#03aa3b"
                                                        },
                                                        "sheetId": 614743864,
                                                        "alias": "Puntaje histórico del colegio por materias",
                                                        "id": 1773179036657,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H2",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Ciencias",
                                                            "Inglés",
                                                            "Lectura",
                                                            "Matemáticas",
                                                            "Sociales"
                                                        ],
                                                        "columnColors": {
                                                            "Sociales": "#f04005",
                                                            "Matemáticas": "#e4c425",
                                                            "Inglés": "#ea0606",
                                                            "Ciencias": "#5371ea",
                                                            "Lectura": "#03ab05"
                                                        },
                                                        "sheetId": 1866216526,
                                                        "alias": "Puntaje año actual del colegio vs otros contextos",
                                                        "id": 1773179423943,
                                                        "type": "column_stacked"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "2025",
                                                        "sheetName": "H3",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Ciencias",
                                                            "Inglés",
                                                            "Lectura",
                                                            "Matemáticas",
                                                            "Sociales"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1899774129,
                                                        "alias": "Puntaje del colegio vs máximo y promedios otras regiones (año actual)",
                                                        "id": 1773181271642,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H4",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Puntajes colegios 2024-2025",
                                                            "2024 Boston Internacional",
                                                            "Promedio se oculta",
                                                            "2025 Boston Internacional",
                                                            "Máx-Colombia"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1669466575,
                                                        "alias": "Puntaje colegio (año anterior y actual) entre mínimo (año anterior) y máximo (año actual) del país",
                                                        "id": 1773182552690,
                                                        "type": "bubble"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H5",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Ciencias",
                                                            "Inglés",
                                                            "Lectura",
                                                            "Matemáticas",
                                                            "Sociales"
                                                        ],
                                                        "columnColors": {
                                                            "Sociales": "#f27602",
                                                            "Matemáticas": "#d8be18",
                                                            "Ciencias": "#027df7",
                                                            "Inglés": "#ed0707",
                                                            "Lectura": "#0bbc0e"
                                                        },
                                                        "sheetId": 1718754512,
                                                        "alias": "Número de colegios con similar o superior puntaje por materia",
                                                        "id": 1773182554449,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H6-Cie",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 381494508,
                                                        "alias": "puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182555707,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H7-Ing",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1013921628,
                                                        "alias": "Inglés: puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182556974,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H8-Lec",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 686409121,
                                                        "alias": "Lectura: puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182558270,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H9-Mat",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 248584997,
                                                        "alias": "Matemáticas: puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182559547,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H10-Soc",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1324693147,
                                                        "alias": "Sociales: puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182560923,
                                                        "type": "column"
                                                    }
                                                ],
                                                "fileId": "1kW3Sa7MAmraaHF5NRBXERb8fGBZDtBDuMSfjC_ExDws",
                                                "token": ""
                                            },
                                            "thumbnailsMode": "auto",
                                            "height": 500
                                        }
                                    }
                                ],
                                id: uuidv4(),
                                "type": "GroupSection",
                                "props": {
                                    "background_color": "transparent",
                                    "padding_y": 20,
                                    "label": "Saber 11",
                                    "padding_x": 20
                                }
                            },
                            {
                                "children": [
                                    {
                                        "children": [],
                                        id: uuidv4(),
                                        "type": "ChartSection",
                                        "props": {
                                            "sectionTitle": "",
                                            "width": 800,
                                            "chartManager": {
                                                "fileName": "07_Sí_Índices_Boston_sh",
                                                "charts": [
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "1",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2017",
                                                            "2018",
                                                            "2019",
                                                            "2020",
                                                            "2021",
                                                            "2022",
                                                            "2023",
                                                            "2024",
                                                            "2025",
                                                            "Año"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 562621332,
                                                        "alias": "Histórico de índices totales y por materias",
                                                        "id": 1773184635888,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "2",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2017",
                                                            "2018",
                                                            "2019",
                                                            "2020",
                                                            "2021",
                                                            "2022",
                                                            "2023",
                                                            "2024",
                                                            "2025"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 0,
                                                        "alias": "Histórico de variaciones de índices totales y por materias",
                                                        "id": 1773184757270,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "3_ITotal",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Mínimo",
                                                            "Inicial",
                                                            "Medio",
                                                            "Final",
                                                            "Máximo"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1119005154,
                                                        "alias": " Crecimiento de índices Totales entre índices mínimos y máximos de colegios clasificados",
                                                        "id": 1773184786734,
                                                        "type": "bubble"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "4_Mat",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Mínimo",
                                                            "Inicial",
                                                            "Medio",
                                                            "Final",
                                                            "Máximo"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 870504918,
                                                        "alias": "Crecimiento de índices de Matemáticas entre índices mínimos y máximos de colegios clasificados",
                                                        "id": 1773185018439,
                                                        "type": "bubble"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "5_Cie",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Mínimo",
                                                            "Inicial",
                                                            "Medio",
                                                            "Final",
                                                            "Máximo"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 290740894,
                                                        "alias": "Crecimiento de índices de Ciencias entre índices mínimos y máximos de colegios clasificados",
                                                        "id": 1773185154841,
                                                        "type": "bubble"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "6_Soc",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Mínimo",
                                                            "Inicial",
                                                            "Medio",
                                                            "Final",
                                                            "Máximo"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 849009020,
                                                        "alias": "Crecimiento de índices de Sociales  entre índices mínimos y máximos de colegios clasificados",
                                                        "id": 1773185237170,
                                                        "type": "bubble"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "7_Lec",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Mínimo",
                                                            "Inicial",
                                                            "Medio",
                                                            "Final",
                                                            "Máximo"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 595903382,
                                                        "alias": "Crecimiento de índices de Lectura entre índices mínimos y máximos de colegios clasificados",
                                                        "id": 1773185304851,
                                                        "type": "bubble"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "8_Ing",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Mínimo",
                                                            "Inicial",
                                                            "Medio",
                                                            "Final",
                                                            "Máximo"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1031658765,
                                                        "alias": "Crecimiento de índices de Inglés entre índices mínimos y máximos de colegios clasificados",
                                                        "id": 1773185353936,
                                                        "type": "bubble"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "9",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2017",
                                                            "2018",
                                                            "2019",
                                                            "2020",
                                                            "2021",
                                                            "2022",
                                                            "2023",
                                                            "2024",
                                                            "2025"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 869118319,
                                                        "alias": "Número de colegios clasificados con índices mayores",
                                                        "id": 1773185390284,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "10",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Ciencias",
                                                            "Inglés",
                                                            "Lectura",
                                                            "Matemáticas",
                                                            "Sociales"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 539979724,
                                                        "alias": "Promedio de promedios de los últimos tres años (U3A) de colegios de la siguiente categoría vs los del colegio",
                                                        "id": 1773185391618,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "11",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Ciencias",
                                                            "Inglés",
                                                            "Lectura",
                                                            "Matemáticas"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 460473027,
                                                        "alias": "Porcentajes de crecimiento mínimo por materia para subir a la siguiente categoría",
                                                        "id": 1773185392911,
                                                        "type": "column"
                                                    }
                                                ],
                                                "fileId": "1lvcam_ozLqayggJjnuL2Xn8aZ426n8zSyhCJyQI8HSY",
                                                "token": ""
                                            },
                                            "thumbnailsMode": "auto",
                                            "height": 500
                                        }
                                    }
                                ],
                                id: uuidv4(),
                                "type": "GroupSection",
                                "props": {
                                    "background_color": "transparent",
                                    "padding_y": 20,
                                    "label": "Índice",
                                    "padding_x": 20
                                }
                            }
                        ],
                        id: uuidv4(),
                        "type": "TabsSection",
                        "props": {
                            "background_color": "#ffffff",
                            "variant": "standard",
                            "indicator_color": "var(--color-red-700)",
                            "tabs_color": "#666666",
                            "alignment": "left"
                        }
                    }
                ],
                id: uuidv4(),
                "type": "GroupSection",
                "props": {
                    "background_color": "transparent",
                    "padding_y": 20,
                    "label": "Nueva Pestaña",
                    "padding_x": 20
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n.custom-scope {\n  padding: 45px;\n  margin: 20px 0;\n  background-color: #EEE;\n  border-radius: 10px;\n}\n\n.custom-scope h3 {\n  font-size: 24px;\n  color: var(--color-red-700);\n  font-family: 'Roboto';\n  padding: 8px;\n  margin-top: 2px;\n  border-left: 2px solid rgb(217 83 79);\n  margin-bottom: 10px;\n  font-weight: bolder;\n}"
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "WysiwygSection",
                "props": {
                    "className": "",
                    "content": "<h3>Explora</h3>",
                    "customCss": "",
                    "maxWidth": "xl",
                    "paddingY": 0
                }
            },
            {
                "children": [
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "WysiwygSection",
                        "props": {
                            "className": "container-table-explore",
                            "content": "<table style=\"min-width: 50px;\"><colgroup><col style=\"min-width: 25px;\"><col style=\"min-width: 25px;\"></colgroup><tbody><tr><td colspan=\"1\" rowspan=\"1\"><p>Exalumnos (2019-2024)</p></td><td colspan=\"1\" rowspan=\"1\"><p>186</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>En Colombia</p></td><td colspan=\"1\" rowspan=\"1\"><p>150</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>En otros países</p></td><td colspan=\"1\" rowspan=\"1\"><p>36</p></td></tr></tbody></table>",
                            "customCss": ".container-table-explore {\n  background-color: #EEE;\n}\n\n.container-table-explore, table {\n  background-color: white;\n  padding:0;\n  margin-top: 100px;\n}\n\n.container-table-explore table {\n  border-collapse: collapse;\n}\n\n.container-table-explore table,\n.container-table-explore th,\n.container-table-explore td {\n  border: 1px solid #000;\n} ",
                            "maxWidth": "lg",
                            "paddingY": 4
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "ChartSection",
                        "props": {
                            "sectionTitle": "",
                            "width": 500,
                            "chartManager": {
                                "fileName": "Explora_redboston",
                                "charts": [
                                    {
                                        "columnAliases": {},
                                        "xAxis": "",
                                        "sheetName": "Hoja 1",
                                        "color": "#2c3e50",
                                        "series": [
                                            "Country name",
                                            "Exalumnos en el exterior"
                                        ],
                                        "columnColors": {},
                                        "sheetId": 0,
                                        "alias": "",
                                        "id": 1773261541320,
                                        "type": "map"
                                    }
                                ],
                                "fileId": "1R-MdZdHUrijlQjIrWsuxvNC9fioDu38JtQGK3oUlZO8",
                                "token": ""
                            },
                            "thumbnailsMode": "auto",
                            "height": 400
                        }
                    }
                ],
                id: uuidv4(),
                "type": "FeaturesGrid",
                "props": {
                    "custom_desktop": "5,7",
                    "background_color": "#eeeeee",
                    "custom_mobile": "12,12",
                    "custom_tablet": "6,6",
                    "gap": 2,
                    "layout_type": "custom",
                    "padding_y": 0,
                    "title": "",
                    "columns_desktop": 2,
                    "columns_mobile": 1,
                    "columns_tablet": 2
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n.custom-scope {\n  padding: 45px;\n  margin: 20px 0;\n  background-color: #EEE;\n  border-radius: 10px;\n}\n\n.custom-scope h3 {\n  font-size: 24px;\n  color: var(--color-red-700);\n  font-family: 'Roboto';\n  padding: 8px;\n  margin-top: 2px;\n  border-left: 2px solid rgb(217 83 79);\n  margin-bottom: 10px;\n  font-weight: bolder;\n}"
        }
    },
    {
        "children": [
            {
                "children": [
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "WysiwygSection",
                        "props": {
                            "className": "container-location-map",
                            "content": "<h3>Ubica</h3>\n<iframe \n  src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.649203301186!2d-74.81295232585819!3d10.989828855223003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef42d0e1238e433%3A0x7dd1660b4d64a69e!2sBoston%20International%20School!5e0!3m2!1ses-419!2sco!4v1739233477683!5m2!1ses-419!2sco\" \n  width=\"100%\" \n  height=\"450\" \n  style=\"border:0;\" \n  allowfullscreen=\"\" \n  loading=\"lazy\" \n  referrerpolicy=\"no-referrer-when-downgrade\">\n</iframe>\n",
                            "customCss": ".container-location-map {\n  background-color: #EEE;\n  padding:0;\n}\n.container-location-map h3 {\n  margin-bottom: 40px;\n}",
                            "maxWidth": "xl",
                            "paddingY": 0
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "WysiwygSection",
                        "props": {
                            "className": "container-facebook",
                            "content": "<iframe \n  src=\"https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fredbisboston%2F&tabs=timeline&width=500&height=1000&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId\" \n  width=\"100%\" \n  height=\"700\" \n  style=\"border:none; overflow:hidden; min-width:326px; border-radius:3px;\" \n  scrolling=\"no\" \n  frameborder=\"0\" \n  allowfullscreen=\"true\" \n  allow=\"autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share\">\n</iframe>",
                            "customCss": ".container-facebook {\n  background-color: #EEE;\n  padding:0;\n}",
                            "maxWidth": "xl",
                            "paddingY": 4
                        }
                    }
                ],
                id: uuidv4(),
                "type": "FeaturesGrid",
                "props": {
                    "custom_desktop": "6",
                    "background_color": "#eeeeee",
                    "custom_mobile": "12,12",
                    "custom_tablet": "6,6",
                    "gap": 6,
                    "layout_type": "custom",
                    "padding_y": 0,
                    "title": "",
                    "columns_desktop": 2,
                    "columns_mobile": 1,
                    "columns_tablet": 2
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n.custom-scope {\n  padding: 45px;\n  margin: 20px 0;\n  background-color: #EEE;\n  border-radius: 10px;\n}\n\n.custom-scope h3 {\n  font-size: 24px;\n  color: var(--color-red-700);\n  font-family: 'Roboto';\n  padding: 8px;\n  margin-top: 2px;\n  border-left: 2px solid rgb(217 83 79);\n  margin-bottom: 10px;\n  font-weight: bolder;\n}"
        }
    },
    {
        "children": [],
        id: uuidv4(),
        "type": "WysiwygSection",
        "props": {
            "className": "",
            "content": "<iframe class=\"instagram-media instagram-media-rendered\" id=\"instagram-embed-0\" src=\"https://www.instagram.com/redbisboston/embed/?cr=1&amp;v=13&amp;wp=2432&amp;rd=https%3A%2F%2Fwww.srg.com.co&amp;rp=%2Fcolegio%2Fcolegio_boston_internacional_barranquilla#%7B%22ci%22%3A0%2C%22os%22%3A1042.0999999046326%2C%22ls%22%3A800.4000000953674%2C%22le%22%3A1034.5999999046326%7D\" allowtransparency=\"true\" allowfullscreen=\"true\" frameborder=\"0\" height=\"1035\" data-instgrm-payload-id=\"instagram-media-payload-0\" scrolling=\"no\" style=\"width: 100%; background-color: white; border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;\"></iframe>",
            "customCss": "",
            "maxWidth": "xl",
            "paddingY": 4
        }
    }
]
};