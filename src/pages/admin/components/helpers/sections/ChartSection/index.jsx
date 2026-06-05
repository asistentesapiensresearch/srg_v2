import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Container, Typography, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, BarChart2, Map as MapIcon, Scaling } from 'lucide-react'; // 🔥 Icono Scaling
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsMap from 'highcharts/modules/map';
import Highcharts3D from 'highcharts/highcharts-3d';

import { fetchSheet } from '@src/pages/admin/components/helpers/sections/DirectorySection/fetchSheet';
import ChartErrorBoundary from '@src/pages/admin/components/builder/helpers/ChartErrorBoundary';

const initHighchartsModule = (module, H) => {
    if (typeof module === 'function') module(H);
    else if (module && typeof module.default === 'function') module.default(H);
};
initHighchartsModule(highchartsMore, Highcharts);
initHighchartsModule(highchartsMap, Highcharts);

initHighchartsModule(Highcharts3D, Highcharts);

// Tipos de gráficos válidos
const VALID_CHART_TYPES = [
    'line', 'spline', 'area', 'areaspline', 'column', 'bar', 'pie', 'scatter',
    'arearange', 'areasplinerange', 'columnrange', 'bubble', 'gauge', 'boxplot',
    'errorbar', 'waterfall', 'polygon', 'packedbubble',
    'column_stacked', 'column_spline', 'column_spline_3d', 'multi_combo', 'min_max_marker',
    'map'
];

// 🔥 HOOK DE RESIZE (Funciona para Alto y Ancho)
const useChartResize = (chartRef, wrapperRef) => {
    useEffect(() => {
        if (!wrapperRef.current || !chartRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                // reflow() ajusta tanto el ancho como el alto
                if (chartRef.current?.chart) {
                    chartRef.current.chart.reflow();
                }
            });
        });

        resizeObserver.observe(wrapperRef.current);
        return () => resizeObserver.disconnect();
    }, [chartRef, wrapperRef]);
};

