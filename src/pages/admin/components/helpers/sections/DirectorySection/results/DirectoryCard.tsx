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
import { History, X } from "lucide-react";
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

export const DirectoryCard = ({ item, primaryColor = '#337ab7', type, selectedPreset }) => {
    const [openModal, setOpenModal] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const chartManager = useMemo(() => CHART_MANAGER_CONFIG, []);

    const Vinculada = item.isLinked;
    const isCompactMode = selectedPreset === "Todos";

    const CardComponent = isCompactMode
        ? (cardByType[type]?.cardDirectoryCompact || cardByType["COL"]?.cardDirectoryCompact)
        : (cardByType[type]?.cardDirectory || cardByType["COL"]?.cardDirectory);

    return (
        <>
            <CardComponent item={item} primaryColor={primaryColor} />

            {/* Botón Historia - solo en modo normal */}
            {!isCompactMode && Vinculada && item.history?.length > 0 && (
                <Box
                    sx={{
                        mt: -1,
                        mb: 2,
                        p: 1.5,
                        bgcolor: '#f9f9f9',
                        border: '1px solid #eee',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ flex: 1 }}>
                        Histórico ({item.history.length})
                    </Typography>
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-200 active:bg-gray-300"
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #d1d5db',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                        title="Ver historial"
                    >
                        <History size={18} color="#6b7280" strokeWidth={2} />
                    </button>
                </Box>
            )}

            {/* Modal de Historial */}
            {!isCompactMode && Vinculada && item.history?.length > 0 && (
                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    maxWidth="md"
                    fullWidth
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
                            alignItems: 'center',
                            pb: 1.5,
                            borderBottom: '1px solid #e5e7eb',
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Historial de Clasificaciones
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {item.history.length} registros históricos disponibles
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={() => setOpenModal(false)}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { bgcolor: '#f3f4f6' }
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
                        }}
                    >
                        <ChartSection
                            sectionTitle="Historial de Clasificaciones"
                            chartManager={chartManager}
                            height={450}
                            thumbnailsMode="always"
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};