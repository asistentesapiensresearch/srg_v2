import { useState, useMemo } from "react";
import {
    Typography,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    useMediaQuery,
    useTheme,
    CircularProgress,
} from "@mui/material";
import { History, X, MapPin } from "lucide-react";
import { cardByType } from "../helpers/cardsByType";
import ChartSection from "../../ChartSection";

const CHART_MANAGER_CONFIG = {
    "fileId": "1fR3OIGiTSgq96HXsci2PtTITPqw4jqYzUFOJDC3OnE8",
    "fileName": "01_Sí_Col-Sapiens_redboston_sh",
    "charts": [
        {
            "columnAliases": {},
            "xAxis": "Versión",
            "sheetName": "H1",
            "color": "#2c3e50",
            "series": ["Categoría", "Calificación"],
            "columnColors": {},
            "sheetId": 1882444936,
            "alias": "Resultados históricos por categorías y calificaciones",
            "id": 1773175296417,
            "type": "col_sapiens"
        },
        {
            "columnAliases": {},
            "xAxis": "",
            "sheetName": "H2",
            "color": "#2c3e50",
            "series": ["En la misma categoría y calificación", "En la misma categoría", "En la misma calificación"],
            "columnColors": {
                "En la misma categoría": "#ed2626",
                "En la misma calificación": "#0abd4f"
            },
            "sheetId": 1829106418,
            "alias": "Comparativo colegio con la misma categoría y calificación",
            "id": 1773175298809,
            "type": "col_sapiens_comparative"
        },
        {
            "columnAliases": {},
            "xAxis": "-",
            "sheetName": "H3",
            "color": "#2c3e50",
            "series": ["2013-14", "2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"],
            "columnColors": {},
            "sheetId": 545967769,
            "alias": "Comparativo colegio vs número de colegios por categoría",
            "id": 1773175377018,
            "type": "col_sapiens_spline"
        },
        {
            "columnAliases": {},
            "xAxis": "",
            "sheetName": "H4",
            "color": "#2c3e50",
            "series": ["Colegios"],
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
            "series": ["Colegios"],
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
            "series": ["Colegios"],
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
            "series": ["Colegios"],
            "columnColors": {},
            "sheetId": 28693545,
            "alias": "Movimiento de colegios con la misma categoría y calificación (versión actual)",
            "id": 1773175764072,
            "type": "column"
        },
        {
            "columnAliases": {},
            "xAxis": "",
            "sheetName": "H8",
            "color": "#2c3e50",
            "series": ["Cognia", "ICAA", "EBN", "PC-CE"],
            "columnColors": {
                "EBN": "#0bad1e",
                "ICAA": "#f50505",
                "Cognia": "#0573e1",
                "PC-CE": "#c4d115"
            },
            "sheetId": 1058346997,
            "alias": "Número de colegios certificados y/o acreditados por categoría",
            "id": 1773175765090,
            "type": "col_sapiens_certified"
        }
    ],
    "token": ""
};