export default function ChartSection({
    sectionTitle,
    chartManager,
    height = 500,
    thumbnailsMode = 'auto'
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [allChartsData, setAllChartsData] = useState({});
    const [loading, setLoading] = useState(false);
    const [mapTopologies, setMapTopologies] = useState({});

    const scrollRef = useRef(null);
    const chartComponentRef = useRef(null);
    const resizablePaperRef = useRef(null);

    useChartResize(chartComponentRef, resizablePaperRef);

    const config = chartManager || {};
    const { fileId, charts: rawCharts } = config;

    const charts = useMemo(() => {
        if (!rawCharts) return [];
        return rawCharts.map(c => {
            const aliasLower = (c.alias || '').toLowerCase();
            const sheetNameLower = (c.sheetName || '').toLowerCase();

            if (c.alias?.includes("Histórico de colegios clasificados, 100 Mejores y Top") ||
                c.alias?.includes("Puntaje histórico del colegio por materias") ||
                aliasLower.includes("100 mejores y top") ||
                aliasLower.includes("historico de colegios clasificados") ||
                (sheetNameLower === "h1" && aliasLower.includes("materias"))
            ) {
                return { ...c, type: 'col_sapiens_comparative' };
            }
            if (c.alias?.includes("Histórico de colegios clasificados vs con y sin calificación") ||
                c.alias?.includes("Histórico de colegios clasificados vs calendario A y B") ||
                aliasLower.includes("vs con y sin calificacion") ||
                aliasLower.includes("vs calendario a y b")
            ) {
                return { ...c, type: 'col_sapiens_transposed' };
            }
            if (c.alias?.includes("Puntaje del colegio vs máximo y promedios otras regiones") ||
                aliasLower.includes("promedios otras regiones") ||
                (sheetNameLower === "h3" && aliasLower.includes("regiones"))
            ) {
                return { ...c, type: 'column_transposed_no_labels' };
            }
            if (c.alias?.includes("Número de colegios con similar o superior puntaje por materia") ||
                aliasLower.includes("similar o superior puntaje por materia") ||
                (sheetNameLower === "h5" && aliasLower.includes("similar")) ||
                c.sheetId === 1718754512
            ) {
                return { ...c, type: 'col_sapiens_comparative_with_zeros' };
            }
            if (c.alias?.includes("índices totales y por materias") ||
                aliasLower.includes("indices totales y por materias") ||
                aliasLower.includes("colegios clasificados con índices mayores") ||
                aliasLower.includes("colegios clasificados con indices mayores") ||
                sheetNameLower === "1" ||
                sheetNameLower === "2" ||
                sheetNameLower === "9"
            ) {
                return { ...c, type: 'col_sapiens_indices' };
            }
            if (c.alias?.includes("Promedio de promedios de los últimos tres años") ||
                aliasLower.includes("promedio de promedios de los ultimos tres") ||
                c.alias?.includes("Porcentajes de crecimiento mínimo por materia") ||
                aliasLower.includes("porcentajes de crecimiento minimo por materia") ||
                sheetNameLower === "10" ||
                sheetNameLower === "11"
            ) {
                return {
                    ...c,
                    type: 'col_sapiens_transposed_with_labels',
                    series: ["Ciencias", "Inglés", "Lectura", "Matemáticas", "Sociales"]
                };
            }
            return c;
        });
    }, [rawCharts]);

    const showThumbnails = useMemo(() => {
        if (!charts) return false;
        if (thumbnailsMode === 'never') return false;
        if (thumbnailsMode === 'always') return true;
        return charts.length > 2;
    }, [thumbnailsMode, charts]);

    // 1. CARGAR DATOS
    useEffect(() => {
        if (!fileId || !charts) return;
        const loadAllData = async () => {
            setLoading(true);
            const newDataCache = {};
            try {
                const promises = charts.map(async (chart) => {
                    const data = await fetchSheet(fileId, chart.sheetId);
                    newDataCache[chart.sheetId || chart.sheetName] = data;
                });
                await Promise.all(promises);
                setAllChartsData(newDataCache);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        loadAllData();
    }, [fileId, charts]);

    // 2. CARGAR TOPOLOGÍAS
    useEffect(() => {
        const mapCharts = charts?.filter(c => c.type === 'map') || [];
        if (mapCharts.length === 0) return;

        mapCharts.forEach(chart => {
            const scope = chart.mapScope || 'custom/world';
            if (!mapTopologies[scope]) {
                fetch(`https://code.highcharts.com/mapdata/${scope}.geo.json`)
                    .then(res => res.json())
                    .then(topo => setMapTopologies(prev => ({ ...prev, [scope]: topo })))
                    .catch(console.error);
            }
        });
    }, [charts, mapTopologies]);

    // 3. SCROLL
    useEffect(() => {
        if (scrollRef.current && showThumbnails) {
            const container = scrollRef.current;
            const activeElement = container.children[activeIndex];
            if (activeElement) {
                const offsetLeft = activeElement.offsetLeft;
                const elementWidth = activeElement.offsetWidth;
                const containerWidth = container.offsetWidth;

                container.scrollTo({
                    left: offsetLeft - (containerWidth / 2) + (elementWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [activeIndex, showThumbnails]);

    // 4. OPCIONES
    const getChartOptions = (chartConfig, data, isThumbnail = false) => {
        if (!data || !chartConfig) return null;

        let { type, xAxis, series: seriesCols } = chartConfig;

        // Validar que el tipo sea válido
        if (!VALID_CHART_TYPES.includes(type)) {
            console.warn(`Tipo de gráfico inválido: "${type}". Usando "column" como predeterminado.`);
            type = 'column';
        }

        // Añado seriesFromChartConfig and propertiesData para obtener la propiedad de xAxis y garantizar el valor de las etiquetas, ya sea "", o cualquier valor definido en el excel
        //  año  |  col-sapiens | sapiens | .....   -> ese año sera xLabel {año: valor} o  lo siguiente las series   ""  |  col-sapiens | sapiens |  -> "" tomara el valor de los objetos {"": valor}
        let seriesFromChartConfig = chartConfig.series;
        let propertiesData = Object.keys(data[0]);
        if (seriesFromChartConfig.length > 0 && propertiesData.length > 0 && seriesFromChartConfig.length < propertiesData.length) {
            xAxis = propertiesData.find(
                prop => !seriesFromChartConfig.includes(prop)
            );
        } else {
            xAxis = Object.keys(data[0])[0];
        }

        let finalSeries = [];
        let chartSpecificOptions = {};

        if (type === 'map') {
            const scope = chartConfig.mapScope || 'custom/world';
            const topology = mapTopologies[scope];
            const isWorldMap = scope.includes('world');

            const parseNumber = (val) => {
                if (val === undefined || val === null || val === '') return null;
                const cleaned = String(val).replace(/[^0-9.-]+/g, '');
                const parsed = parseFloat(cleaned);
                return Number.isNaN(parsed) ? null : parsed;
            };

            if (topology) {
                const validSeriesCols = (seriesCols || []).filter(col => {
                    if (col === xAxis) return false;
                    return data.some(row => parseNumber(row[col]) !== null);
                });

                finalSeries = validSeriesCols.map(colName => {
                    const seriesName = chartConfig.columnAliases?.[colName] || colName;

                    const mapPoints = data
                        .map(row => {
                            const rawCode = String(row[xAxis] || '').trim();
                            if (!rawCode) return null;

                            const code = isWorldMap
                                ? rawCode.toUpperCase()
                                : rawCode.toLowerCase();

                            const val = parseNumber(row[colName]);
                            if (val === null) return null;

                            return isWorldMap
                                ? { 'iso-a2': code, value: val }
                                : { 'hc-key': code, value: val };
                        })
                        .filter(Boolean);

                    return {
                        type: 'map',
                        name: seriesName,
                        data: mapPoints,
                        mapData: topology,
                        joinBy: isWorldMap
                            ? ['iso-a2', 'iso-a2']
                            : ['hc-key', 'hc-key'],
                        colorKey: 'value',
                        nullColor: '#f1f1f1',
                        borderColor: '#d9d9d9',
                        states: {
                            hover: { color: '#a4edba' }
                        },
                        dataLabels: {
                            enabled: !isThumbnail,
                            formatter: function () {
                                return this.point.value != null ? this.point.name : '';
                            }
                        }
                    };
                });

                chartSpecificOptions = {
                    mapNavigation: {
                        enabled: !isThumbnail,
                        buttonOptions: { verticalAlign: 'bottom' }
                    },
                    colorAxis: {
                        min: 0,
                        stops: [
                            [0, '#EFEFFF'],
                            [0.5, '#4444FF'],
                            [1, '#000022']
                        ]
                    }
                };
            }
        } else if (type === 'col_sapiens') {
            // Special inverted Col-Sapiens chart rendering
            const parsedData = data.map(row => {
                let yearLabel = String(row[xAxis] || row[""] || '').trim();
                // Format 4-digit years like "2013" to "2013-2014"
                if (/^\d{4}$/.test(yearLabel)) {
                    const startYear = parseInt(yearLabel, 10);
                    yearLabel = `${startYear}-${startYear + 1}`;
                }

                // Parse Category
                const catStr = String(row['Categoría'] || '').trim();
                const catMatch = catStr.match(/\d+/);
                const catVal = catMatch ? parseInt(catMatch[0], 10) : 0;

                // Parse Calificación
                const califStr = String(row['Calificación'] || '').trim();

                return {
                    name: yearLabel,
                    y: catVal,
                    categoryName: `D${catVal}`,
                    calificacion: califStr && califStr !== '-' ? califStr : '-'
                };
            });

            const categories = parsedData.map(d => d.name);

            finalSeries = [{
                name: 'Categoría y calificación',
                color: '#3b82f6', // Vibrant royal blue
                data: parsedData.map(d => ({
                    y: d.y,
                    categoryName: d.categoryName,
                    calificacion: d.calificacion
                })),
                dataLabels: {
                    enabled: !isThumbnail,
                    inside: false,
                    crop: false,
                    overflow: 'none',
                    useHTML: true,
                    verticalAlign: 'top', // In inverted Y-axis, places it below the column end
                    formatter: function () {
                        const point = this.point;
                        return `<div style="text-align: center; line-height: 1.3; font-family: sans-serif; font-size: 11px; font-weight: bold; color: #000;">
                            ${point.categoryName}<br/>
                            ${point.calificacion}
                        </div>`;
                    }
                }
            }];

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0,
                        autoRotation: false, // Prevent auto-rotation to diagonal
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    reversed: true,
                    categories: ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'],
                    title: {
                        text: 'Categoría',
                        style: {
                            fontWeight: 'bold',
                            fontSize: '12px',
                            color: '#666'
                        }
                    },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#555'
                        }
                    },
                    min: 0,
                    max: 10
                },
                plotOptions: {
                    column: {
                        borderRadius: 4,
                        groupPadding: 0.2,
                        pointPadding: 0.1,
                        point: {
                            events: {
                                mouseOver: function () {
                                    if (this.dataLabel) {
                                        this.dataLabel.hide();
                                    }
                                },
                                mouseOut: function () {
                                    if (this.dataLabel) {
                                        this.dataLabel.show();
                                    }
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    useHTML: true,
                    outside: true, // Renders the tooltip outside the SVG to always overlay elements correctly
                    shared: false,
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    distance: 25, // Leaves the tooltip lower down (further away from the column end)
                    formatter: function () {
                        const point = this.point;
                        return `
                            <table style="border-collapse: collapse; font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4;">
                                <tr>
                                    <td style="padding: 2px 16px 2px 0; color: #666; font-weight: normal;">Categoría:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${point.categoryName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px 16px 2px 0; color: #666; font-weight: normal;">Calificación:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${point.calificacion}</td>
                                </tr>
                            </table>
                        `;
                    }
                }
            };
        } else if (type === 'col_sapiens_comparative') {
            const categories = data.map(row => row[xAxis] || row[""] || '');

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            finalSeries = (seriesCols || []).map((colName, idx) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;

                // Stagger y-offsets to prevent horizontal labels from overlapping when bar heights are close
                const yOffset = idx % 2 === 0 ? -6 : -22;

                return {
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => parseVal(row[colName])),
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        allowOverlap: true,
                        rotation: 0,
                        y: yOffset,
                        formatter: function () {
                            return this.y > 0 ? this.y : '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: '9px',
                            textOutline: 'none'
                        }
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0,
                        autoRotation: false, // Strictly prevent Highcharts from rotating labels to diagonal
                        useHTML: true,
                        formatter: function () {
                            const val = String(this.value);
                            return val.replace(' (', '<br/>(');
                        },
                        style: {
                            fontSize: '10px',
                            fontFamily: 'inherit',
                            textAlign: 'center'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        borderRadius: 4,
                        groupPadding: 0.2,
                        pointPadding: 0.1
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true, // Renders the tooltip outside the SVG container so it sits on top of everything
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const points = this.points || [this.point];
                        if (!points) return null;
                        const activePoints = points.filter(p => p && p.y !== null && p.y !== undefined && p.y > 0);
                        if (activePoints.length === 0) return null;

                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px;">`;
                        // Header showing year/version
                        html += `<div style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: normal;">${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        activePoints.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y;
                            html += `
                                <tr>
                                    <td style="padding: 3px 24px 3px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 3px 0; text-align: right; font-weight: bold; color: #111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'col_sapiens_transposed') {
            const categories = (seriesCols || []).map(col => chartConfig.columnAliases?.[col] || col);

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            const yearColors = ['#3b82f6', '#ef4444', '#10b981', '#eab308', '#f97316', '#6b7280', '#8b5cf6'];

            finalSeries = data.map((row, idx) => {
                const yearLabel = String(row[xAxis] || row[""] || '').trim();

                // Stagger y-offsets to prevent horizontal labels from overlapping when bar heights are close
                const yOffset = idx % 2 === 0 ? -6 : -22;

                return {
                    name: yearLabel,
                    color: yearColors[idx % yearColors.length],
                    data: (seriesCols || []).map(col => parseVal(row[col])),
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        allowOverlap: true,
                        rotation: 0,
                        y: yOffset,
                        formatter: function () {
                            return this.y > 0 ? this.y : '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: '9px',
                            textOutline: 'none'
                        }
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0,
                        autoRotation: false,
                        style: {
                            fontSize: '11px',
                            fontWeight: 'bold',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        borderRadius: 3,
                        groupPadding: 0.18,
                        pointPadding: 0.03
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true,
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const points = this.points || [this.point];
                        if (!points) return null;
                        const activePoints = points.filter(p => p && p.y !== null && p.y !== undefined && p.y > 0);
                        if (activePoints.length === 0) return null;

                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px; max-height: 300px; overflow-y: auto;">`;
                        html += `<div style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: normal;">${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        activePoints.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y;
                            html += `
                                <tr>
                                    <td style="padding: 3px 24px 3px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 3px 0; text-align: right; font-weight: bold; color: #111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'col_sapiens_spline') {
            const categories = data.map(row => row[xAxis] || row[""] || '');

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            const allKeys = Object.keys(data[0] || {}).filter(k => k !== xAxis && k !== '');

            finalSeries = allKeys.map((colName) => {
                const seriesName = (chartConfig.columnAliases?.[colName] || colName).replace(/_\d+$/, '');
                
                // Identify the school position markers (red dots) vs actual year splines
                const isPositionDot = !/^\d{4}/.test(colName);

                if (isPositionDot) {
                    return {
                        name: seriesName,
                        type: 'line',
                        color: '#ff0000', // Red dot marker and legend item
                        lineWidth: 0,
                        states: {
                            hover: {
                                lineWidth: 0,
                                marker: {
                                    radius: 10
                                }
                            },
                            inactive: {
                                opacity: 0.1
                            }
                        },
                        marker: {
                            enabled: true,
                            radius: 8,
                            fillColor: '#ff0000',
                            lineColor: '#ff0000',
                            symbol: 'circle'
                        },
                        data: data.map(row => {
                            const val = parseVal(row[colName]);
                            return val > 0 ? val : null;
                        }),
                        dataLabels: {
                            enabled: !isThumbnail,
                            crop: false,
                            overflow: 'none',
                            allowOverlap: true,
                            rotation: 0,
                            y: -14,
                            formatter: function () {
                                return this.y > 0 ? this.y.toLocaleString('es-ES') : '';
                            },
                            style: {
                                fontWeight: 'bold',
                                color: '#000000',
                                fontSize: '11px',
                                textOutline: 'none'
                            }
                        }
                    };
                } else {
                    const seriesColor = chartConfig.columnColors?.[colName] || undefined;
                    const isThickLine = colName === '2021-22' || colName === '2025-26'; // Thick line to highlight active school years
                    return {
                        name: seriesName,
                        type: 'spline',
                        color: seriesColor,
                        lineWidth: isThickLine ? 4.5 : 1.8,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        data: data.map(row => parseVal(row[colName])),
                        states: {
                            inactive: {
                                opacity: 0.1
                            }
                        }
                    };
                }
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0, // Strictly horizontal / straight
                        autoRotation: false, // Prevent rotation to diagonal
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    series: {
                        states: {
                            inactive: {
                                opacity: 0.15
                            }
                        }
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true, // Renders the tooltip outside the SVG container so it sits on top of everything
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.4; padding: 4px; max-height: 500px; overflow-y: auto;">`;
                        // Header showing category
                        html += `<div style="font-size: 13px; font-weight: bold; color: #111; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px;">Categoría: ${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        this.points.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y;
                            
                            // Do not output empty single position dots in the tooltip list
                            if (point.series.options.lineWidth === 0 && (val === null || val === undefined || val <= 0)) {
                                return;
                            }
                            
                            html += `
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">
                                        <span style="color: ${seriesColor}; margin-right: 6px;">●</span>${seriesName}:
                                    </td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'col_sapiens_certified') {
            const categories = data.map(row => row[xAxis] || row[""] || '');

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            finalSeries = (seriesCols || []).map((colName) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;
                return {
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => parseVal(row[colName])),
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        formatter: function () {
                            return this.y > 0 ? this.y : '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: '11px',
                            textOutline: 'none'
                        }
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0, // Strictly straight
                        autoRotation: false, // Prevent rotation to diagonal
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        borderRadius: 4,
                        groupPadding: 0.2,
                        pointPadding: 0.1
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true, // Renders the tooltip outside the SVG container so it sits on top of everything
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const points = this.points || [this.point];
                        if (!points) return null;
                        const activePoints = points.filter(p => p && p.y > 0);
                        if (activePoints.length === 0) return null;

                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.4; padding: 4px;">`;
                        // Header showing category (e.g. D3)
                        html += `<div style="font-size: 13px; font-weight: bold; color: #111; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px;">${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        activePoints.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y;
                            html += `
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'col_sapiens_positions') {
            const categories = data.map(row => row[xAxis] || row[""] || '');

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '' || v === '-') return null;
                if (typeof v === 'string') {
                    const cleaned = v.replace(/[^0-9.-]+/g, "").trim();
                    if (cleaned === "") return null;
                    const parsed = parseFloat(cleaned);
                    return isNaN(parsed) ? null : parsed;
                }
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            finalSeries = (seriesCols || []).map((colName) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;
                return {
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => parseVal(row[colName])),
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        inside: false,
                        formatter: function () {
                            return this.y > 0 ? this.y : '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: '11px',
                            textOutline: 'none'
                        }
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0, // Strictly straight
                        autoRotation: false, // Prevent rotation to diagonal
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    reversed: true, // Inverted Y-axis!
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        borderRadius: 4,
                        groupPadding: 0.2,
                        pointPadding: 0.1
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true, // Renders the tooltip outside the SVG container so it sits on top of everything
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const activePoints = this.points.filter(p => p.y !== null && p.y !== undefined && p.y > 0);
                        if (activePoints.length === 0) return null;

                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.4; padding: 4px;">`;
                        // Header showing year (e.g. 2017)
                        html += `<div style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: normal;">${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        activePoints.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y;
                            html += `
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'column_stacked') {
            const categories = data.map(row => row[xAxis] || row[""] || '');

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            finalSeries = (seriesCols || []).map((colName) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;
                return {
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => parseVal(row[colName])),
                    dataLabels: {
                        enabled: !isThumbnail,
                        inside: true,
                        crop: false,
                        overflow: 'none',
                        verticalAlign: 'middle',
                        formatter: function () {
                            return this.y > 0 ? this.y : '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: '#ffffff',
                            fontSize: '10px',
                            textOutline: '1px solid #000000'
                        }
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0,
                        autoRotation: false,
                        useHTML: true,
                        formatter: function () {
                            let val = String(this.value);
                            val = val.replace(/^Máx-/, 'Máx-<br/>');
                            val = val.replace('Boston Internacional', 'Boston<br/>Internacional');
                            val = val.replace(/^Ref-1\s+/, 'Ref-1<br/>').replace(/^Ref-2\s+/, 'Ref-2<br/>');
                            if (val.includes(' privados')) {
                                val = val.replace(' privados', '<br/>privados');
                            }
                            if (val.includes(' públicos')) {
                                val = val.replace(' públicos', '<br/>públicos');
                            }
                            val = val.replace(/^Pm\s+/, 'Pm<br/>');
                            return val;
                        },
                        style: {
                            fontSize: '9px',
                            fontFamily: 'inherit',
                            textAlign: 'center'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    stackLabels: {
                        enabled: !isThumbnail,
                        style: {
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: '11px'
                        },
                        formatter: function () {
                            return this.total ? this.total.toLocaleString('es-ES') : '';
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: '#cccccc'
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true,
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const points = this.points || [this.point];
                        if (!points) return null;
                        const activePoints = points.filter(p => p && p.y !== null && p.y !== undefined && p.y > 0);
                        if (activePoints.length === 0) return null;

                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px;">`;
                        html += `<div style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: normal;">${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        [...activePoints].reverse().forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y;
                            html += `
                                <tr>
                                    <td style="padding: 3px 24px 3px 0; color: ${point.series.color}; font-weight: normal; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 3px 0; text-align: right; font-weight: bold; color: #111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'column_transposed_no_labels') {
            const categories = (seriesCols || []).map(col => chartConfig.columnAliases?.[col] || col);

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            const contextColors = [
                '#5371ea', '#ea0606', '#03ab05', '#e4c425', '#f04005', // first 5 institutional colors for subjects
                '#4b5563', '#991b1b', '#1e40af', '#6b21a8', '#065f46',
                '#854d0e', '#701a75', '#374151', '#9a3412', '#0284c7',
                '#0f766e', '#581c87', '#15803d'
            ];

            finalSeries = data.map((row, idx) => {
                const contextLabel = String(row[xAxis] || row[""] || '').trim();
                return {
                    name: contextLabel,
                    color: contextColors[idx % contextColors.length],
                    data: (seriesCols || []).map(col => parseVal(row[col])),
                    dataLabels: {
                        enabled: false // STRICTLY NO labels inside or above the columns!
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0,
                        autoRotation: false,
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        borderRadius: 3,
                        groupPadding: 0.15,
                        pointPadding: 0.03
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true,
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    style: {
                        pointerEvents: 'auto'
                    },
                    formatter: function () {
                        const points = this.points || [this.point];
                        if (!points) return null;
                        const activePoints = points.filter(p => p && p.y !== null && p.y !== undefined && p.y > 0);
                        if (activePoints.length === 0) return null;

                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px; max-height: 400px; overflow-y: auto;">`;
                        html += `<div style="font-size: 13px; font-weight: bold; color: #111; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px;">Asignatura: ${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        activePoints.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y;
                            html += `
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'col_sapiens_comparative_with_zeros') {
            const categories = data.map(row => row[xAxis] || row[""] || '');

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            finalSeries = (seriesCols || []).map((colName) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;
                return {
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => parseVal(row[colName]) ?? 0),
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        allowOverlap: true,
                        rotation: 0,
                        y: -6,
                        formatter: function () {
                            return this.y !== null && this.y !== undefined ? this.y : '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: '9px',
                            textOutline: 'none'
                        }
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0,
                        autoRotation: false,
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        borderRadius: 3,
                        groupPadding: 0.18,
                        pointPadding: 0.03
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true,
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const points = this.points || [this.point];
                        if (!points) return null;
                        const activePoints = points.filter(p => p && p.y !== null && p.y !== undefined);
                        if (activePoints.length === 0) return null;

                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px;">`;
                        html += `<div style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: normal;">${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        activePoints.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y;
                            html += `
                                <tr>
                                    <td style="padding: 3px 24px 3px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 3px 0; text-align: right; font-weight: bold; color: #111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'col_sapiens_indices') {
            const firstRow = data[0] || {};
            const years = Object.keys(firstRow).filter(k => k !== 'Año' && k !== '' && /^\d{4}$/.test(k));
            
            const isVariation = chartConfig.alias?.toLowerCase().includes("variaciones") || chartConfig.sheetName === "2";
            const categories = isVariation ? years.slice(1) : years;

            const isIntegerChart = chartConfig.alias?.toLowerCase().includes("número") || chartConfig.alias?.toLowerCase().includes("numero") || chartConfig.sheetName === "9";

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            const getSubjectName = (name) => {
                const trimmed = String(name || '').trim();
                if (trimmed.toLowerCase() === 'mate' || trimmed.toLowerCase() === 'matemáticas' || trimmed.toLowerCase() === 'matematicas') {
                    return 'Matemáticas';
                }
                return trimmed;
            };

            const subjectColors = {
                'Total': '#29b6f6',
                'Ind. Total': '#29b6f6',
                'Matemáticas': '#5c6bc0',
                'Ciencias': '#00d47a',
                'Sociales': '#ff7043',
                'Lectura': '#78909c',
                'Inglés': '#d946ef'
            };

            finalSeries = data.map((row) => {
                const rawSubject = row['Año'] || row[xAxis] || '';
                const subjectName = getSubjectName(rawSubject);
                const color = subjectColors[subjectName] || undefined;

                let rowData = [];
                if (isVariation) {
                    rowData = categories.map((year, idx) => {
                        const currentVal = parseVal(row[year]);
                        const prevYear = years[idx]; // years has 2017 at index 0, so years[idx] is the previous year
                        const prevVal = parseVal(row[prevYear]);
                        if (currentVal === null || prevVal === null) return null;
                        return Number((currentVal - prevVal).toFixed(4));
                    });
                } else {
                    rowData = categories.map(year => parseVal(row[year]));
                }

                return {
                    name: subjectName,
                    color: color,
                    data: rowData,
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        allowOverlap: true,
                        rotation: 0,
                        y: -8,
                        formatter: function () {
                            if (this.y === null || this.y === undefined) return '';
                            if (isIntegerChart) {
                                return this.y.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                            return this.y.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 4 });
                        },
                        style: {
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: '9px',
                            textOutline: 'none'
                        }
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0,
                        autoRotation: false,
                        step: 1, // STRICTLY show every year
                        style: {
                            fontSize: '11px',
                            fontWeight: 'bold',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    ...((isVariation || isIntegerChart) ? {} : { min: 0.75, max: 1 }),
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        borderRadius: 3,
                        groupPadding: 0.18,
                        pointPadding: 0.03
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true,
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const points = this.points || [this.point];
                        if (!points || points.length === 0) return null;

                        const year = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px;">`;
                        html += `<div style="font-size: 11px; color: #666; margin-bottom: 6px; font-weight: normal;">${year}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        points.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y !== null && point.y !== undefined
                                ? point.y.toLocaleString('es-ES', isIntegerChart ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : { minimumFractionDigits: 1, maximumFractionDigits: 4 })
                                : '-';
                            html += `
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: ${seriesColor}; font-weight: bold; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else if (type === 'col_sapiens_transposed_with_labels') {
            const categories = (seriesCols || []).map(col => chartConfig.columnAliases?.[col] || col);

            const parseVal = (v) => {
                if (v === undefined || v === null || v === '') return null;
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, "");
                const parsed = parseFloat(v);
                return isNaN(parsed) ? null : parsed;
            };

            const contextColors = ['#29b6f6', '#5c6bc0', '#00d47a', '#ff7043', '#78909c', '#d946ef'];

            finalSeries = data.map((row, idx) => {
                const contextLabel = String(row[xAxis] || row['Año'] || row['Materia'] || row[''] || '').trim();
                return {
                    name: contextLabel,
                    color: contextColors[idx % contextColors.length],
                    data: (seriesCols || []).map(col => parseVal(row[col])),
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        allowOverlap: true,
                        rotation: 0,
                        y: -8,
                        formatter: function () {
                            return this.y !== null && this.y !== undefined
                                ? this.y.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
                                : '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: '10px',
                            textOutline: 'none'
                        }
                    }
                };
            });

            chartSpecificOptions = {
                xAxis: {
                    categories,
                    crosshair: true,
                    lineColor: '#e0e0e0',
                    labels: {
                        rotation: 0,
                        autoRotation: false,
                        style: {
                            fontSize: '11px',
                            fontWeight: 'bold',
                            fontFamily: 'inherit'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    gridLineColor: '#f0f0f0',
                    labels: {
                        style: {
                            fontSize: '11px',
                            fontFamily: 'inherit'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        borderRadius: 3,
                        groupPadding: 0.18,
                        pointPadding: 0.03
                    }
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    outside: true,
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    borderRadius: 8,
                    shadow: true,
                    padding: 8,
                    formatter: function () {
                        const points = this.points || [this.point];
                        if (!points || points.length === 0) return null;

                        const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                        let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px;">`;
                        html += `<div style="font-size: 11px; color: #666; margin-bottom: 6px; font-weight: normal;">${categoryName}</div>`;
                        html += `<table style="border-collapse: collapse; width: 100%;">`;

                        points.forEach(point => {
                            const seriesName = point.series.name;
                            const seriesColor = point.series.color;
                            const val = point.y !== null && point.y !== undefined
                                ? point.y.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
                                : '-';
                            html += `
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: ${seriesColor}; font-weight: bold; text-align: left;">${seriesName}:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111111;">${val}</td>
                                </tr>
                            `;
                        });

                        html += `</table></div>`;
                        return html;
                    }
                }
            };
        } else {
            const categories = data.map(row => row[xAxis] || row[""] || '');
            finalSeries = (seriesCols || []).map((colName) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;
                return {
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => {
                        let val = row[colName];
                        if (typeof val === 'string') val = val.replace(/[^0-9.-]+/g, "");
                        return parseFloat(val) || 0;
                    })
                };
            });
            chartSpecificOptions = {
                xAxis: { categories, crosshair: true, lineColor: '#e0e0e0' },
                yAxis: { title: { text: null }, gridLineColor: '#f0f0f0' },
            };
        }

        const commonOptions = {
            credits: { enabled: false },
            title: { text: null },
            chart: {
                type: type || 'column',
                height: isThumbnail ? 80 : null,
                backgroundColor: isThumbnail ? 'transparent' : '#ffffff',
                borderRadius: 8,
                style: { fontFamily: 'inherit' }
            },
            //subtitle: { text: isThumbnail ? null : `Fuente: ${chartConfig.alias || chartConfig.sheetName}` },
            legend: { enabled: !isThumbnail, align: 'center', verticalAlign: 'bottom' },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 768
                    },
                    chartOptions: {
                        subtitle: {
                            text: null
                        }
                    }
                }]
            },
            series: finalSeries,
            ...chartSpecificOptions
        };

        if (isThumbnail) {
            commonOptions.xAxis = { visible: false };
            commonOptions.yAxis = { visible: false };
            commonOptions.tooltip = { enabled: false };
            commonOptions.plotOptions = { series: { enableMouseTracking: false, marker: { enabled: false } } };
        }

        // Personalizadas
        if (type === 'col_sapiens' || type === 'col_sapiens_comparative' || type === 'col_sapiens_transposed' || type === 'col_sapiens_certified' || type === 'col_sapiens_positions' || type === 'column_transposed_no_labels' || type === 'col_sapiens_comparative_with_zeros' || type === 'col_sapiens_indices' || type === 'col_sapiens_transposed_with_labels') {
            commonOptions.chart.type = 'column';
        }
        if (type === 'col_sapiens_spline') {
            commonOptions.chart.type = 'spline';
        }
        // add stacking
        if (type === 'column_stacked') {
            commonOptions.chart.type = 'column';
            commonOptions.plotOptions = {
                ...(commonOptions.plotOptions || {}),
                column: {
                    ...(commonOptions.plotOptions?.column || {}),
                    stacking: 'normal'
                }
            };
        }

        if (type === 'column_spline' || type === 'column_spline_3d') {
            commonOptions.chart.type = 'column';
            if (type === 'column_spline_3d') {
                commonOptions.chart.options3d = {
                    enabled: true,
                    alpha: type === 'column_spline_3d_rotated' ? 18 : 10,
                    beta: type === 'column_spline_3d_rotated' ? 28 : 15,
                    depth: 55,
                    viewDistance: 25,
                    frame: {
                        bottom: { size: 1, color: 'transparent' },
                        back: { size: 1, color: 'transparent' },
                        side: { size: 1, color: 'transparent' }
                    }
                };
            }

            commonOptions.series = (seriesCols || []).map((colName, index) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;

                const isColumn = index !== 0;

                return {
                    type: isColumn ? 'column' : 'spline',
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => {
                        let val = row[colName];
                        if (typeof val === 'string') val = val.replace(/[^0-9.-]+/g, "");
                        return parseFloat(val) || 0;
                    }),
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        allowOverlap: true,
                        rotation: 0,
                        y: isColumn ? -8 : -12,
                        formatter: function () {
                            if (this.series.type === 'column') {
                                return this.y > 0 ? this.y.toLocaleString('es-ES') : '';
                            }
                            if (this.series.customHovered) {
                                return this.y > 0 ? this.y.toLocaleString('es-ES') : '';
                            }
                            return '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: isColumn ? '#000000' : (seriesColor || '#333333'),
                            fontSize: isColumn ? '11px' : '10px',
                            textOutline: 'none'
                        }
                    },
                    ...(isColumn
                        ? {
                            borderRadius: 3
                        }
                        : {
                            marker: {
                                enabled: true,
                                radius: 4
                            },
                            states: {
                                hover: {
                                    lineWidthPlus: 1.5,
                                    marker: {
                                        radius: 6
                                    }
                                }
                            },
                            events: {
                                legendItemMouseOver: function () {
                                    this.customHovered = true;
                                    this.setState('hover');
                                    this.chart.series.forEach(s => {
                                        if (s.type === 'spline') {
                                            if (s !== this) {
                                                s.setState('inactive');
                                            } else {
                                                s.setState('hover');
                                            }
                                        }
                                    });
                                    this.chart.redraw();
                                },
                                legendItemMouseOut: function () {
                                    this.customHovered = false;
                                    this.setState('');
                                    this.chart.series.forEach(s => {
                                        if (s.type === 'spline') {
                                            s.setState('');
                                        }
                                    });
                                    this.chart.redraw();
                                }
                            }
                        })
                };
            });

            const categories = data.map(row => row[xAxis] || row[""] || '');

            // Directly mutate commonOptions since spreading happens before this block
            commonOptions.xAxis = {
                categories,
                crosshair: true,
                lineColor: '#e0e0e0',
                labels: {
                    rotation: 0,
                    autoRotation: false,
                    style: {
                        fontSize: '11px',
                        fontFamily: 'inherit'
                    }
                }
            };

            commonOptions.yAxis = {
                title: { text: null },
                gridLineColor: '#f0f0f0',
                labels: {
                    style: {
                        fontSize: '11px',
                        fontFamily: 'inherit'
                    }
                }
            };

            commonOptions.plotOptions = {
                ...(commonOptions.plotOptions || {}),
                series: {
                    states: {
                        inactive: {
                            opacity: 0.1
                        }
                    }
                }
            };

            commonOptions.tooltip = {
                useHTML: true,
                shared: true, // Beautiful shared tooltip!
                outside: true,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#dddddd',
                borderRadius: 8,
                shadow: true,
                padding: 8,
                formatter: function () {
                    const points = this.points;
                    if (!points || points.length === 0) return null;

                    const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                    let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px;">`;
                    html += `<div style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: normal;">${categoryName}</div>`;
                    html += `<table style="border-collapse: collapse; width: 100%;">`;

                    points.forEach(point => {
                        const seriesName = point.series.name;
                        const seriesColor = point.series.color;
                        const val = point.y !== null && point.y !== undefined ? point.y.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) : '-';
                        html += `
                            <tr>
                                <td style="padding: 2px 24px 2px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">
                                    <span style="color: ${seriesColor}; margin-right: 6px;">●</span>${seriesName}:
                                </td>
                                <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111111;">${val}</td>
                            </tr>
                        `;
                    });

                    html += `</table></div>`;
                    return html;
                }
            };
        }

        if (type === 'multi_combo') {
            commonOptions.chart.type = 'column';

            commonOptions.series = (seriesCols || []).map((colName, index) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;
                const seriesType = index === 0 ? 'column' : 'spline';

                const isColumn = seriesType === 'column';

                return {
                    type: seriesType,
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => {
                        let val = row[colName];
                        if (typeof val === 'string') val = val.replace(/[^0-9.-]+/g, "");
                        return parseFloat(val) || 0;
                    }),
                    dataLabels: {
                        enabled: !isThumbnail,
                        crop: false,
                        overflow: 'none',
                        allowOverlap: true,
                        rotation: 0,
                        y: isColumn ? -8 : -12,
                        formatter: function () {
                            if (this.series.type === 'column') {
                                return this.y > 0 ? this.y.toLocaleString('es-ES') : '';
                            }
                            if (this.series.customHovered) {
                                return this.y > 0 ? this.y.toLocaleString('es-ES') : '';
                            }
                            return '';
                        },
                        style: {
                            fontWeight: 'bold',
                            color: isColumn ? '#000000' : (seriesColor || '#333333'),
                            fontSize: isColumn ? '11px' : '10px',
                            textOutline: 'none'
                        }
                    },
                    ...(isColumn
                        ? {
                            borderRadius: 3
                        }
                        : {
                            marker: {
                                enabled: true,
                                radius: 3
                            },
                            lineWidth: 2,
                            states: {
                                hover: {
                                    lineWidthPlus: 1.5,
                                    marker: {
                                        radius: 5
                                    }
                                }
                            },
                            events: {
                                legendItemMouseOver: function () {
                                    this.customHovered = true;
                                    this.setState('hover');
                                    this.chart.series.forEach(s => {
                                        if (s.type === 'spline') {
                                            if (s !== this) {
                                                s.setState('inactive');
                                            } else {
                                                s.setState('hover');
                                            }
                                        }
                                    });
                                    this.chart.redraw();
                                },
                                legendItemMouseOut: function () {
                                    this.customHovered = false;
                                    this.setState('');
                                    this.chart.series.forEach(s => {
                                        if (s.type === 'spline') {
                                            s.setState('');
                                        }
                                    });
                                    this.chart.redraw();
                                }
                            }
                        })
                };
            });

            const categories = data.map(row => row[xAxis] || row[""] || '');

            commonOptions.xAxis = {
                categories,
                crosshair: true,
                lineColor: '#e0e0e0',
                labels: {
                    rotation: 0,
                    autoRotation: false,
                    style: {
                        fontSize: '11px',
                        fontFamily: 'inherit'
                    }
                }
            };

            commonOptions.yAxis = {
                title: { text: null },
                gridLineColor: '#f0f0f0',
                labels: {
                    style: {
                        fontSize: '11px',
                        fontFamily: 'inherit'
                    }
                }
            };

            commonOptions.plotOptions = {
                ...(commonOptions.plotOptions || {}),
                series: {
                    states: {
                        inactive: {
                            opacity: 0.1
                        }
                    }
                },
                column: {
                    ...(commonOptions.plotOptions?.column || {}),
                    borderRadius: 4,
                    pointPadding: 0.1
                },
                spline: {
                    ...(commonOptions.plotOptions?.spline || {}),
                    lineWidth: 2,
                    marker: {
                        enabled: true,
                        radius: 3
                    }
                }
            };

            commonOptions.tooltip = {
                useHTML: true,
                shared: true, // Beautiful shared tooltip!
                outside: true,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#dddddd',
                borderRadius: 8,
                shadow: true,
                padding: 8,
                formatter: function () {
                    const points = this.points;
                    if (!points || points.length === 0) return null;

                    const categoryName = (categories && categories[this.x] !== undefined) ? categories[this.x] : this.x;
                    let html = `<div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px;">`;
                    html += `<div style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: normal;">${categoryName}</div>`;
                    html += `<table style="border-collapse: collapse; width: 100%;">`;

                    points.forEach(point => {
                        const seriesName = point.series.name;
                        const seriesColor = point.series.color;
                        const val = point.y !== null && point.y !== undefined ? point.y.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) : '-';
                        html += `
                            <tr>
                                <td style="padding: 2px 24px 2px 0; color: ${seriesColor}; font-weight: normal; text-align: left;">
                                    <span style="color: ${seriesColor}; margin-right: 6px;">●</span>${seriesName}:
                                </td>
                                <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111111;">${val}</td>
                            </tr>
                        `;
                    });

                    html += `</table></div>`;
                    return html;
                }
            };
        }

        if (type === 'min_max_marker') {
            commonOptions.chart.type = 'boxplot';

            const categories = data.map(row => row[xAxis] ?? row[""] ?? '');

            const minCol = seriesCols?.[0];
            const schoolCol = seriesCols?.[1];
            const schoolCol2025 = seriesCols?.[3];
            const maxCol = seriesCols?.[4];

            const parseValue = (val) => {
                if (val === undefined || val === null || val === '') return null;
                if (typeof val === 'string') {
                    val = val.replace(/[^0-9.-]+/g, "");
                }
                const parsed = parseFloat(val);
                return Number.isNaN(parsed) ? null : parsed;
            };

            const boxplotData = data.map((row, idx) => {
                const low = parseValue(row[minCol]);
                const high = parseValue(row[maxCol]);
                const score2024 = parseValue(row[schoolCol]);
                const score2025 = parseValue(row[schoolCol2025]);

                return {
                    x: idx,
                    low: low,
                    q1: Math.min(score2024, score2025),
                    median: null,
                    q3: Math.max(score2024, score2025),
                    high: high,
                    score2024: score2024,
                    score2025: score2025
                };
            });

            //obtener el maximo para poner en el tamaño de la grafica
            const values = data.flatMap(row =>
                seriesCols.map(col => parseValue(row[col]))
            ).filter(v => v !== null && !Number.isNaN(v));

            const maxY = Math.max(...values);
            const minY = Math.min(...values);

            commonOptions.xAxis = {
                categories,
                crosshair: false,
                lineColor: '#e0e0e0',
                labels: {
                    rotation: 0,
                    autoRotation: false,
                    style: {
                        fontSize: '11px',
                        fontFamily: 'inherit'
                    }
                }
            };

            commonOptions.yAxis = {
                title: { text: 'Puntajes' },
                min: minY || 0,
                max: maxY || 100,
                gridLineColor: '#f0f0f0'
            };

            let seriesName = '2024 a 2025';
            if (chartConfig.alias?.toLowerCase().includes("totales") || chartConfig.sheetName === "3_ITotal") {
                seriesName = 'índices Totales';
            } else if (chartConfig.alias?.toLowerCase().includes("matemáticas") || chartConfig.sheetName === "4_Mat") {
                seriesName = 'índices de Matemáticas';
            } else if (chartConfig.alias?.toLowerCase().includes("ciencias") || chartConfig.sheetName === "5_Cie") {
                seriesName = 'índices de Ciencias';
            } else if (chartConfig.alias?.toLowerCase().includes("sociales") || chartConfig.sheetName === "6_Soc") {
                seriesName = 'índices de Sociales';
            } else if (chartConfig.alias?.toLowerCase().includes("lectura") || chartConfig.sheetName === "7_Lec") {
                seriesName = 'índices de Lectura';
            } else if (chartConfig.alias?.toLowerCase().includes("inglés") || chartConfig.sheetName === "8_Ing") {
                seriesName = 'índices de Inglés';
            }

            const boxplotSeries = {
                name: seriesName,
                type: 'boxplot',
                color: '#2563eb', // Blue legend dot!
                fillColor: '#16a34a', // Solid green box background
                lineColor: '#16a34a', // Green box border
                stemColor: '#e74c3c', // Red dotted stem
                whiskerColor: '#e74c3c', // Red whisker line
                whiskerLength: '60%',
                whiskerWidth: 2,
                stemWidth: 2,
                stemDashStyle: 'Dot',
                data: boxplotData
            };

            commonOptions.series = [boxplotSeries];

            commonOptions.plotOptions = {
                ...(commonOptions.plotOptions || {}),
                boxplot: {
                    color: '#2563eb',
                    fillColor: '#16a34a',
                    lineColor: '#16a34a',
                    stemColor: '#e74c3c',
                    whiskerColor: '#e74c3c'
                }
            };

            commonOptions.legend = {
                enabled: !isThumbnail,
                align: 'center',
                verticalAlign: 'bottom'
            };

            commonOptions.tooltip = {
                shared: false,
                useHTML: true,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#dddddd',
                borderRadius: 8,
                shadow: true,
                padding: 8,
                formatter: function () {
                    const point = this.point;
                    return `
                        <div style="font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; padding: 4px;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 6px; font-weight: normal;">${this.key}</div>
                            <span style="color:#2563eb; font-size: 15px; margin-right: 4px;">●</span><b>${seriesName}</b><br/>
                            <table style="border-collapse: collapse; margin-top: 6px; width: 100%;">
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: #666; font-weight: normal;">Maximum:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${point.high}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: #666; font-weight: normal;">Upper quartile:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${point.score2025}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: #666; font-weight: normal;">Median:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;"></td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: #666; font-weight: normal;">Lower quartile:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${point.score2024}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px 24px 2px 0; color: #666; font-weight: normal;">Minimum:</td>
                                    <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #111;">${point.low}</td>
                                </tr>
                            </table>
                        </div>
                    `;
                }
            };
        }

        return commonOptions;
    };

    const activeChartConfig = charts?.[activeIndex];
    const activeData = allChartsData[activeChartConfig?.sheetId || activeChartConfig?.sheetName];

    const mainOptions = useMemo(() =>
        getChartOptions(activeChartConfig, activeData, false),
        [activeChartConfig, activeData, mapTopologies]);

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % charts.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + charts.length) % charts.length);

    if (!charts || charts.length === 0) return null;

    return (
        <ChartErrorBoundary>
            <Container maxWidth="xl" disableGutters sx={{ pt: 2 }}>
                {sectionTitle && (
                    <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom sx={{ mb: 4 }}>
                        {sectionTitle}
                    </Typography>
                )}

                {!loading && mainOptions ? (
                    <div className='flex items-center justify-center'>
                        <Paper
                            ref={resizablePaperRef}
                            elevation={0}
                            sx={{
                                p: 3, border: '1px solid #e0e0e0', borderRadius: 4, mb: 2,
                                position: 'relative',
                                // 🔥🔥🔥 CAMBIO PRINCIPAL PARA RESIZE TOTAL 🔥🔥🔥
                                resize: 'both',       // Permite redimensionar ancho y alto
                                overflow: 'hidden',   // Necesario para que resize funcione
                                width: "100%",
                                minHeight: {
                                    xs: 650,
                                    md: height
                                },    // Altura inicial/mínima
                                maxWidth: '100%',     // Evita que se salga del contenedor padre
                                minWidth: 0,    // Evita que se haga diminuto
                                height: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover .resize-handle': { opacity: 1 }
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexShrink={0}>
                                <Typography variant="h6" fontWeight="bold">{activeChartConfig.alias}</Typography>
                                {charts.length > 1 && <Typography variant="caption" color="text.secondary">{activeIndex + 1} / {charts.length}</Typography>}
                            </Box>

                            <Box sx={{ flexGrow: 1, minHeight: 0, position: 'relative' }}>
                                <HighchartsReact
                                    key={`${activeIndex}-${activeChartConfig.type}`}
                                    ref={chartComponentRef}
                                    highcharts={Highcharts}
                                    options={mainOptions}
                                    constructorType={activeChartConfig.type === 'map' ? 'mapChart' : 'chart'}
                                    containerProps={{ style: { height: '100%', width: '100%', position: 'absolute' } }}
                                />
                            </Box>

                            {/* Indicador visual de resize diagonal */}
                            <Box
                                className="resize-handle"
                                sx={{
                                    position: 'absolute', bottom: 4, right: 4, opacity: 0.3, transition: 'opacity 0.2s',
                                    pointerEvents: 'none', color: '#888', zIndex: 10
                                }}
                            >
                                <Scaling size={20} />
                            </Box>
                        </Paper>
                    </div>
                ) : (
                    loading && !activeData && <Box height={height} width={"100%"} display="flex" justifyContent="center" alignItems="center" bgcolor="#f9fafb" borderRadius={4}><CircularProgress /></Box>
                )}

                {showThumbnails && (
                    <Box sx={{ position: 'relative', px: { xs: 0, md: 6 } }}>
                        <IconButton onClick={handlePrev} sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white', border: '1px solid #ddd' }}><ChevronLeft size={20} /></IconButton>
                        <Grid ref={scrollRef} container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 2, scrollBehavior: 'smooth', '&::-webkit-scrollbar': { height: 6 } }}>
                            {charts.map((chart, idx) => {
                                const data = allChartsData[chart.sheetId || chart.sheetName];
                                const thumbOptions = getChartOptions(chart, data, true);
                                const isActive = idx === activeIndex;
                                return (
                                    <Grid key={idx} item sx={{ minWidth: 200, maxWidth: 220, flexShrink: 0 }}>
                                        <Paper
                                            elevation={isActive ? 3 : 0} onClick={() => setActiveIndex(idx)}
                                            sx={{ p: 1.5, cursor: 'pointer', border: isActive ? `2px solid ${chart.color || '#1976d2'}` : '1px solid #eee', borderRadius: 3, opacity: isActive ? 1 : 0.7, transition: 'all 0.3s ease' }}
                                        >
                                            <Box height={80} mb={1} bgcolor="#f9fafb" borderRadius={2} overflow="hidden">
                                                {data ? <HighchartsReact key={`${idx}-${chart.type}`} highcharts={Highcharts} options={thumbOptions} constructorType={chart.type === 'map' ? 'mapChart' : 'chart'} /> : <Box height="100%" display="flex" justifyContent="center" alignItems="center">{chart.type === 'map' ? <MapIcon size={20} color="#ddd" /> : <BarChart2 size={20} color="#ddd" />}</Box>}
                                            </Box>
                                            <Typography variant="caption" fontWeight="bold" noWrap display="block">{chart.alias}</Typography>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        <IconButton onClick={handleNext} sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white', border: '1px solid #ddd' }}><ChevronRight size={20} /></IconButton>
                    </Box>
                )}
            </Container>
        </ChartErrorBoundary>
    );
}