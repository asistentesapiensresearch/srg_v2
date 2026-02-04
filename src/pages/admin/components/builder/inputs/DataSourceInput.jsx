import { useEffect, useState, useCallback } from 'react';
import { Box, TextField, MenuItem, Button, Typography, IconButton, Chip, Autocomplete, Divider, Alert, CircularProgress } from '@mui/material';
import { FileSpreadsheet, X, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useDrivePicker } from '@src/hooks/useDrivePicker';
import { fetchSheet } from '@src/pages/admin/components/helpers/sections/DirectorySection/fetchSheet';

export default function DataSourceInput({ value, onChange }) {

    // Inicialización del estado local
    const [localState, setLocalState] = useState(value || {
        type: 'api',
        url: '',
        sheetId: '',
        sheetName: '',
        selectedSheet: '', // Aquí guardaremos el GID (ID de la hoja)
        token: '',
        filters: [],
        columns: [],        
        columnAliases: {},  
        orderColumns: []
    });

    const [headers, setHeaders] = useState([]);
    const [availableSheets, setAvailableSheets] = useState([]);
    const [authError, setAuthError] = useState(false);
    const [loadingSheets, setLoadingSheets] = useState(false);

    const { openPicker, token: globalToken } = useDrivePicker();

    // 🔥 FIX CRÍTICO: Sincronizar Props con Estado Local 🔥
    // Esto detecta cuando cambias de sección (ej: de Directorio a Charts)
    // y actualiza los inputs con la data correcta de la nueva sección.
    useEffect(() => {
        if (value && JSON.stringify(value) !== JSON.stringify(localState)) {
            setLocalState(value);
            // Si hay datos cargados en la nueva sección, intentamos restaurar headers
            if (value.sheetId && value.selectedSheet) {
                 // Opcional: Podrías disparar una recarga silenciosa de headers aquí si es necesario
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const updateState = (updates) => {
        const newState = { ...localState, ...updates };
        setLocalState(newState);
        onChange(newState);
    };

    // --- HELPER: BUSCAR HOJAS ---
    const fetchSheetNames = useCallback(async (fileId, authToken) => {
        if (!fileId || !authToken) return [];
        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${fileId}`,
                {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                }
            );
            
            if (response.status === 401 || response.status === 403) throw new Error('401');
            if (!response.ok) throw new Error(`Error ${response.status}`);
            
            const data = await response.json();
            return (data.sheets || []).map(sheet => sheet.properties);
        } catch (error) {
            throw error;
        }
    }, []);

    // --- HELPER: CARGAR DATOS ---
    const loadSheetData = async (fileId, sheetGid) => {
        if (!fileId || sheetGid === undefined || sheetGid === null) return;
        try {
            let rawData = await fetchSheet(fileId, sheetGid);
            if (rawData && rawData.length > 0) {
                setHeaders(Object.keys(rawData[0]));
            } else {
                setHeaders([]);
            }
        } catch (error) {
            console.error("Error cargando datos de hoja:", error);
            setHeaders([]);
        }
    };

    // --- 1. EFECTO MAESTRO: CARGAR HOJAS DISPONIBLES ---
    useEffect(() => {
        let isMounted = true;
        const loadSheets = async () => {
            if (localState.sheetId && localState.token) {
                try {
                    setLoadingSheets(true);
                    setAuthError(false);
                    
                    const sheets = await fetchSheetNames(localState.sheetId, localState.token);
                    
                    if (isMounted) {
                        setAvailableSheets(sheets);
                        
                        // Si ya hay una hoja seleccionada (Restore de sesión), cargamos sus columnas
                        // Convertimos a string para asegurar comparación correcta con los values del select
                        if (localState.selectedSheet !== undefined && localState.selectedSheet !== '') {
                            await loadSheetData(localState.sheetId, localState.selectedSheet);
                        }
                    }
                } catch (error) {
                    if (isMounted) {
                        console.error("Error cargando hojas:", error);
                        setAvailableSheets([]);
                        if (error.message.includes('401')) setAuthError(true);
                    }
                } finally {
                    if (isMounted) setLoadingSheets(false);
                }
            }
        };

        // Ejecutar si cambió el ID del archivo o si no tenemos lista de hojas
        if (availableSheets.length === 0 || localState.sheetId) {
             loadSheets();
        }

        return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localState.sheetId, localState.token]); 

    // --- 2. HANDLER: CONECTAR GOOGLE DRIVE ---
    const handleGoogleConnect = async () => {
        try {
            const file = await openPicker();
            if (file) {
                const authToken = file.token || globalToken; 
                setAvailableSheets([]); 
                setHeaders([]);

                updateState({
                    sheetId: file.id,
                    sheetName: file.name,
                    selectedSheet: '', // Reset hoja al cambiar archivo
                    token: authToken,
                    filters: [],
                    columns: [],
                    columnAliases: {}
                });
                setAuthError(false);
            }
        } catch (error) {
            console.error("Error conectando:", error);
        }
    };

    // --- 3. HANDLER: CAMBIO DE HOJA (SHEET TAB) ---
    const handleSheetChange = async (event) => {
        const newSheetGid = event.target.value; // Obtenemos el GID (ID numérico de la hoja)
        
        if (!localState.sheetId) return;
        
        // Actualizamos estado visual inmediatamente
        updateState({
            selectedSheet: newSheetGid,
            filters: [],
            columns: [],
            columnAliases: {}
        });

        // Cargamos los datos (headers)
        await loadSheetData(localState.sheetId, newSheetGid);
    };

    // --- 4. HANDLER: REFRESH TOKEN ---
    const handleRefreshToken = async () => {
        try {
            const file = await openPicker(); 
            if (file) {
                const newToken = file.token || globalToken;
                setAvailableSheets([]); 
                updateState({ token: newToken });
                setAuthError(false);
            }
        } catch (error) {
            console.error("Error refrescando:", error);
        }
    };

    // --- 5. HANDLER: ALIAS ---
    const handleAliasChange = (originalColumn, newAlias) => {
        const newAliases = { ...localState.columnAliases, [originalColumn]: newAlias };
        updateState({ columnAliases: newAliases });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, p: 1, border: '1px dashed #ccc', borderRadius: 2 }}>
            
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {authError && (
                                <Alert 
                                    severity="warning" 
                                    icon={<AlertCircle size={20}/>}
                                    action={<Button color="inherit" size="small" onClick={handleRefreshToken}>RECONECTAR</Button>}
                                    sx={{ mb: 1 }}
                                >
                                    Token vencido.
                                </Alert>
                            )}

                            <Box sx={{ bgcolor: authError ? '#fff3e0' : '#e8f5e9', p: 1.5, borderRadius: 1, border: `1px solid ${authError ? '#ffb74d' : '#c8e6c9'}` }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" gap={1} alignItems="center" overflow="hidden">
                                        <FileSpreadsheet size={20} color={authError ? "#f57c00" : "#2e7d32"} />
                                        <Box>
                                            <Typography variant="body2" noWrap fontWeight="bold">
                                                {localState.sheetName || "Archivo"}
                                            </Typography>
                                            <Chip label={authError ? "OFFLINE" : "ONLINE"} size="small" color={authError ? "warning" : "success"} sx={{ height: 20, fontSize: '0.6rem' }} />
                                        </Box>
                                    </Box>
                                    
                                    <Box display="flex" gap={1}>
                                        {!authError && (
                                            <IconButton size="small" onClick={handleRefreshToken} title="Refrescar">
                                                <RefreshCw size={14} />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                updateState({ sheetId: '', sheetName: '', selectedSheet: '', token: '', filters: [], columns: [], columnAliases: {} });
                                                setAvailableSheets([]);
                                                setHeaders([]);
                                                setAuthError(false);
                                            }}
                                        >
                                            <X size={16} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}

            {/* SELECTOR DE HOJA (CORREGIDO: Sin Key Dinámico que rompe foco) */}
            {localState.sheetId && (
                <TextField
                    select 
                    fullWidth 
                    size="small"
                    label={loadingSheets ? "Cargando hojas..." : "Hoja del documento"}
                    value={localState.selectedSheet !== undefined ? localState.selectedSheet : ''}
                    onChange={handleSheetChange}
                    disabled={authError || loadingSheets}
                    InputProps={{
                        endAdornment: loadingSheets ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null
                    }}
                >
                    {/* Renderizamos las hojas disponibles. Usamos sheetId (GID) como valor */}
                    {availableSheets.map((sheet, idx) => (
                        <MenuItem key={idx} value={sheet.sheetId}>{sheet.title}</MenuItem>
                    ))}

                    {/* Estado vacío */}
                    {!loadingSheets && availableSheets.length === 0 && !localState.selectedSheet && (
                        <MenuItem disabled value="">
                            <em>No se encontraron hojas</em>
                        </MenuItem>
                    )}
                    
                    {/* Fallback si tenemos un valor guardado pero la lista aún no carga */}
                    {localState.selectedSheet !== '' && !availableSheets.find(s => s.sheetId === localState.selectedSheet) && (
                         <MenuItem value={localState.selectedSheet} sx={{ display: 'none' }}>
                            {/* Hidden item to prevent Select complaining about out-of-range value */}
                         </MenuItem>
                    )}
                </TextField>
            )}

            <Divider sx={{ my: 1 }} />

            {/* CONFIGURACIÓN DE COLUMNAS */}
            {!authError && headers.length > 0 && (
                <>
                    <Typography variant="subtitle2" color="text.secondary">Configuración de Columnas</Typography>
                    
                    <Autocomplete
                        multiple
                        id="columns-select"
                        options={headers}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        value={localState.columns || []}
                        onChange={(event, newValue) => updateState({ columns: newValue })}
                        renderInput={(params) => (
                            <TextField {...params} label="Columnas visibles" size="small" />
                        )}
                    />

                    {localState.columns && localState.columns.length > 0 && (
                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="caption" fontWeight="bold" color="text.secondary">ALIAS DE COLUMNAS</Typography>
                            {localState.columns.map((col) => (
                                <Box key={col} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: '40%', minWidth: 0 }}>
                                        <Typography variant="caption" color="text.secondary" display="block" noWrap>Original:</Typography>
                                        <Typography variant="body2" fontWeight={500} noWrap title={col}>{col}</Typography>
                                    </Box>
                                    <ArrowRight size={16} color="#999" />
                                    <TextField
                                        size="small" fullWidth variant="outlined" placeholder="Alias"
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