import { v4 as uuidv4 } from 'uuid';

export default {
    label: "Versión final miscrositios",
    description: "Exportado desde el editor",
    getSections: () => [
    {
        "children": [],
        id: uuidv4(),
        "type": "DowloandDataBase",
        "props": {
            "modelName": "Institution",
            "searchField": "name",
            "searchValue": "Colegio Boston Internacional"
        }
    },
    {
        "children": [],
        id: uuidv4(),
        "type": "DowloandDataExcel",
        "props": {
            "sourceConfig": {
                "columnAliases": {},
                "sheetName": "07-01-2026_BD todos los rankings_Alejo",
                "selectedSheet": 1459228263,
                "columns": [
                    "Inglés",
                    "Lectura",
                    "Matemáticas",
                    "Sociales"
                ],
                "sheetId": "1IHT31uRNhuzd44wZbDhKA9CEt19lih2OlBa1myFnIV0",
                "filters": [],
                "type": "sheet",
                "url": "",
                "token": ""
            },
            "filterValue": "Colegio Boston Internacional",
            "identifierExcel": "Micro-Posionamiento",
            "filterField": "Colegios"
        }
    },
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
            "filterValue": "308001078261",
            "identifierExcel": "COL",
            "filterField": "DANE"
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
                    "columns": 3,
                    "title": "",
                    "show_names": false,
                    "grayscale": true,
                    "hover_scale": true,
                    "background_color": "#ffffff",
                    "pause_on_hover": true,
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
                    "layout_mode": "grid",
                    "isBackground": false,
                    "logo_height": 50,
                    "marquee_speed": 40
                }
            }
        ],
        id: uuidv4(),
        "type": "HeaderPortada",
        "props": {
            "modelName": "Institution",
            "sourceConfig": {
                "columnAliases": {},
                "sheetName": "07-01-2026_BD todos los rankings_Alejo",
                "selectedSheet": 1038840504,
                "columns": [
                    "Categoría sin D",
                    "Calificación"
                ],
                "sheetId": "1IHT31uRNhuzd44wZbDhKA9CEt19lih2OlBa1myFnIV0",
                "filters": [],
                "type": "sheet",
                "url": "",
                "token": ""
            },
            "searchField": "name",
            "filterValue": "Colegio Boston Internacional",
            "typeHeader": "micro-col",
            "dataSourceMode": "custom",
            "excelSource": "COL",
            "searchValue": "+ Colegio Boston Internacional",
            "filterField": "Colegio",
            "height": "85vh"
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "DynamicSocialMedia",
                "props": {
                    "targetField": "rectorSocial",
                    "icon_color": "#ffffff",
                    "gap": 1,
                    "icon_size": 20,
                    "isBackground": true,
                    "alignment": "center",
                    "hover_color": "#C10007",
                    "bg_icon_color": "#C10007",
                    "marginTop": 0,
                    "show_website": true
                }
            }
        ],
        id: uuidv4(),
        "type": "RectorSection",
        "props": {
            "borderRadius": 6,
            "shadow": true,
            "provider": "googleMap",
            "shadowColor": "rgba(0,0,0,0.08)",
            "height": 500
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "TabsPuntuation",
                "props": {
                    "mode": "custom",
                    "sourceConfig": {
                        "columnAliases": {
                            "Ciencias": ""
                        },
                        "sheetName": "07-01-2026_BD todos los rankings_Alejo",
                        "selectedSheet": 1459228263,
                        "columns": [
                            "Ciencias",
                            "Inglés",
                            "Lectura",
                            "Matemáticas",
                            "Sociales"
                        ],
                        "sheetId": "1IHT31uRNhuzd44wZbDhKA9CEt19lih2OlBa1myFnIV0",
                        "filters": [],
                        "type": "sheet",
                        "url": "",
                        "token": ""
                    },
                    "filterValue": "Colegio Boston Internacional",
                    "titleTabsPuntuation": "Posiciones según 100 Mejores por Materia 2026",
                    "filterField": "Colegios"
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */"
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "CardsCarousel",
                "props": {
                    "paddingVertical": 2,
                    "showDots": true,
                    "bgCard": "#FCF3F4",
                    "gap": 15,
                    "title": "Características del colegio",
                    "itemsCustom": [
                        {
                            "icon": "Globe",
                            "label": "Bilingüe",
                            "tag": "Inglés - Español",
                            "value": "Educación en español e inglés con doble titulación internacional."
                        },
                        {
                            "icon": "Calendar",
                            "label": "Calendario B",
                            "tag": "Internacional",
                            "value": "Año escolar de enero a noviembre, alineado con estándares internacionales."
                        },
                        {
                            "icon": "House",
                            "label": "Urbano–Campestre",
                            "tag": "Barranquilla",
                            "value": "Infraestructura moderna con espacios naturales para el aprendizaje."
                        },
                        {
                            "icon": "Users",
                            "label": "Presencial–Dual",
                            "tag": "Mixto",
                            "value": "Modalidad mixta con opción de aprendizaje presencial y dual."
                        },
                        {
                            "icon": "MapPin",
                            "label": "Viajes Internacionales",
                            "tag": "Experiencias - Mundo",
                            "value": "Experiencias educativas en el exterior que enriquecen la formación global de nuestros estudiantes."
                        },
                        {
                            "icon": "Book",
                            "label": "Doble Titulación",
                            "tag": "Titulación - Certificados",
                            "value": "Obtención de títulos en sistemas educativos nacionales e internacionales reconocidos globalmente."
                        },
                        {
                            "icon": "Star",
                            "label": "Exámenes Internacionales",
                            "tag": "Certificación - Internacional",
                            "value": "Certificaciones reconocidas mundialmente como Cambridge, IELTS y otros estándares de excelencia."
                        }
                    ],
                    "bgBorde": "#C8102E",
                    "autoplay": true,
                    "showArrows": true,
                    "itemsPerView": 4
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n"
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
                    "content": "<h3>Galeria de imágenes</h3>",
                    "customCss": "",
                    "paddingY": 4
                }
            },
            {
                "children": [],
                id: uuidv4(),
                "type": "Gallery",
                "props": {
                    "playInterval": 2000,
                    "thumbnailBarPosition": "bottom",
                    "galleryId": "b66a2ff7-e4d1-4ec5-a366-bf70e397a26a",
                    "showFullscreenButton": true,
                    "maxBullets": 0,
                    "LazyLoadImages": false,
                    "slideDuration": 550,
                    "showBulletIndicators": true,
                    "InfiniteLoop": true,
                    "VerticalSliding": false,
                    "KeyboardNavigation": true,
                    "showSliderCounter": false,
                    "RightToLeft": false,
                    "sourceType": "custom",
                    "SlideOnThumbnailHover": false,
                    "showThumbnails": true,
                    "showAutoplayButton": true,
                    "showArrows": true
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */"
        }
    },
    {
        "children": [
            {
                "children": [
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "FormSection",
                        "props": {
                            "submitAction": "email",
                            "destination": "hectortoro.ing@gmail.com",
                            "description": "Déjanos tus datos y te contactaremos pronto.",
                            "submitButtonText": "Enviar Mensaje",
                            "formFields": "[{\"name\":\"nombre\",\"label\":\"Nombre Completo\",\"type\":\"text\",\"width\":12,\"required\":true},{\"name\":\"numero_movil\",\"label\":\"Número móvil\",\"type\":\"number\",\"width\":12,\"required\":true},{\"label\":\"Grado de interes\",\"name\":\"grado_de_interes\",\"type\":\"select\",\"width\":12,\"required\":true,\"options\":\"Preescolar, Primaria (1° – 5°), Secundaria (6° – 9°),Media (10° – 11°)\"},{\"label\":\"¿Cómo te enteraste del colegio?\",\"name\":\"_como_te_enteraste_del_colegio_\",\"type\":\"text\",\"width\":12,\"required\":false,\"options\":\"\"},{\"name\":\"mensaje\",\"label\":\"¿Cómo podemos ayudarte?\",\"type\":\"textarea\",\"width\":12,\"required\":true},{\"label\":\"Correo\",\"name\":\"correo\",\"type\":\"text\",\"width\":12,\"required\":true,\"options\":\"\"},{\"label\":\"verificar correo\",\"name\":\"verificar_correo\",\"type\":\"text\",\"width\":12,\"required\":true,\"options\":\"\"}]",
                            "title": "Contáctanos",
                            "isAdmisiones": true
                        }
                    }
                ],
                id: uuidv4(),
                "type": "AdmissionsSection",
                "props": {
                    "description": "Nuestro proceso de admisión está diseñado para conocer a cada familia y encontrar el mejor encaje académico y de valores. Un equipo dedicado te acompaña en cada paso, desde la primera consulta hasta la bienvenida oficial al colegio.",
                    "title": "Características del colegio"
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */"
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
                    "content": "<h3>Nuestra comunidad</h3>",
                    "customCss": "",
                    "paddingY": 1
                }
            },
            {
                "children": [],
                id: uuidv4(),
                "type": "YouTubeVideo",
                "props": {
                    "aspect_ratio": "16/9",
                    "background_color": "transparent",
                    "loop": false,
                    "show_controls": true,
                    "modest_branding": true,
                    "mute": false,
                    "padding_y": 0,
                    "url": "https://www.youtube.com/watch?v=eECWdLeDmdE",
                    "autoplay": false,
                    "container_width": "lg",
                    "border_radius": 12
                }
            },
            {
                "children": [
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "EmbedContent",
                        "props": {
                            "borderRadius": 20,
                            "shadow": true,
                            "provider": "instagram",
                            "shadowColor": "#b0b0b0",
                            "height": 520
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "EmbedContent",
                        "props": {
                            "modelName": "Institution",
                            "searchField": "name",
                            "borderRadius": 20,
                            "shadow": true,
                            "provider": "facebook",
                            "dataSourceMode": "custom",
                            "searchValue": "+ Colegio Boston Internacional",
                            "shadowColor": "#b0b0b0",
                            "height": 520
                        }
                    }
                ],
                id: uuidv4(),
                "type": "FeaturesGrid",
                "props": {
                    "custom_desktop": "8,4",
                    "background_color": "#ffffff",
                    "custom_mobile": "12,12",
                    "custom_tablet": "6,6",
                    "gap": 5,
                    "layout_type": "custom",
                    "padding_y": 3,
                    "isBackground": false,
                    "title": "",
                    "columns_desktop": 3,
                    "columns_mobile": 1,
                    "columns_tablet": 2
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n.custom-scope h3 {\n margin: 0 0 20px 0;\n}"
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
                    "content": "<h3>Nuestros egresados</h3>",
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
                                        "type": "GraduatesSection",
                                        "props": {
                                            "sourceConfig": {
                                                "columnAliases": {},
                                                "sheetName": "Explora_redboston",
                                                "selectedSheet": 0,
                                                "columns": [
                                                    "Country code",
                                                    "Country name",
                                                    "Exalumnos en el exterior"
                                                ],
                                                "sheetId": "1R-MdZdHUrijlQjIrWsuxvNC9fioDu38JtQGK3oUlZO8",
                                                "filters": [],
                                                "type": "sheet",
                                                "url": "",
                                                "token": ""
                                            },
                                            "description": "El 14% de la última promoción eligió estudiar en universidades internacionales. Y tanto en las mejores universidades nacionales como de otros países, el 12% obtuvo beca."
                                        }
                                    },
                                    {
                                        "children": [],
                                        id: uuidv4(),
                                        "type": "ChartSection",
                                        "props": {
                                            "sectionTitle": "",
                                            "width": 800,
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
                                    "custom_desktop": "4,8",
                                    "background_color": "#ffffff",
                                    "custom_mobile": "12,12",
                                    "custom_tablet": "6,6",
                                    "gap": 3,
                                    "layout_type": "custom",
                                    "padding_y": 0,
                                    "isBackground": false,
                                    "title": "",
                                    "columns_desktop": 3,
                                    "columns_mobile": 1,
                                    "columns_tablet": 2
                                }
                            },
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
                                            "createdAt": "2026-03-11T18:46:04.359Z",
                                            "name": "Cognia",
                                            "link": "https://www.cognia.org/",
                                            "index": 0,
                                            "id": "dbdb4ff3-1187-4378-a931-2466df39b5d3",
                                            "key": "brands/cognia/1773254747896-Cognia.webp",
                                            "updatedAt": "2026-03-11T18:46:04.359Z"
                                        },
                                        {
                                            "createdAt": "2026-03-11T18:29:36.602Z",
                                            "name": "EP",
                                            "link": "https://elpais.com/america-colombia/2025-04-10/los-22-mejores-colegios-de-colombia-en-2024-2025.html",
                                            "index": 0,
                                            "id": "075f93bd-ff6d-4ed4-a2c9-076ae715c362",
                                            "key": "brands/ep/1773253770884-EP_wp.webp",
                                            "updatedAt": "2026-03-11T18:29:36.602Z"
                                        }
                                    ],
                                    "layout_mode": "marquee",
                                    "isBackground": false,
                                    "logo_height": 30,
                                    "marquee_speed": 40
                                }
                            }
                        ],
                        id: uuidv4(),
                        "type": "GroupSection",
                        "props": {
                            "background_color": "transparent",
                            "padding_y": 20,
                            "label": "Mapa",
                            "padding_x": 20
                        }
                    },
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
                                    "maxBullets": 0,
                                    "LazyLoadImages": false,
                                    "slideDuration": 550,
                                    "showBulletIndicators": true,
                                    "InfiniteLoop": true,
                                    "VerticalSliding": false,
                                    "KeyboardNavigation": true,
                                    "showSliderCounter": false,
                                    "RightToLeft": false,
                                    "sourceType": "custom",
                                    "SlideOnThumbnailHover": false,
                                    "showThumbnails": true,
                                    "showAutoplayButton": true,
                                    "showArrows": true
                                }
                            }
                        ],
                        id: uuidv4(),
                        "type": "GroupSection",
                        "props": {
                            "background_color": "transparent",
                            "padding_y": 20,
                            "label": "fotos",
                            "padding_x": 20
                        }
                    }
                ],
                id: uuidv4(),
                "type": "TabsSection",
                "props": {
                    "background_color": "#FFFFFF",
                    "variant": "standard",
                    "indicator_color": "var(--color-red-700)",
                    "tabs_color": "#666666",
                    "alignment": "left"
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n.custom-scope h3 {\n margin: 0 0 20px 0;\n padding: 0px; \n}"
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "TestimonialsCarousel",
                "props": {
                    "targetEntityId": "b024a7e5-e719-4b52-a26d-103679c6cc29",
                    "showDots": true,
                    "backgroundColor": "#fff",
                    "sourceMode": "custom",
                    "shadow": true,
                    "primaryColor": "#c10008",
                    "autoplay": true,
                    "layout": "minimal",
                    "isVertical": false,
                    "borderRadius": "10px",
                    "backgroundColorContent": "#eeeeee",
                    "gap": 15,
                    "shadowColor": "#a9a7a7",
                    "showArrows": true,
                    "itemsPerView": 4,
                    "heightCarrusel": "auto"
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": "/* Usa .custom-scope para referirte a este contenedor */\n"
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
                                            "height": 497
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
                                                            "Sociales": "#ec3609",
                                                            "Matemáticas": "#edcf0c",
                                                            "Ciencias": "#0778e9",
                                                            "Inglés": "#f90606",
                                                            "Lectura": "#20a206"
                                                        },
                                                        "sheetId": 64048081,
                                                        "alias": "Posiciones históricas del colegio",
                                                        "id": 1773750250018,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H2",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Col-Sapiens",
                                                            "100 Mejores",
                                                            "Top Mejores"
                                                        ],
                                                        "columnColors": {
                                                            "Top Mejores": "#09aa29",
                                                            "100 Mejores": "#e61e1e"
                                                        },
                                                        "sheetId": 314276000,
                                                        "alias": "Histórico de colegios clasificados, 100 Mejores y Top",
                                                        "id": 1773750251645,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H3",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "100 Mejores",
                                                            "Calificados",
                                                            "Autónomos"
                                                        ],
                                                        "columnColors": {
                                                            "Autónomos": "#09a706",
                                                            "Calificados": "#db0a0a"
                                                        },
                                                        "sheetId": 446431391,
                                                        "alias": "Histórico de colegios clasificados vs con y sin calificación",
                                                        "id": 1773750252477,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H4",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "100 Mejores",
                                                            "Calendario A",
                                                            "Calendario B"
                                                        ],
                                                        "columnColors": {
                                                            "Calendario A": "#fb0909"
                                                        },
                                                        "sheetId": 1997960740,
                                                        "alias": "Histórico de colegios clasificados vs calendario A y B",
                                                        "id": 1773750253138,
                                                        "type": "column"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H5 Ciencias",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2026",
                                                            "Boston"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 319276008,
                                                        "alias": "Ciencias: número de colegios por categoría vs colegio (versión actual)",
                                                        "id": 1773750600793,
                                                        "type": "column_spline_3d"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H6 Inglés",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2026",
                                                            "Boston"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 314656937,
                                                        "alias": "Inglés: número de colegios por categoría vs colegio (versión actual)",
                                                        "id": 1773750645080,
                                                        "type": "column_spline_3d"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H7 Lectura",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2026",
                                                            "Boston"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 934009779,
                                                        "alias": "Lectura: número de colegios por categoría vs colegio (versión actual)",
                                                        "id": 1773750686126,
                                                        "type": "column_spline_3d"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H8 Matemáticas",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2026",
                                                            "Boston"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 867637518,
                                                        "alias": "Matemáticas: número de colegios por categoría vs colegio (versión actual)",
                                                        "id": 1773750687247,
                                                        "type": "column_spline_3d"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H9 Sociales",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2026",
                                                            "Boston"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 588898374,
                                                        "alias": "Sociales: número de colegios por categoría vs colegio (versión actual)",
                                                        "id": 1773750688547,
                                                        "type": "column_spline_3d"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H10 Top",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "2026",
                                                            "Boston"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1636277092,
                                                        "alias": "Top: número de colegios por categoría vs colegio (versión actual)",
                                                        "id": 1773750689813,
                                                        "type": "column_spline_3d"
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
                                                        "type": "min_max_marker"
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
                                                            "Máx-Colombia",
                                                            "Máx-Barranquilla",
                                                            "Boston",
                                                            "Ref-1 CD",
                                                            "Ref-2 DO",
                                                            "Pm Barranquilla-A",
                                                            "Pm Barranquilla-B",
                                                            "Pm Colombia-A",
                                                            "Pm Colombia-B"
                                                        ],
                                                        "columnColors": {
                                                            "Pm Barranquilla-A": "#929496",
                                                            "Máx-Colombia": "#1b87f3",
                                                            "Ref-2 DO": "#fd490d",
                                                            "Pm Colombia-B": "#8f16d0",
                                                            "Ref-1 CD": "#eea811",
                                                            "Máx-Barranquilla": "#f50511",
                                                            "Boston": "#04b201",
                                                            "Pm Barranquilla-B": "#a53c03"
                                                        },
                                                        "sheetId": 381494508,
                                                        "alias": "puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182555707,
                                                        "type": "multi_combo"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H7-Ing",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia",
                                                            "Máx-Barranquilla",
                                                            "Boston",
                                                            "Ref-1 CD",
                                                            "Ref-2 DO",
                                                            "Pm Barranquilla-A",
                                                            "Pm Barranquilla-B",
                                                            "Pm Colombia-A",
                                                            "Pm Colombia-B"
                                                        ],
                                                        "columnColors": {
                                                            "Pm Barranquilla-A": "#949699",
                                                            "Máx-Colombia": "#1675d4",
                                                            "Ref-2 DO": "#dc6f09",
                                                            "Pm Colombia-B": "#be06cb",
                                                            "Ref-1 CD": "#cdbe18",
                                                            "Máx-Barranquilla": "#e30d0d",
                                                            "Boston": "#07d51f",
                                                            "Pm Barranquilla-B": "#a1390c"
                                                        },
                                                        "sheetId": 1013921628,
                                                        "alias": "Inglés: puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182556974,
                                                        "type": "multi_combo"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H8-Lec",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia",
                                                            "Máx-Barranquilla",
                                                            "Boston",
                                                            "Ref-1 CD",
                                                            "Ref-2 DO",
                                                            "Pm Barranquilla-A",
                                                            "Pm Barranquilla-B",
                                                            "Pm Colombia-A",
                                                            "Pm Colombia-B"
                                                        ],
                                                        "columnColors": {
                                                            "Pm Barranquilla-A": "#939495",
                                                            "Máx-Colombia": "#1e73c8",
                                                            "Ref-2 DO": "#cd510e",
                                                            "Pm Colombia-A": "#8007ab",
                                                            "Ref-1 CD": "#c8ab1e",
                                                            "Máx-Barranquilla": "#e70d0d",
                                                            "Boston": "#349121",
                                                            "Pm Barranquilla-B": "#a6520c"
                                                        },
                                                        "sheetId": 686409121,
                                                        "alias": "Lectura: puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182558270,
                                                        "type": "multi_combo"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H9-Mat",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia",
                                                            "Máx-Barranquilla",
                                                            "Boston",
                                                            "Ref-1 CD",
                                                            "Ref-2 DO",
                                                            "Pm Barranquilla-A",
                                                            "Pm Barranquilla-B",
                                                            "Pm Colombia-A",
                                                            "Pm Colombia-B"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 248584997,
                                                        "alias": "Matemáticas: puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182559547,
                                                        "type": "multi_combo"
                                                    },
                                                    {
                                                        "columnAliases": {},
                                                        "xAxis": "",
                                                        "sheetName": "H10-Soc",
                                                        "color": "#2c3e50",
                                                        "series": [
                                                            "Máx-Colombia",
                                                            "Máx-Barranquilla",
                                                            "Boston",
                                                            "Ref-1 CD",
                                                            "Ref-2 DO",
                                                            "Pm Barranquilla-A",
                                                            "Pm Barranquilla-B",
                                                            "Pm Colombia-A",
                                                            "Pm Colombia-B"
                                                        ],
                                                        "columnColors": {},
                                                        "sheetId": 1324693147,
                                                        "alias": "Sociales: puntaje histórico del colegio vs máximo y el mismo calendario",
                                                        "id": 1773182560923,
                                                        "type": "multi_combo"
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
                                                        "type": "min_max_marker"
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
                                                        "type": "min_max_marker"
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
                                                        "type": "min_max_marker"
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
                                                        "type": "min_max_marker"
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
                                                        "type": "min_max_marker"
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
                                                        "type": "min_max_marker"
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
                            "background_color": "#FFFFFF",
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
                    "padding_y": 0,
                    "label": "Nueva Pestaña",
                    "padding_x": 0
                }
            }
        ],
        id: uuidv4(),
        "type": "CssCode",
        "props": {
            "label": "Personalización CSS",
            "css_code": ".custom-scope h3 {\n margin: 0 0 20px 0;\n}"
        }
    },
    {
        "children": [
            {
                "children": [],
                id: uuidv4(),
                "type": "DynamicSocialMedia",
                "props": {
                    "searchField": "name",
                    "hover_color": "#c10007",
                    "modelName": "Institution",
                    "targetField": "socialMedia",
                    "icon_color": "#4b5563",
                    "dataSourceMode": "custom",
                    "gap": 1,
                    "icon_size": 30,
                    "alignment": "socialMedia",
                    "searchValue": "+ Colegio Boston Internacional",
                    "bg_icon_color": "#c10007",
                    "show_website": true,
                    "marginTop": 0
                }
            },
            {
                "children": [],
                id: uuidv4(),
                "type": "EmbedContent",
                "props": {
                    "borderRadius": 20,
                    "shadow": false,
                    "searchField": "name",
                    "provider": "googleMap",
                    "dataSourceMode": "custom",
                    "shadowColor": "#a19b9b",
                    "searchValue": "+ Colegio Boston Internacional",
                    "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.649203301186!2d-74.81295232585819!3d10.989828855223003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef42d0e1238e433%3A0x7dd1660b4d64a69e!2sBoston%20International%20School!5e0!3m2!1ses-419!2sco!4v1739233477683!5m2!1ses-419!2sco",
                    "height": 330
                }
            },
            {
                "children": [],
                id: uuidv4(),
                "type": "InfoItem",
                "props": {
                    "paddingItem": 2,
                    "colorText": "#b3b3b3",
                    "searchField": "name",
                    "selectValue": "admisiones",
                    "spacingIconTitle": 2,
                    "spacingItem": 0,
                    "colorTitle": "#ffffff",
                    "sizeIcon": 25,
                    "itemsCustom": [],
                    "mode": "database",
                    "modelName": "Institution",
                    "colorIcon": "#c10007",
                    "dataSourceMode": "custom",
                    "searchValue": "+ Colegio Boston Internacional"
                }
            }
        ],
        id: uuidv4(),
        "type": "FooterSection",
        "props": {
            "title": "Contáctanos"
        }
    }
]
};