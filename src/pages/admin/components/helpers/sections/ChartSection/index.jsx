import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Container, Typography, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, BarChart2, Map as MapIcon, Scaling } from 'lucide-react'; // 🔥 Icono Scaling
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsMap from 'highcharts/modules/map';
import Highcharts3D from 'highcharts/highcharts-3d';

import { fetchSheet } from '@src/pages/admin/components/helpers/sections/DirectorySection/fetchSheet';

const initHighchartsModule = (module, H) => {
    if (typeof module === 'function') module(H);
    else if (module && typeof module.default === 'function') module.default(H);
};
initHighchartsModule(highchartsMore, Highcharts);
initHighchartsModule(highchartsMap, Highcharts);

initHighchartsModule(Highcharts3D, Highcharts);

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
    width = 500,
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
    const { fileId, charts } = config;

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
            const activeElement = scrollRef.current.children[activeIndex];
            if (activeElement) activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeIndex, showThumbnails]);

    // 4. OPCIONES
    const getChartOptions = (chartConfig, data, isThumbnail = false) => {
        if (!data || !chartConfig) return null;

        let { type, xAxis, series: seriesCols } = chartConfig;

        // Añado seriesFromChartConfig and propertiesData para obtener la propiedad de xAxis y garantizar el valor de las etiquetas, ya sea "", o cualquier valor definido en el excel
        //  año  |  col-sapiens | sapiens | .....   -> ese año sera xLabel {año: valor} o  lo siguiente las series   ""  |  col-sapiens | sapiens |  -> "" tomara el valor de los objetos {"": valor}
        let seriesFromChartConfig = chartConfig.series;
        let propertiesData = Object.keys(data[0]);
        if(seriesFromChartConfig.length > 0 && propertiesData.length > 0 && seriesFromChartConfig.length < propertiesData.length) {
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
            subtitle: { text: isThumbnail ? null : `Fuente: ${chartConfig.alias || chartConfig.sheetName}` },
            legend: { enabled: !isThumbnail, align: 'center', verticalAlign: 'bottom' },
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
        // add stacking
        if(type === 'column_stacked') {
            commonOptions.chart.type = 'column';
            commonOptions.plotOptions = {
                ...(commonOptions.plotOptions || {}),
                column: {
                    ...(commonOptions.plotOptions?.column || {}),
                    stacking: 'normal'
                }
            };
        }

        if(type === 'column_spline' || type === 'column_spline_3d') {
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

                return {
                    type: index === 0 ? 'spline' : 'column',
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => {
                        let val = row[colName];
                        if (typeof val === 'string') val = val.replace(/[^0-9.-]+/g, "");
                        return parseFloat(val) || 0;
                    }),
                    ...(index !== 0
                        ? {
                            marker: {
                                enabled: true,
                                radius: 4
                            }
                        }
                        : {})
                };
            });
        }

        if (type === 'multi_combo') {
            commonOptions.chart.type = 'column';

            commonOptions.series = (seriesCols || []).map((colName, index) => {
                const seriesName = chartConfig.columnAliases?.[colName] || colName;
                const seriesColor = chartConfig.columnColors?.[colName] || undefined;
                const seriesType = index === 0 ? 'column' : 'spline';
                return {
                    type: seriesType,
                    name: seriesName,
                    color: seriesColor,
                    data: data.map(row => {
                        let val = row[colName];
                        if (typeof val === 'string') val = val.replace(/[^0-9.-]+/g, "");
                        return parseFloat(val) || 0;
                    }),
                    ...(seriesType === 'spline'
                        ? {
                            marker: {
                                enabled: true,
                                radius: 3
                            },
                            lineWidth: 2
                        }
                        : {
                            borderRadius: 3
                        })
                };
            });

            commonOptions.plotOptions = {
                ...(commonOptions.plotOptions || {}),
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
        }

        if (type === 'min_max_marker') {
            commonOptions.chart.type = 'line';

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

            //obtener el maximo para poner en el tamaño de la grafica
            const values = data.flatMap(row => 
                seriesCols.map(col => parseValue(row[col]))
            ).filter(v => v !== null && !Number.isNaN(v));

            const maxY = Math.max(...values);
            const minY = Math.min(...values);

            commonOptions.xAxis = {
                categories,
                crosshair: false,
                lineColor: '#e0e0e0'
            };

            commonOptions.yAxis = {
                title: { text: 'Puntajes' },
                min: minY || 0,
                max: maxY || 100,
                gridLineColor: '#f0f0f0'
            };

            const rangeSeries = {
                type: 'errorbar',
                name: 'Rango mínimo-máximo',
                color: '#e74c3c',

                data: data.map(row => [
                    parseValue(row[minCol]),
                    parseValue(row[maxCol])
                ]),

                whiskerWidth: 2,
                whiskerLength: '60%',
                stemWidth: 2,
                lineWidth: 1.5,

                dashStyle: 'Dot',

                tooltip: {
                    pointFormatter: function () {
                        return `Min: ${this.low}<br/>Max: ${this.high}`;
                    }
                }
            };

            // Serie 2: rayitas horizontales verdes
            // Truco: pequeños segmentos por categoría
            const schoolLineData = [];
            data.forEach((row, i) => {
                const y = parseValue(row[schoolCol]);

                schoolLineData.push(
                    [i - 0.18, y],
                    [i + 0.18, y],
                    [null, null]
                );
            });

            const schoolSeries = {
                type: 'line',
                name: chartConfig.columnAliases?.[schoolCol] || schoolCol,
                color: '#16a34a',
                lineWidth: 4,
                marker: {
                    enabled: false
                },
                enableMouseTracking: false,
                data: schoolLineData,
                dataLabels: {
                    enabled: false
                }
            };

            commonOptions.series = [rangeSeries, schoolSeries];

            commonOptions.plotOptions = {
                ...(commonOptions.plotOptions || {}),
                errorbar: {
                    color: '#e74c3c'
                },
                line: {
                    animation: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
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
                formatter: function () {
                    const point = this.point;

                    const pointIndex =
                        this.series.type === 'errorbar'
                            ? point.x
                            : Math.round(point.x);

                    const category = categories[pointIndex] ?? '';

                    const schoolValue2024 = parseValue(data[pointIndex]?.[schoolCol]);
                    const schoolValue2025 = parseValue(data[pointIndex]?.[schoolCol2025]);
                    const minValue = parseValue(data[pointIndex]?.[minCol]);
                    const maxValue = parseValue(data[pointIndex]?.[maxCol]);

                    return `
                        <b>${category}</b><br/>
                        Mínimo: <b>${minValue}</b><br/>
                        <span style="color:#16a34a">●</span> ${chartConfig.columnAliases?.[schoolCol] || schoolCol}: <b>${schoolValue2024}</b><br/>
                        <span style="color:#2563eb">●</span> ${chartConfig.columnAliases?.[schoolCol2025] || schoolCol2025}: <b>${schoolValue2025}</b><br/>
                        Máximo: <b>${maxValue}</b>
                    `;
                }
            };
        }

        console.log("commonOptions ", commonOptions);

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
        <Container maxWidth="xl" sx={{ py: 6 }}>
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
                            p: 3, border: '1px solid #e0e0e0', borderRadius: 4, mb: 4,
                            position: 'relative',
                            // 🔥🔥🔥 CAMBIO PRINCIPAL PARA RESIZE TOTAL 🔥🔥🔥
                            resize: 'both',       // Permite redimensionar ancho y alto
                            overflow: 'hidden',   // Necesario para que resize funcione

                            minHeight: height,    // Altura inicial/mínima
                            maxWidth: '100%',     // Evita que se salga del contenedor padre
                            minWidth: width,    // Evita que se haga diminuto

                            height: 'auto',
                            width: 'auto',
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
                loading && !activeData && <Box height={height} width={width} display="flex" justifyContent="center" alignItems="center" bgcolor="#f9fafb" borderRadius={4}><CircularProgress /></Box>
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
    );
}