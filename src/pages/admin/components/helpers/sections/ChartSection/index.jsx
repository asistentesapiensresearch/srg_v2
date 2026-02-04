// src/pages/admin/components/helpers/sections/ChartSection/index.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Typography, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';

// Inicialización segura de módulos
const initHighchartsModule = (module, H) => {
    if (typeof module === 'function') {
        module(H);
    } else if (module && typeof module.default === 'function') {
        module.default(H);
    }
};
initHighchartsModule(highchartsMore, Highcharts);

import { fetchSheet } from '@src/pages/admin/components/helpers/sections/DirectorySection/fetchSheet';

export default function ChartSection({ sectionTitle, chartManager, height = 500 }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [allChartsData, setAllChartsData] = useState({});
    const [loading, setLoading] = useState(false);

    const config = chartManager || {};
    // Necesitamos el token también si tu fetchSheet lo requiere (asegurate de pasarlo)
    const { fileId, charts, token } = config;

    // 1. EFECTO: CARGAR DATOS
    useEffect(() => {
        if (!fileId || !charts || charts.length === 0) return;

        const loadAllData = async () => {
            setLoading(true);
            const newDataCache = {};

            try {
                const promises = charts.map(async (chart) => {
                    // 🔥 IMPORTANTE: Usamos el mismo identificador para guardar y leer
                    // Si tu fetchSheet requiere el NOMBRE para la API, usa chart.sheetName en el fetch
                    // Pero la clave del cache debe ser consistente. Usaremos sheetId como clave.
                    const data = await fetchSheet(fileId, chart.sheetId);

                    // Guardamos usando sheetId (o el índice si no hay ID, para asegurar unicidad)
                    newDataCache[chart.sheetId || chart.sheetName] = data;
                });

                await Promise.all(promises);
                setAllChartsData(newDataCache);
            } catch (err) {
                console.error("Error loading charts data", err);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [fileId, charts, token]);

    // 2. HELPER: OPCIONES HIGHCHARTS
    const getChartOptions = (chartConfig, data, isThumbnail = false) => {
        if (!data || !chartConfig) return null;

        // 🔥 FIX PARA LA COLUMNA VACÍA ""
        // Si la data viene con clave "" (A1 vacío), y el config.xAxis está vacío o es "", lo manejamos.
        let { type, xAxis, series: seriesCols, alias, color } = chartConfig;

        // Validación: Si xAxis no está definido, intentamos usar la primera clave disponible que no sea numérica
        if (!xAxis && data.length > 0) {
            xAxis = Object.keys(data[0])[0];
        }

        // Mapear Categorías (Eje X)
        const categories = data.map(row => row[xAxis] || row[""] || ''); // Fallback a "" si el header está vacío

        // Mapear Series (Eje Y)
        const seriesData = (seriesCols || []).map((colName) => {
            // 1. Buscamos el ALIAS (Nombre visual)
            const seriesName = chartConfig.columnAliases?.[colName] || colName;

            // 2. Buscamos el COLOR específico
            // Si no hay color definido, pasamos undefined para que Highcharts use los automáticos
            const seriesColor = chartConfig.columnColors?.[colName] || undefined;

            return {
                name: seriesName,
                color: seriesColor, // 🔥 APLICAMOS EL COLOR AQUÍ
                data: data.map(row => {
                    let val = row[colName];
                    if (typeof val === 'string') {
                        val = val.replace(/[^0-9.-]+/g, "");
                        return parseFloat(val) || 0;
                    }
                    return parseFloat(val) || 0;
                })
            };
        });

        const commonOptions = {
            credits: { enabled: false },
            title: { text: isThumbnail ? null : '' },
        };

        if (isThumbnail) {
            return {
                ...commonOptions,
                chart: { type: type || 'column', height: 80, backgroundColor: 'transparent', margin: [0, 0, 0, 0] },
                xAxis: { visible: false, categories },
                yAxis: { visible: false },
                legend: { enabled: false },
                tooltip: { enabled: false },
                plotOptions: { series: { enableMouseTracking: false, marker: { enabled: false } } },
                series: seriesData,
            };
        }

        return {
            ...commonOptions,
            chart: {
                type: type || 'column',
                height: height,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                style: { fontFamily: 'inherit' }
            },
            subtitle: { text: `Fuente: ${chartConfig.alias || chartConfig.sheetName}` },
            xAxis: {
                categories,
                crosshair: true,
                lineColor: '#e0e0e0',
                labels: { style: { color: '#666' } }
            },
            yAxis: {
                title: { text: null },
                gridLineColor: '#f0f0f0',
                labels: { style: { color: '#666' } }
            },
            legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
            plotOptions: {
                column: { borderRadius: 2 },
                series: { marker: { radius: 4 } }
            },
            // colors: ...  <-- ELIMINAR ESTO, ya lo controlamos en seriesData
            series: seriesData,
        };
    };

    // --- RENDER ---

    // Configuración activa actual
    const activeChartConfig = charts?.[activeIndex];

    // 🔥 CORRECCIÓN CLAVE: Usar la misma clave para leer que la que usamos para guardar
    const activeData = allChartsData[activeChartConfig?.sheetId || activeChartConfig?.sheetName];

    const mainOptions = useMemo(() =>
        getChartOptions(activeChartConfig, activeData, false),
        [activeChartConfig, activeData, height]);

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

            {/* LOADER */}
            {loading && !activeData && (
                <Box height={height} display="flex" justifyContent="center" alignItems="center" bgcolor="#f9fafb" borderRadius={4}>
                    <CircularProgress />
                </Box>
            )}

            {/* GRÁFICO PRINCIPAL */}
            {!loading && mainOptions ? (
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 4, mb: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                            {activeChartConfig.alias}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {activeIndex + 1} / {charts.length}
                        </Typography>
                    </Box>
                    <HighchartsReact highcharts={Highcharts} options={mainOptions} />
                </Paper>
            ) : null}

            {/* MINIATURAS */}
            <Box sx={{ position: 'relative', px: { xs: 0, md: 6 } }}>
                <IconButton
                    onClick={handlePrev}
                    sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white', border: '1px solid #ddd' }}
                >
                    <ChevronLeft size={20} />
                </IconButton>

                <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: 6 } }}>
                    {charts.map((chart, idx) => {
                        // 🔥 CORRECCIÓN CLAVE: Leer con la misma clave
                        const data = allChartsData[chart.sheetId || chart.sheetName];
                        const thumbOptions = getChartOptions(chart, data, true);
                        const isActive = idx === activeIndex;

                        return (
                            <Grid key={idx} sx={{ minWidth: 200, maxWidth: 220, flexShrink: 0 }}>
                                <Paper
                                    elevation={isActive ? 3 : 0}
                                    onClick={() => setActiveIndex(idx)}
                                    sx={{
                                        p: 1.5, cursor: 'pointer',
                                        border: isActive ? `2px solid ${chart.color || '#1976d2'}` : '1px solid #eee',
                                        borderRadius: 3, opacity: isActive ? 1 : 0.7
                                    }}
                                >
                                    <Box height={80} mb={1} bgcolor="#f9fafb" borderRadius={2} overflow="hidden">
                                        {data ? (
                                            <HighchartsReact highcharts={Highcharts} options={thumbOptions} />
                                        ) : (
                                            <Box height="100%" display="flex" justifyContent="center" alignItems="center">
                                                <BarChart2 size={20} color="#ddd" />
                                            </Box>
                                        )}
                                    </Box>
                                    <Typography variant="caption" fontWeight="bold" noWrap display="block">
                                        {chart.alias}
                                    </Typography>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

                <IconButton
                    onClick={handleNext}
                    sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white', border: '1px solid #ddd' }}
                >
                    <ChevronRight size={20} />
                </IconButton>
            </Box>
        </Container>
    );
}