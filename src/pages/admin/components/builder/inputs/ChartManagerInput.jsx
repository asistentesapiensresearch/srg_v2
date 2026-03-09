import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Button, Typography, IconButton, Divider, Chip, CircularProgress,
    Accordion, AccordionSummary, AccordionDetails, Alert, TextField, MenuItem
} from '@mui/material';
import {
    FileSpreadsheet, Plus, Trash2, ChevronDown,
    BarChart2, Settings, ArrowRight, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useDrivePicker } from '@src/hooks/useDrivePicker';
import { fetchSheet } from '@src/pages/admin/components/helpers/sections/DirectorySection/fetchSheet';
import { CHART_TYPES } from '../../helpers/sections/ChartSection/CHART_TYPES';

export default function ChartManagerInput({ value, onChange }) {
    const [config, setConfig] = useState(value || {
        fileId: "", fileName: "", token: "", charts: []
    });

    const [availableSheets, setAvailableSheets] = useState([]);
    const [loadingSheets, setLoadingSheets] = useState(false);
    const [headersCache, setHeadersCache] = useState({});

    // 🔥 NUEVO ESTADO: Error de Autenticación
    const [authError, setAuthError] = useState(false);

    const { openPicker, token: globalToken } = useDrivePicker();

    const updateConfig = (updates) => {
        const newConfig = { ...config, ...updates };
        setConfig(newConfig);
        onChange(newConfig);
    };

    // 1. CONECTAR DRIVE Y OBTENER HOJAS
    const fetchSheetNames = useCallback(async (fileId, authToken) => {
        if (!fileId || !authToken) return [];

        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${fileId}`,
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );

            // 🔥 DETECCIÓN DE TOKEN VENCIDO
            if (response.status === 401 || response.status === 403) {
                setAuthError(true);
                throw new Error("Token expired");
            }

            // Si funciona, reseteamos el error
            setAuthError(false);

            if (!response.ok) throw new Error("Error fetching sheets");

            const data = await response.json();
            return (data.sheets || []).map(s => ({
                id: s.properties.sheetId,
                name: s.properties.title
            }));
        } catch (e) {
            console.error("Error fetching sheets:", e);
            return [];
        }
    }, []);

    // Carga inicial
    useEffect(() => {
        if (config.fileId && config.token && availableSheets.length === 0) {
            setLoadingSheets(true);
            setAuthError(false); // Reset inicial
            fetchSheetNames(config.fileId, config.token)
                .then(sheets => {
                    setAvailableSheets(sheets);
                    setLoadingSheets(false);
                });
        }
    }, [config.fileId]); // Quitamos config.token de deps para evitar bucles si falla

    // Handler: Conectar nuevo archivo (Borra config previa)
    const handleConnect = async () => {
        const file = await openPicker();
        if (file) {
            const token = file.token || globalToken;
            setLoadingSheets(true);
            const sheets = await fetchSheetNames(file.id, token);
            setAvailableSheets(sheets);
            setLoadingSheets(false);

            updateConfig({
                fileId: file.id,
                fileName: file.name,
                token: token,
                charts: [] // Resetear gráficos al cambiar archivo totalmente
            });
        }
    };

    // 🔥 Handler: REFRESCAR TOKEN (Mantiene config previa)
    const handleRefreshToken = async () => {
        try {
            // Abrimos el picker solo para renovar credenciales
            const file = await openPicker();
            if (file) {
                const newToken = file.token || globalToken;

                // Actualizamos SOLO el token en el config
                updateConfig({ token: newToken });

                // Reintentamos cargar las hojas
                setLoadingSheets(true);
                setAuthError(false);
                const sheets = await fetchSheetNames(config.fileId, newToken);
                setAvailableSheets(sheets);
                setLoadingSheets(false);
            }
        } catch (error) {
            console.error("Error refrescando token:", error);
        }
    };

    // 2. GESTIÓN DE GRÁFICOS
    const handleAddChart = async (sheet) => {
        const newChart = {
            id: Date.now(),
            sheetId: sheet.id,
            sheetName: sheet.name,
            alias: sheet.name,
            type: 'column',
            xAxis: '',
            series: [],
            columnAliases: {},
            columnColors: {},
            color: '#2c3e50'
        };

        await loadHeadersForSheet(sheet.id);

        updateConfig({
            charts: [...(config.charts || []), newChart]
        });
    };

    const handleRemoveChart = (index) => {
        const newCharts = [...config.charts];
        newCharts.splice(index, 1);
        updateConfig({ charts: newCharts });
    };

    const handleUpdateChart = (index, field, val) => {
        const newCharts = [...config.charts];
        newCharts[index] = { ...newCharts[index], [field]: val };
        updateConfig({ charts: newCharts });
    };

    const handleColumnAliasChange = (chartIndex, originalColName, newAlias) => {
        const newCharts = [...config.charts];
        const currentAliases = newCharts[chartIndex].columnAliases || {};
        newCharts[chartIndex] = {
            ...newCharts[chartIndex],
            columnAliases: { ...currentAliases, [originalColName]: newAlias }
        };
        updateConfig({ charts: newCharts });
    };

    const handleColumnColorChange = (chartIndex, originalColName, newColor) => {
        const newCharts = [...config.charts];
        const currentColors = newCharts[chartIndex].columnColors || {};
        newCharts[chartIndex] = {
            ...newCharts[chartIndex],
            columnColors: { ...currentColors, [originalColName]: newColor }
        };
        updateConfig({ charts: newCharts });
    };

    const loadHeadersForSheet = async (sheetId) => {
        if (headersCache[sheetId]) return;
        try {
            // Pasamos el token actual
            const data = await fetchSheet(config.fileId, sheetId, config.token);
            if (data && data.length > 0) {
                const headers = Object.keys(data[0]);
                setHeadersCache(prev => ({ ...prev, [sheetId]: headers }));
            }
        } catch (e) {
            console.error("Error cargando headers", e);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid #ddd', p: 2, borderRadius: 2, bgcolor: '#fafafa' }}>

            {/* SECCIÓN 1: ARCHIVO MAESTRO */}
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">Archivo de Datos</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {config.fileName || "Ningún archivo seleccionado"}
                        </Typography>
                    </Box>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FileSpreadsheet size={16} />}
                        onClick={handleConnect}
                    >
                        {config.fileId ? "Cambiar Archivo" : "Conectar"}
                    </Button>
                </Box>

                {/* 🔥 ALERTA DE TOKEN VENCIDO 🔥 */}
                {authError && (
                    <Alert
                        severity="warning"
                        icon={<AlertTriangle size={20} />}
                        action={
                            <Button color="inherit" size="small" onClick={handleRefreshToken} startIcon={<RefreshCw size={14} />}>
                                Reconectar
                            </Button>
                        }
                        sx={{ mt: 1 }}
                    >
                        La sesión de Google ha expirado. Necesitas reconectar para ver las hojas.
                    </Alert>
                )}
            </Box>

            <Divider />

            {/* SECCIÓN 2: AGREGAR GRÁFICOS */}
            {config.fileId && !authError && (
                <Box>
                    <Typography variant="subtitle2" gutterBottom>Agregar Gráfico desde Hoja:</Typography>

                    {loadingSheets ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <CircularProgress size={16} />
                            <Typography variant="caption">Cargando hojas...</Typography>
                        </Box>
                    ) : (
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {availableSheets.length === 0 ? (
                                <Typography variant="caption" color="text.secondary">No se encontraron hojas o error de conexión.</Typography>
                            ) : (
                                availableSheets.map(sheet => {
                                    const isAdded = config.charts?.some(c => c.sheetId === sheet.id);
                                    return (
                                        <Chip
                                            key={sheet.id}
                                            label={sheet.name}
                                            onClick={() => !isAdded && handleAddChart(sheet)}
                                            color={isAdded ? "success" : "default"}
                                            icon={isAdded ? <Settings size={14} /> : <Plus size={14} />}
                                            variant={isAdded ? "filled" : "outlined"}
                                            clickable={!isAdded}
                                            sx={{ opacity: isAdded ? 0.7 : 1 }}
                                        />
                                    )
                                })
                            )}
                        </Box>
                    )}
                </Box>
            )}

            {/* SECCIÓN 3: CONFIGURAR GRÁFICOS EXISTENTES */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                {config.charts?.map((chart, index) => {
                    const headers = headersCache[chart.sheetId] || [];
                    const activeColumns = [chart.xAxis, ...(chart.series || [])].filter(Boolean);
                    const uniqueActiveColumns = [...new Set(activeColumns)];

                    return (
                        <Accordion key={chart.id || index} defaultExpanded sx={{ border: '1px solid #eee', boxShadow: 'none' }}>
                            <AccordionSummary expandIcon={<ChevronDown />}>
                                <Box display="flex" alignItems="center" gap={2} width="100%">
                                    <BarChart2 size={18} color="#666" />
                                    <Typography variant="subtitle2" sx={{ flex: 1 }}>
                                        {chart.alias || chart.sheetName}
                                    </Typography>

                                    {/* Botón de borrar corregido (Box en lugar de IconButton) */}
                                    <Box
                                        component="div"
                                        role="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveChart(index);
                                        }}
                                        sx={{
                                            cursor: 'pointer', p: 1, borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', transition: 'background 0.2s',
                                            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                                        }}
                                    >
                                        <Trash2 size={16} color="#d32f2f" />
                                    </Box>
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                                    <TextField
                                        label="Título del Gráfico" size="small" fullWidth
                                        value={chart.alias}
                                        onChange={(e) => handleUpdateChart(index, 'alias', e.target.value)}
                                    />
                                    <TextField
                                        select label="Tipo de Gráfico" size="small" fullWidth
                                        value={chart.type}
                                        onChange={(e) => handleUpdateChart(index, 'type', e.target.value)}
                                    >
                                        {CHART_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                                    </TextField>

                                    {/* SELECTORES DE COLUMNAS */}
                                    {headers.length > 0 ? (
                                        <>
                                            <TextField
                                                select label="Eje X (Categorías)" size="small" fullWidth
                                                value={chart.xAxis}
                                                onChange={(e) => handleUpdateChart(index, 'xAxis', e.target.value)}
                                            >
                                                {headers.map((h, idx) => (
                                                    <MenuItem key={idx} value={h}>{h === "" ? "(Columna A / Sin Título)" : h}</MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                select label="Eje Y (Series)" size="small" fullWidth
                                                SelectProps={{ multiple: true }}
                                                value={chart.series || []}
                                                onChange={(e) => handleUpdateChart(index, 'series', e.target.value)}
                                            >
                                                {headers.map((h, idx) => (
                                                    <MenuItem key={idx} value={h}>{h === "" ? "(Columna A / Sin Título)" : h}</MenuItem>
                                                ))}
                                            </TextField>
                                        </>
                                    ) : (
                                        <Button
                                            size="small" variant="text" fullWidth
                                            // Al hacer click aquí, si el token está vencido, fallará silenciosamente
                                            // o deberíamos manejar el error también.
                                            onClick={() => loadHeadersForSheet(chart.sheetId)}
                                            sx={{ gridColumn: 'span 2' }}
                                            disabled={authError} // Desactivar si hay error de auth
                                        >
                                            {authError ? "Reconectar para cargar columnas" : "Cargar Columnas..."}
                                        </Button>
                                    )}

                                    {/* PERSONALIZACIÓN DE COLUMNAS */}
                                    {uniqueActiveColumns.length > 0 && (
                                        <Box sx={{ gridColumn: 'span 2', mt: 1, bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom display="block">
                                                PERSONALIZAR COLUMNAS (ALIAS Y COLOR)
                                            </Typography>
                                            <Box display="flex" flexDirection="column" gap={1.5}>
                                                {uniqueActiveColumns.map(col => {
                                                    const isSeries = chart.series?.includes(col);
                                                    return (
                                                        <Box key={col} display="flex" alignItems="center" gap={1}>
                                                            <Typography variant="caption" sx={{ width: '30%', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }} title={col}>
                                                                {col === "" ? "Sin Título" : col}
                                                            </Typography>
                                                            <ArrowRight size={14} color="#999" />

                                                            <TextField
                                                                placeholder="Alias Visual"
                                                                size="small"
                                                                variant="outlined"
                                                                fullWidth
                                                                sx={{
                                                                    '& .MuiInputBase-root': { bgcolor: 'white', fontSize: '0.8rem' },
                                                                    '& input': { py: 0.8 }
                                                                }}
                                                                value={chart.columnAliases?.[col] || ''}
                                                                onChange={(e) => handleColumnAliasChange(index, col, e.target.value)}
                                                            />

                                                            {isSeries && (
                                                                <input
                                                                    type="color"
                                                                    title="Color de la serie"
                                                                    value={chart.columnColors?.[col] || '#2c3e50'}
                                                                    onChange={(e) => handleColumnColorChange(index, col, e.target.value)}
                                                                    style={{
                                                                        width: '40px', height: '32px', padding: '0',
                                                                        border: '1px solid #ccc', borderRadius: '4px',
                                                                        cursor: 'pointer', backgroundColor: 'white'
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>

            {!config.charts?.length && config.fileId && !authError && (
                <Alert severity="info" sx={{ mt: 2 }}>Selecciona una hoja arriba para empezar a configurar.</Alert>
            )}
        </Box>
    );
}