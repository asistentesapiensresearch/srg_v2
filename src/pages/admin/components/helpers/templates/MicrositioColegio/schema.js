import { v4 as uuidv4 } from 'uuid';

export default {
    label: "Micrositio Colegio",
    description: "Base para micrositio",
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
                                        "galleryId": "6862e28c-8d95-4973-8a65-4b5550c7f354",
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
                                "src": "sections/images/temp/1074bd3d-2544-4182-82c0-8369c7177dc5/1771219981565-Logocolegio_boston_internacional_barranquilla.webp",
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
                                        "createdAt": "2026-02-25T12:36:49.795Z",
                                        "name": "cambridge",
                                        "link": "www.google.es",
                                        "index": 0,
                                        "id": "032cf8da-3742-4036-99c3-d40cecf2d92f",
                                        "key": "brands/cambridge/1772023006801-Preparation Centre-Cambridge English (PC-CE).webp",
                                        "updatedAt": "2026-02-25T12:36:49.795Z"
                                    },
                                    {
                                        "createdAt": "2026-02-25T12:36:38.227Z",
                                        "name": "internacional",
                                        "link": "www.google.es",
                                        "index": 0,
                                        "id": "c3481372-5d10-4d3b-bc59-c73eb21e9190",
                                        "key": "brands/internacional/1772022995540-International Christian Accrediting Association.webp",
                                        "updatedAt": "2026-02-25T12:36:38.227Z"
                                    },
                                    {
                                        "createdAt": "2026-02-25T12:36:16.748Z",
                                        "name": "Cognia",
                                        "link": "www.google.es",
                                        "index": 0,
                                        "id": "d1e2e419-c6ae-4201-95d1-eca0d44e61df",
                                        "key": "brands/cognia/1772022973830-Cognia.webp",
                                        "updatedAt": "2026-02-25T12:36:16.748Z"
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
                "targetEntityId": "5af6221b-0d07-4317-b14b-ed503f595b0d",
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
                "content": "<div class=\"col-xs-12\">\n        <h3><i class=\"glyphicon glyphicon-search\"></i> Conoce</h3>\n        <blockquote>\n          <p>\n            <img id=\"ImgWiki\" class=\"lazy\" data-src=\"https://www.srg.com.co/img/redes/wiki.webp\" alt=\"Wikpedia logo\" align=\"left\" src=\"https://www.srg.com.co/img/redes/wiki.webp\">Nuestra institución surge de la necesidad manifiesta por los miembros de nuestra comunidad cristiana, padres de familia que vivían en los alrededores del plantel y, en especial, la visión del Pastor Carlos Reyes y su esposa Dilia de Reyes, fundadores del Concilio de Iglesias Boston. El pastor Carlos soñó un espacio en el que niños y jóvenes pudieran ser educados no solo académica sino espiritualmente. Su visión estuvo fundamentada en una educación cristiana, en el descubrimiento de nuestros valores, la capacidad para una convivencia sana, y el estudio del idioma inglés. Es así como, en el año 2002, inicia el preescolar Boston International bajo la dirección general de Luz Danis Reyes, hija menor de los pastores Carlos y Dilia. Un proyecto de fe al cual eventualmente se vincula Ingrid Reyes, hija mayor del matrimonio pastoral, como directora académica. Ha sido un proceso lleno de aventuras, en el cual la providencia de Dios ha sido una constante, y la visión de nuestros fundadores acertada. En el año 2003, el Pastor Carlos parte a la presencia del Señor, viendo materializada la fase inicial de su visión educativa. Su partida es hasta el día de hoy un inmenso vacío, pero su legado es evidente, y prolongado a través de su esposa Dilia, sus hijas Luz Danis e Ingrid, quienes hoy dirigen el Colegio Boston Internacional, y su hijo David, pastor presidente de la Iglesia Boston Central. Damos gracias a Dios por su guía y mano protectora en estos 15 años en los cuales nuestro propósito ha sido servirle a Él, y ser fieles a un legado y una visión que nacieron en su corazón.          </p>\n          <div class=\"col-xs-12 hidden see-more-gradient\"></div>\n          <small><cite>24-10-2022</cite></small>\n        </blockquote>\n        <a class=\"pull-right btn btn-danger\" target=\"parent\" href=\"https://redboston.edu.co/index.php/nuestra-historia/\">Conocer más</a>\n\n      </div>",
                "customCss": ".conoce {\n  padding: 45px;\n  margin: 20px 0;\n  background-color: #EEE;\n  border-radius: 10px;\n}\n\nh3 {\n  font-size: 24px;\n  color: var(--color-red-700);\n  font-family: 'Roboto';\n  padding: 8px;\n  margin-top: 2px;\n  border-left: 2px solid rgb(217 83 79);\n  margin-bottom: 42px;\n  font-weight: bolder;\n}",
                "maxWidth": "xl",
                "paddingY": 2
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