export const DirectoryCard = ({ item, primaryColor = '#337ab7', type, selectedPreset, chartManager: customChartManager, versionColumn }) => {
    const [openModal, setOpenModal] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const chartManager = useMemo(() => customChartManager?.fileId ? customChartManager : CHART_MANAGER_CONFIG, [customChartManager]);

    const getHistoryOptions = useMemo(() => {
        if (!item) return null;
        
        // Combinar el registro principal con su historial
        const allRecords = [item, ...(item.history || [])];
        
        // Encontrar la columna de versión
        const vCol = versionColumn || "Año";
        
        // Ordenar cronológicamente (ascendente)
        allRecords.sort((a, b) => {
            const valA = String(a[vCol] || a["Año"] || a["Versión"] || "");
            const valB = String(b[vCol] || b["Año"] || b["Versión"] || "");
            const numA = parseInt(valA.replace(/\D/g, ''), 10);
            const numB = parseInt(valB.replace(/\D/g, ''), 10);
            if (!isNaN(numA) && !isNaN(numB) && numA !== numB) return numA - numB;
            return valA.localeCompare(valB, undefined, { numeric: true });
        });

        const parsedData = allRecords.map(row => {
            let yearLabel = String(row[vCol] || row["Año"] || row["Versión"] || '').trim();
            if (/^\d{4}$/.test(yearLabel)) {
                const startYear = parseInt(yearLabel, 10);
                yearLabel = `${startYear}-${startYear + 1}`;
            }   else if (/^\d{4}-\d{4}$/.test(yearLabel)) {
                const parts = yearLabel.split('-');
                yearLabel = `${parts[0]}-${parts[1].slice(-2)}`;
            }

            const catStr = String(row['Categoría'] || '').trim();
            const catMatch = catStr.match(/\d+/);
            const catVal = catMatch ? parseInt(catMatch[0], 10) : 0;

            const califStr = String(row['Calificación'] || '').trim();

            return {
                name: yearLabel,
                y: catVal,
                categoryName: catVal > 0 ? `D${catVal}` : '-',
                calificacion: califStr && califStr !== '-' ? califStr : '-'
            };
        }).filter(d => d.name);

        const categories = parsedData.map(d => d.name);

        return {
            chart: {
                type: 'column',
                backgroundColor: 'transparent'
            },
            title: { text: null },
            xAxis: {
                categories,
                crosshair: true,
                lineColor: '#e0e0e0',
                labels: {
                    rotation: 0,
                    autoRotation: false,
                    style: { fontSize: '11px', fontFamily: 'inherit' }
                }
            },
            yAxis: {
                reversed: true,
                categories: ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'],
                title: {
                    text: 'Categoría',
                    style: { fontWeight: 'bold', fontSize: '12px', color: '#666' }
                },
                gridLineColor: '#f0f0f0',
                labels: { style: { fontSize: '11px', fontWeight: 'bold', color: '#555' } },
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
                            mouseOver: function () { if (this.dataLabel) this.dataLabel.hide(); },
                            mouseOut: function () { if (this.dataLabel) this.dataLabel.show(); }
                        }
                    }
                }
            },
            tooltip: {
                useHTML: true,
                outside: true,
                shared: false,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#dddddd',
                borderRadius: 8,
                shadow: true,
                padding: 8,
                distance: 25,
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
            },
            series: [{
                name: 'Categoría y calificación',
                color: '#3b82f6',
                data: parsedData,
                dataLabels: {
                    enabled: true,
                    inside: false,
                    crop: false,
                    overflow: 'none',
                    useHTML: true,
                    verticalAlign: 'top',
                    formatter: function () {
                        const point = this.point;
                        return `<div style="text-align: center; line-height: 1.3; font-family: sans-serif; font-size: 11px; font-weight: bold; color: #000;">
                            ${point.categoryName}<br/>
                            ${point.calificacion}
                        </div>`;
                    }
                }
            }],
            credits: { enabled: false }
        };
    }, [item, versionColumn]);

    const finalChartManager = useMemo(() => {
        if (!chartManager || !chartManager.charts) return chartManager;
        
        const newCharts = chartManager.charts.map(c => {
            if (c.alias === "Resultados históricos por categorías y calificaciones" || c.type === "col_sapiens") {
                return {
                    ...c,
                    overrideOptions: getHistoryOptions
                };
            }
            return c;
        });

        return { ...chartManager, charts: newCharts };
    }, [chartManager, getHistoryOptions]);

    const Vinculada = item.isLinked;
    const isCompactMode = selectedPreset === "Todos";

    const CardComponent = isCompactMode
        ? (cardByType[type]?.cardDirectoryCompact || cardByType["COL"]?.cardDirectoryCompact)
        : (cardByType[type]?.cardDirectory || cardByType["COL"]?.cardDirectory);

    return (
        <>
            <CardComponent item={item} primaryColor={primaryColor} onOpenHistory={() => setOpenModal(true)} />

            {/* Modal de Historial */}
            {!isCompactMode && Vinculada && item.history?.length > 0 && (
                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    maxWidth="md"
                    fullWidth
                    BackdropProps={{
                        className: "backdrop-blur-md bg-black/30"
                    }}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            maxHeight: '90vh',
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            pb: 2,
                            borderBottom: '1px solid #e5e7eb',
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                                    {item["Colegios"] || item["Nombre"] || "Sin nombre"}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {item["Categoría"] && (
                                        <Box sx={{ 
                                            px: 1.5, py: 0.25, 
                                            borderRadius: '999px', 
                                            border: '1px solid #fecaca', 
                                            bgcolor: '#fef2f2', 
                                            color: '#991b1b', 
                                            fontWeight: 700, 
                                            fontSize: '0.875rem' 
                                        }}>
                                            D{item["Categoría"]}
                                        </Box>
                                    )}
                                    {item["Calificación"] && (
                                        <Box sx={{ 
                                            px: 1.5, py: 0.25, 
                                            borderRadius: '999px', 
                                            border: '1px solid #fde68a', 
                                            bgcolor: '#fefce8', 
                                            color: '#92400e', 
                                            fontWeight: 700, 
                                            fontSize: '0.875rem' 
                                        }}>
                                            {item["Calificación"]}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <MapPin size={16} />
                                {item["Ciudad"]}{item["Departamento"] ? ` - ${item["Departamento"]}` : ""}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={() => setOpenModal(false)}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { bgcolor: '#f3f4f6' },
                                ml: 2,
                                mt: -0.5,
                                mr: -0.5
                            }}
                            size="small"
                        >
                            <X size={20} />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            p: { xs: 1.5, sm: 3 },
                            maxHeight: 'calc(90vh - 120px)',
                            overflowY: 'auto',
                            overflowX: 'hidden'
                        }}
                    >
                        <ChartSection
                            sectionTitle={null}
                            chartManager={finalChartManager}
                            height={550}
                            thumbnailsMode="never"
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};