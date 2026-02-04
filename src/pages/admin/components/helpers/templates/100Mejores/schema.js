import { v4 as uuidv4 } from 'uuid';

export default {
    label: "100 Mejores por materia",
    description: "Descripción de 100 mejores",
    getSections: () => [
    {
        "children": [
            {
                "children": [],
                "index": 1,
                id: uuidv4(),
                "type": "ImageSection",
                "props": {
                    "border": "none",
                    "padding_horizontal": 0,
                    "src": "sections/images/temp/68edbce4-8195-4d1f-831a-8cca2a6be007/1768874768088-ART-Sapiens.webp",
                    "margin_top": 0,
                    "alt": "Imagen",
                    "padding_top": 0,
                    "object_fit": "cover",
                    "hover_opacity": 1,
                    "hover_scale": false,
                    "max_width": "100%",
                    "margin_bottom": 0,
                    "background_color": "#ffffff",
                    "width": "100%",
                    "object_position": "center",
                    "link_target": "_self",
                    "link_url": "",
                    "alignment": "center",
                    "padding_bottom": 0,
                    "border_radius": "0px",
                    "box_shadow": "none",
                    "container_width": false,
                    "height": "400px"
                }
            },
            {
                "children": [
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "WysiwygSection",
                        "props": {
                            "className": "cardStyle",
                            "content": "<p style=\"font-size:23px;font-weight: bold; margin: 0;\">Ranking Col-Sapiens 2025-2026</p>\n<p style=\"font-size:12px;font-weight: bold; margin: 0;\">Los mejores colegios colombianos clasificados en categorías de desempeño académico y en calificaciones por certificaciones y/o acreditaciones internacionales.</p>\n",
                            "customCss": ".cardStyle {\n  border-radius: 8px;\n  background-color: rgb(192, 30, 16);\n  color: #fff;\n  font-family: roboto;\n  text-align: center;\n  padding: 10px;\n}",
                            "maxWidth": "lg",
                            "paddingY": 0
                        }
                    },
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "WysiwygSection",
                        "props": {
                            "className": "portada-descripcion",
                            "content": "<p class=\"portada-descripcion\"><strong>Importante</strong>: nuestros resultados <strong>NO</strong> están basados en las pruebas Saber 11, sino en los índices generales. Analizamos (versión #13, publicada el <strong>09-09-2025</strong>) más de <strong>14.500</strong> colegios, y solo clasificaron <strong>810</strong> (de 122 municipios). Nuestros resultados son noticia en estos <a href=\" https://www.google.com/search?q=%22sapiens+research%22&amp;sca_esv=c46fc0e2b66f1220&amp;sca_upv=1&amp;tbm=nws&amp;sxsrf=ADLYWIJE8ba1wcWzQNW06nM7g7-aLfIqeA:1724642876383&amp;source=lnms&amp;fbs=AEQNm0CbCVgAZ5mWEJDg6aoPVcBgWizR0-0aFOH11Sb5tlNhdzvguW7TJ8ZJj4v-NOGupFjybypXATN8-ElM0wR8g3shdrXLLnUqMC9-OfoFvhduOs6_8FhwP4VjVyFOMSmmyU2k-Y1BiSduhOx-gVDJCBUwrrxvkyOdwnIYwi6_UmYpQRihtk1th0UesBIyPboB7IZH_XI22nlMsqxX1_qg9CMqDNV1Xw&amp;sa=X&amp;ved=2ahUKEwj-n4uw25GIAxVk6ckDHfnEOw8Q0pQJegQIAxAG&amp;biw=1920&amp;bih=953&amp;dpr=1\" target=\"_blank\"><u>medios de comunicación</u></a>. También son referenciados en <a href=\" https://www.google.com/search?q=%22sapiens+research%22&amp;sca_esv=c46fc0e2b66f1220&amp;sca_upv=1&amp;tbm=bks&amp;sxsrf=ADLYWIJGNcN7YdGS7OI38hyFaCmTB_K4ig:1724643014456&amp;source=lnms&amp;fbs=AEQNm0CbCVgAZ5mWEJDg6aoPVcBgWizR0-0aFOH11Sb5tlNhdzvguW7TJ8ZJj4v-NOGupFjybypXATN8-ElM0wR8g3shdrXLLnUqMC9-OfoFvhduOs6_8FhwP4VjVyFOMSmmyU2k-Y1BiSduhOx-gVDJCBUwrrxvkyOdwnIYwi6_UmYpQRihtk1th0UesBIyPboB7IZH_XI22nlMsqxX1_qg9CMqDNV1Xw&amp;sa=X&amp;ved=2ahUKEwiCwvbx25GIAxXrQTABHXEsNZwQ0pQJegQIBhAM&amp;biw=1920&amp;bih=953&amp;dpr=1\" target=\"_blank\"><u> libros, tesis y artículos de investigación</u></a>. Si tu <strong>colegio</strong> está clasificado pero <strong>No</strong> disfruta de los beneficios de la <strong>membresía</strong>, mira <a href=\"https://www.youtube.com/watch?v=dbNv4UEaqFw\" target=\"_blank\"><u>este video</u></a> y <a href=\" https://www.srg.com.co/contáctanos/\" target=\"_blank\"><u>escríbenos</u></a>. <u>Yeshua</u> es el camino al <u>Padre Eterno</u>. <strong> Y Sapiens Research</strong> es una firma reconocida por importantes medios del mundo:</p>",
                            "customCss": ".portada-descripcion {\n  font-size: 12px;\n  color: #a09a9a;\n  text-align: justify;\n  margin: 0;\n  font-family: roboto;\n}",
                            "maxWidth": "lg",
                            "paddingY": 1
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
                                    "createdAt": "2026-01-19T05:41:12.832Z",
                                    "name": "iRegs",
                                    "link": "www.google.es",
                                    "index": null,
                                    "id": "b2e74f8d-4252-413d-8a80-794b2c22c12b",
                                    "key": "brands/iregs/1768806573728-EP_wp.webp",
                                    "updatedAt": "2026-01-19T07:11:25.599Z"
                                }
                            ],
                            "title": "",
                            "logo_height": 27,
                            "show_names": false,
                            "grayscale": false
                        }
                    }
                ],
                id: uuidv4(),
                "type": "GroupSection",
                "props": {
                    "padding": 0,
                    "background_color": "transparent",
                    "label": "Nueva Pestaña"
                }
            }
        ],
        "index": 0,
        id: uuidv4(),
        "type": "FeaturesGrid",
        "props": {
            "items_horizontal_align": "flex-start",
            "title": "",
            "title_margin_bottom": 1,
            "columns_tablet": 2,
            "desc_align": "left",
            "desc_margin_bottom": 4,
            "desc_color": "#666666",
            "gap": 2,
            "desc_variant": "body1",
            "items_vertical_align": "stretch",
            "padding_y": 0,
            "title_variant": "h4",
            "padding_bottom": 0,
            "min_item_height": "auto",
            "columns_mobile": 1,
            "padding_horizontal": 0,
            "title_align": "left",
            "title_color": "#000000",
            "padding_top": 0,
            "background_image": "",
            "background_color": "#ffffff",
            "background_size": "cover",
            "background_position": "center",
            "columns_desktop": 2,
            "container_width": "md",
            "border_radius": 0,
            "box_shadow": "none",
            "desc": "Descubre todo lo que tenemos para ofrecerte"
        }
    },
    {
        "children": [
            {
                "children": [
                    {
                        "children": [],
                        id: uuidv4(),
                        "type": "DirectorySection",
                        "props": {
                            "sourceConfig": {
                                "columnAliases": {
                                    "Ciudad": "Ciudad"
                                },
                                "sheetName": "07-01-2026_BD todos los rankings",
                                "selectedSheet": 620832165,
                                "columns": [
                                    "Ciudad"
                                ],
                                "sheetId": "1XP93obLDmWjun-tOnHN8-IaMgk9jvwdI4M2gLDxF95g",
                                "filters": [],
                                "type": "sheet",
                                "url": "",
                                "token": ""
                            },
                            "quickFilters": "[\n  {\n    \"label\": \"Aliados\",\n    \"filters\": {\n      \"Vinculada\": [\"Sí\"]\n    },\n    \"default\": true\n  },\n  {\n    \"label\": \"Todos\",\n    \"filters\": {}\n  }\n]",
                            "showAds": false,
                            "viewType": "grid",
                            "primaryColor": "#c10008",
                            "itemsPerAds": 2,
                            "versionColumn": "Año",
                            "quick_filters": "[\n  {\n    \"label\": \"Todos\",\n    \"filters\": {}\n  },\n  {\n    \"label\": \"Aliados\",\n    \"filters\": {\n      \"Vinculada\": \"Sí\"\n    }\n  }\n]",
                            "itemsPerColumn": 1,
                            "groupByColumn": "Colegio",
                            "targetVersion": "2025-2026"
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
                                "fileName": "22-07-2022_Pestaña Metrics Col-Sapiens_ACTUAL",
                                "charts": [
                                    {
                                        "id": 1770240528519,
                                        "sheetId": 1549430490,
                                        "sheetName": "G1",
                                        "alias": "Indicador 1",
                                        "type": "column",
                                        "xAxis": "Total Colombia",
                                        "series": [
                                            "Clasificados",
                                            "Total Colombia"
                                        ],
                                        "columnAliases": {},
                                        "columnColors": {},
                                        "color": "#2c3e50"
                                    },
                                    {
                                        "id": 1770240581534,
                                        "sheetId": 276024246,
                                        "sheetName": "G2",
                                        "alias": "Indicador 2",
                                        "type": "bar",
                                        "xAxis": "Clasificados",
                                        "series": [
                                            "A",
                                            "B",
                                            "Clasificados"
                                        ],
                                        "columnAliases": {},
                                        "columnColors": {},
                                        "color": "#2c3e50"
                                    },
                                    {
                                        "id": 1770240583967,
                                        "sheetId": 2330357,
                                        "sheetName": "G3",
                                        "alias": "Indicador 3",
                                        "type": "column",
                                        "xAxis": "B total",
                                        "series": [
                                            "A total",
                                            "A Rk",
                                            "B total",
                                            "B Rk"
                                        ],
                                        "columnAliases": {},
                                        "columnColors": {},
                                        "color": "#2c3e50"
                                    },
                                    {
                                        "id": 1770240585703,
                                        "sheetId": 1818454034,
                                        "sheetName": "G4",
                                        "alias": "Indicador 4",
                                        "type": "column",
                                        "xAxis": "Privados total",
                                        "series": [
                                            "Privados total",
                                            "Privados Rk",
                                            "Públicos total",
                                            "Públicos Rk"
                                        ],
                                        "columnAliases": {},
                                        "columnColors": {},
                                        "color": "#2c3e50"
                                    },
                                    {
                                        "id": 1770240587319,
                                        "sheetId": 1874794256,
                                        "sheetName": "G5",
                                        "alias": "G5",
                                        "type": "column",
                                        "xAxis": "",
                                        "series": [],
                                        "columnAliases": {},
                                        "columnColors": {},
                                        "color": "#2c3e50"
                                    }
                                ],
                                "fileId": "1xpWiLirXIlTK3h3HfQLhNf_sj1bBPs3qNX7i-Pc61Dg",
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
    },
    {
        "children": [],
        id: uuidv4(),
        "type": "WysiwygSection",
        "props": {
            "className": "",
            "content": "<p><span style=\"color: rgb(128, 128, 128); font-family: roboto; font-size: 14px;\">El </span><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://www.srg.com.co/losmejorescolegios-colsapiens\">Ranking Col-Sapiens</a><span style=\"color: rgb(128, 128, 128); font-family: roboto; font-size: 14px;\"> es el listado de los mejores colegios colombianos clasificados en categorías de desempeño académico y en calificaciones por certificaciones y/o acreditaciones internacionales. Se publica cada año desde 2013, y los requisitos que se deben cumplir son estos: (1) tener el nivel </span><strong>A+</strong><span style=\"color: rgb(128, 128, 128); font-family: roboto; font-size: 14px;\"> y un (2) </span><strong>índice general superior a 0,80</strong><span style=\"color: rgb(128, 128, 128); font-family: roboto; font-size: 14px;\"> en los dos años inmediatamente anteriores a la publicación de resultados (ver </span><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://www.srg.com.co/colsapiens/metodologia/\">Metodología</a><span style=\"color: rgb(128, 128, 128); font-family: roboto; font-size: 14px;\">). En la versión actual (2025-2026) clasificaron 810 colegios, y el 56% de estas instituciones alcanzó alguna de las 6 calificaciones por estar certificados y/o acreditados por las más de 70 firmas nacionales-internacionales. En el </span><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://www.srg.com.co/noticias/reporte-ranking-col-sapiens-2024-2025/\">Reporte 2025-2026</a><span style=\"color: rgb(128, 128, 128); font-family: roboto; font-size: 14px;\"> se resumen los principales resultados.</span></p>",
            "customCss": "",
            "maxWidth": "lg",
            "paddingY": 4
        }
    }
]
};