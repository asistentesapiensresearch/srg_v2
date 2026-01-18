// src/components/builder/inputs/DataSourceInput.jsx
import { useEffect, useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, IconButton, Chip, Autocomplete, Divider } from '@mui/material';
import { FileSpreadsheet, X, ArrowRight } from 'lucide-react';
import { useDrivePicker } from '@src/hooks/useDrivePicker';
import { fetchSheet } from '@src/pages/admin/components/helpers/sections/DirectorySection/fetchSheet';

export default function DataSourceInput({ value, onChange }) {

    const [localState, setLocalState] = useState(value || {
        type: 'api',
        url: '',
        sheetId: '',
        sheetName: '',
        selectedSheet: '',
        token: '',
        filters: [],
        columns: [],        // Las columnas seleccionadas (IDs originales)
        columnAliases: {},  // NUEVO: Mapa { "nombre_original": "Alias Visible" }
        orderColumns: []
    });

    const [headers, setHeaders] = useState([]);
    const [availableSheets, setAvailableSheets] = useState([]);

    const { openPicker, token } = useDrivePicker();

    const updateState = (updates) => {
        const newState = { ...localState, ...updates };
        setLocalState(newState);
        onChange(newState);
    };

    // --- EFECTOS Y CARGA DE DATOS (Mismo código de antes) ---
    useEffect(() => {
        const restoreSession = async () => {
            if (localState.sheetId && availableSheets.length === 0) {
                try {
                    let sheets = await fetchSheetNames(localState.sheetId, localState.token);
                    setAvailableSheets(sheets);
                    await loadSheetData(localState.sheetId, localState.selectedSheet);
                } catch (error) {
                    console.error("Error restaurando la sesión:", error);
                }
            }
        };
        restoreSession();
    }, [localState.sheetId]);

    const handleGoogleConnect = async () => {
        try {
            const file = await openPicker();
            if (file) {
                const authToken = file.token || token;
                let sheets = await fetchSheetNames(file.id, authToken);
                setAvailableSheets(sheets);
                await loadSheetData(file.id);

                updateState({
                    sheetId: file.id,
                    sheetName: file.name,
                    selectedSheet: 0,
                    token: authToken,
                    filters: [],
                    columns: [],       // Reseteamos selección
                    columnAliases: {}  // Reseteamos alias
                });
            }
        } catch (error) {
            console.error("Error picking file:", error);
        }
    };

    const loadSheetData = async (fileId, sheetName) => {
        try {
            let rawData = await fetchSheet(fileId, sheetName);
            if (rawData.length > 0) setHeaders(Object.keys(rawData[0]));
        } catch (error) {
            console.error("Error cargando datos:", error);
            return null;
        }
    };

    const fetchSheetNames = async (fileId, authToken) => {
        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${fileId}`,
                {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                }
            );
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            return data.sheets.map(sheet => sheet.properties);
        } catch (error) {
            console.error("Error obteniendo hojas:", error);
            return [];
        }
    };

    const handleSheetChange = async (newSheet) => {
        if (!newSheet || !localState.sheetId) return;
        await loadSheetData(localState.sheetId, newSheet);
        updateState({
            selectedSheet: newSheet,
            filters: [],
            columns: [],
            columnAliases: {}
        });
    };

    // --- NUEVO HANDLER: Actualizar Alias ---
    const handleAliasChange = (originalColumn, newAlias) => {
        const newAliases = { 
            ...localState.columnAliases, 
            [originalColumn]: newAlias 
        };
        updateState({ columnAliases: newAliases });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, p: 1, border: '1px dashed #ccc', borderRadius: 2 }}>
            
            {/* 1. Selector de Tipo y Archivo (Igual que antes) */}
            <TextField
                select fullWidth size="small" label="Fuente de Datos"
                value={localState.type}
                onChange={(e) => updateState({ type: e.target.value })}
            >
                <MenuItem value="sheet">Google Drive / Excel</MenuItem>
            </TextField>

            {localState.type === 'sheet' && (
                <Box>
                    {!localState.sheetId ? (
                        <Button fullWidth variant="outlined" startIcon={<FileSpreadsheet size={18} />} onClick={handleGoogleConnect} sx={{ color: '#2e7d32', borderColor: '#2e7d32' }}>
                            Seleccionar Archivo
                        </Button>
                    ) : (
                        <Box sx={{ bgcolor: '#e8f5e9', p: 1.5, borderRadius: 1, border: '1px solid #c8e6c9' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" gap={1} alignItems="center" overflow="hidden">
                                    <FileSpreadsheet size={20} color="#2e7d32" />
                                    <Box>
                                        <Typography variant="body2" noWrap fontWeight="bold">{localState.sheetName}</Typography>
                                        <Chip label="ONLINE" size="small" color="success" sx={{ height: 20, fontSize: '0.6rem' }} />
                                    </Box>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        updateState({ sheetId: '', sheetName: '', selectedSheet: '', token: '', filters: [], columns: [], columnAliases: {} });
                                        setAvailableSheets([]);
                                        setHeaders([]);
                                    }}
                                >
                                    <X size={16} />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}

            {/* 2. Selector de Hoja */}
            {localState.sheetId && availableSheets.length > 0 && (
                <TextField
                    select fullWidth size="small" label="Hoja del documento"
                    value={localState.selectedSheet || ''}
                    onChange={(e) => handleSheetChange(e.target.value)}
                >
                    {availableSheets.map((sheet, idx) => (
                        <MenuItem key={idx} value={sheet.sheetId}>{sheet.title}</MenuItem>
                    ))}
                </TextField>
            )}

            <Divider sx={{ my: 1 }} />

            {/* 3. Selección de Columnas a Mostrar */}
            {localState.sheetId && headers.length > 0 && (
                <>
                    <Typography variant="subtitle2" color="text.secondary">Configuración de Columnas</Typography>
                    
                    <Autocomplete
                        multiple
                        id="columns-select"
                        options={headers}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        value={localState.columns || []}
                        onChange={(event, newValue) => {
                            updateState({ columns: newValue });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccionar columnas visibles"
                                placeholder="Ej. Nombre, Precio, Foto..."
                                size="small"
                            />
                        )}
                    />

                    {/* 4. LISTADO PARA PONER ALIAS (LABEL) */}
                    {localState.columns && localState.columns.length > 0 && (
                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                PERSONALIZAR TÍTULOS (ALIAS)
                            </Typography>
                            
                            {localState.columns.map((col) => (
                                <Box key={col} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {/* Columna Original */}
                                    <Box sx={{ width: '40%', minWidth: 0 }}>
                                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                            Original:
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500} noWrap title={col}>
                                            {col}
                                        </Typography>
                                    </Box>

                                    <ArrowRight size={16} color="#999" />

                                    {/* Input para el Alias */}
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        placeholder={`Etiqueta para ${col}`}
                                        value={localState.columnAliases?.[col] || ''}
                                        onChange={(e) => handleAliasChange(col, e.target.value)}
                                        sx={{ bgcolor: 'white' }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}