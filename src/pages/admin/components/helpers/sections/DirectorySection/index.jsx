// src/pages/admin/components/helpers/sections/DirectorySection/index.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box, Container, Grid, Skeleton, Alert, Button,
    InputAdornment, TextField, Badge,
    FormControl, InputLabel, Select, MenuItem,
    Pagination, Stack, Chip
} from "@mui/material";
import { LayoutGridIcon, LayoutListIcon, Search, SlidersHorizontal } from "lucide-react";

// Componentes Internos
import { DirectoryCard } from './results/DirectoryCard';
import { AdCard } from './results/AdCard';
import { FilterDrawer } from './filters/FilterDrawer';
import { fetchSheet } from './fetchSheet';
import { getValue } from './results/utils';
import TableList from './results/TableList';

// 🔥 IMPORTS DE COMPARACIÓN
import { ComparisonProvider } from './comparison/ComparisonContext';
import ComparisonWidget from './comparison/ComparisonWidget';
import ComparisonModal from './comparison/ComparisonModal';

// ========================================================================
// HELPERS PUROS (Fuera del componente para evitar recreación)
// ========================================================================

const cleanString = (val) => {
    if (val === null || val === undefined) return "";
    return String(val).toLowerCase().replace(/\s+/g, "").trim();
};

const parseQuickFilters = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString || "[]");
        const list = Array.isArray(parsed) ? parsed : [];
        if (!list.find(f => f.label === "Todos")) {
            list.unshift({ label: "Todos", filters: {} });
        }
        return list;
    } catch (e) {
        return [{ label: "Todos", filters: {} }];
    }
};

const getInitialConfig = (jsonString) => {
    const list = parseQuickFilters(jsonString);
    const defaultItem = list.find(p => p.default) || list[0];

    const rawFilters = defaultItem.filters || {};
    const sanitized = {};
    Object.keys(rawFilters).forEach(key => {
        const val = rawFilters[key];
        if (Array.isArray(val)) sanitized[key] = val;
        else if (val) sanitized[key] = [val];
    });

    return {
        label: defaultItem.label,
        filters: sanitized
    };
};

// ========================================================================
// COMPONENTE DE CONTENIDO (Lógica Principal)
// ========================================================================

const DirectorySectionContent = ({
    sourceConfig,
    viewType = 'grid',
    itemsPerAds = 3,
    itemsPerColumn = 3,
    showAds = true,
    primaryColor = "var(--color-red-700)",
    adTitle = "Publicidad",
    adText = "Tu marca aquí.",
    research,
    itemsPerPage = 12,
    quickFilters = "[]",
    groupByColumn = "",   // Ej: "Colegio"
    versionColumn = "",   // Ej: "Año"
    targetVersion = ""    // Ej: "2025-2026"
}) => {
    // 1. ESTADOS
    const [activeFilters, setActiveFilters] = useState(() => getInitialConfig(quickFilters).filters);
    const [selectedPreset, setSelectedPreset] = useState(() => getInitialConfig(quickFilters).label);
    const [data, setData] = useState([]);
    const [showData, setShowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('');
    const [viewListType, setViewListType] = useState(viewType === 'grid' ? 'grid' : 'list');

    // 2. CONSTANTES COMPUTADAS
    const gridSize = Math.floor(12 / Math.max(1, itemsPerColumn));
    const isList = viewListType === 'list';
    const activeFilterCount = Object.values(activeFilters).flat().length;
    const quickFiltersData = useMemo(() => parseQuickFilters(quickFilters), [quickFilters]);

    // 🔥 OPTIMIZACIÓN: Memorizar alias para no recalcular en cada render de tarjeta
    const columnAliases = useMemo(() => sourceConfig?.columnAliases || {}, [sourceConfig]);

    // 3. HELPER DE MAPEO (OPTIMIZADO CON USECALLBACK)
    const mapItemWithAliases = useCallback((item) => {
        if (!item) return {};
        const newItem = {};

        // Mapear propiedades principales
        Object.keys(item).forEach(key => {
            const alias = columnAliases[key] || key;
            newItem[alias] = item[key];
        });

        // Mapear historial recursivamente
        if (item.history && Array.isArray(item.history)) {
            newItem.history = item.history.map(histItem => {
                const newHistItem = {};
                Object.keys(histItem).forEach(hKey => {
                    const hAlias = columnAliases[hKey] || hKey;
                    newHistItem[hAlias] = histItem[hKey];
                });
                return newHistItem;
            });
        }

        // Preservar metadatos internos
        newItem.id = item.id;
        newItem._id = item._id;
        newItem._isAd = item._isAd;
        newItem._hasHistory = item._hasHistory;
        newItem.Vinculada = item.Vinculada; // Preservar original para lógica interna

        return newItem;
    }, [columnAliases]);

    // 4. LÓGICA DE AGRUPACIÓN Y PROCESAMIENTO
    const processDataWithHistory = useCallback((rawData) => {
        if (!rawData || rawData.length === 0) return [];
        let processedRaw = [...rawData];

        // Ordenar por versión (Año) descendente primero
        if (versionColumn) {
            processedRaw.sort((a, b) => {
                // Intenta extraer números del año para ordenar correctamente (2026 > 2025)
                const yearA = parseInt(String(a[versionColumn]).match(/\d+/) || 0);
                const yearB = parseInt(String(b[versionColumn]).match(/\d+/) || 0);
                return yearB - yearA;
            });
        }

        if (!groupByColumn) return processedRaw;

        // Agrupar
        const groups = {};
        processedRaw.forEach(item => {
            const name = item[groupByColumn];
            // Normalizar nombre para agrupar (quita espacios extra y mayúsculas)
            const key = name ? cleanString(name) : `_NO_GROUP_${Math.random()}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        const processedResults = [];
        const targetClean = cleanString(targetVersion);

        // Seleccionar registro principal + historial
        Object.values(groups).forEach(groupRecords => {
            let mainRecord = null;

            if (targetVersion && versionColumn) {
                mainRecord = groupRecords.find(r => cleanString(r[versionColumn]) === targetClean);
            }

            // Fallback: Si no hay versión target, usa el más reciente (primero de la lista ordenada)
            if (!mainRecord) mainRecord = groupRecords[0];

            if (mainRecord) {
                const history = groupRecords.filter(r => r !== mainRecord);
                processedResults.push({ ...mainRecord, history, _hasHistory: history.length > 0 });
            }
        });

        return processedResults;
    }, [groupByColumn, versionColumn, targetVersion, research?.dateRange]);

    // 5. FILTROS Y ORDENAMIENTO
    const availableOrderColumns = useMemo(() => {
        if (!sourceConfig?.orderColumns || sourceConfig.orderColumns?.length === 0) return [];
        const orders = [];
        sourceConfig.orderColumns.forEach(column => {
            const displayName = columnAliases[column] || (column.charAt(0).toUpperCase() + column.slice(1));
            orders.push({ key: `${column}_ascendente`, label: `${displayName} (Ascendente)` });
            orders.push({ key: `${column}_descendente`, label: `${displayName} (Descendente)` });
        });
        return orders;
    }, [sourceConfig, columnAliases]);

    const availableFilters = useMemo(() => {
        if (!showData.length) return {};
        const filters = {};
        if (sourceConfig?.columns) {
            sourceConfig.columns.forEach(header => {
                const uniqueValues = [...new Set(showData.map(item => item[header]))]
                    .filter(Boolean)
                    .sort((a, b) => String(a).localeCompare(String(b)));
                if (uniqueValues.length > 0) {
                    filters[header] = { label: columnAliases[header] || header, values: uniqueValues };
                }
            });
        }
        return filters;
    }, [showData, sourceConfig, columnAliases]);

    const processedData = useMemo(() => {
        if (!showData) return [];
        const currentFilters = activeFilters || {};

        return showData.filter(item => {
            const matchesSearch = !searchTerm || Object.values(item).some(val =>
                val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesFilters = Object.entries(currentFilters).every(([key, selectedValues]) => {
                if (!selectedValues || !Array.isArray(selectedValues) || selectedValues.length === 0) return true;
                const itemValue = item[key];
                return selectedValues.some(filterVal => cleanString(filterVal) === cleanString(itemValue));
            });

            return matchesSearch && matchesFilters;
        });
    }, [showData, searchTerm, activeFilters]);

    const itemsWithAds = useMemo(() => {
        if (!showAds || processedData.length === 0) return processedData;
        const result = [];
        let adCount = 0;
        processedData.forEach((item, index) => {
            result.push({ ...item, _isAd: false, _id: index });
            if ((index + 1) % itemsPerAds === 0) {
                adCount++;
                result.push({ _isAd: true, _id: `ad-${adCount}`, title: adTitle, desc: adText });
            }
        });
        return result;
    }, [processedData, showAds, itemsPerAds, adTitle, adText]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return itemsWithAds.slice(startIndex, endIndex);
    }, [itemsWithAds, page, itemsPerPage]);

    // 6. EFECTOS (Fetch y Reset)
    useEffect(() => {
        const config = getInitialConfig(quickFilters);
        if (config.label) {
            setActiveFilters(config.filters);
            setSelectedPreset(config.label);
        }
    }, [quickFilters]);

    useEffect(() => {
        if (!sourceConfig?.sheetId) { setData([]); return; }
        if (data.length === 0) setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                const { selectedSheet, sheetId } = sourceConfig;
                const rawData = await fetchSheet(sheetId, selectedSheet);
                const groupedData = processDataWithHistory(rawData);
                setData(groupedData);
                setShowData(groupedData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sourceConfig, processDataWithHistory]);

    useEffect(() => {
        const activeFilterKeys = Object.keys(activeFilters).filter(k => activeFilters[k]?.length > 0);
        if (activeFilterKeys.length === 0 && !searchTerm) {
            const defaultConfig = getInitialConfig(quickFilters);
            if (defaultConfig.label !== "Todos" && selectedPreset === defaultConfig.label) return;
            setSelectedPreset("Todos");
            return;
        }
        const currentPreset = quickFiltersData.find(p => JSON.stringify(p.filters) === JSON.stringify(activeFilters));
        if (currentPreset) setSelectedPreset(currentPreset.label);
        else setSelectedPreset("Personalizado");
    }, [activeFilters, quickFiltersData, searchTerm, quickFilters, selectedPreset]);

    useEffect(() => { setPage(1); }, [searchTerm, activeFilters, order, showData]);

    // 7. HANDLERS
    const handleApplyPreset = (preset) => {
        setSelectedPreset(preset.label);
        const rawFilters = preset.filters || {};
        const sanitizedFilters = {};
        Object.keys(rawFilters).forEach(key => {
            const val = rawFilters[key];
            if (Array.isArray(val)) sanitizedFilters[key] = val;
            else if (val !== null && val !== undefined) sanitizedFilters[key] = [val];
        });
        setActiveFilters(sanitizedFilters);
        setPage(1);
    };

    const handleOrderChange = (event) => {
        const value = event.target.value;
        setOrder(value);
        if (value === "") return;
        const parts = value.split('_');
        const direction = parts.pop();
        const column = parts.join('_');
        const sortedData = [...showData].sort((a, b) => {
            let valA = a[column] || "";
            let valB = b[column] || "";
            if (typeof valA === 'string' && typeof valB === 'string') {
                return direction.toLowerCase() === 'ascendente' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return direction.toLowerCase() === 'ascendente'
                ? (valA < valB ? -1 : (valA > valB ? 1 : 0))
                : (valA > valB ? -1 : (valA < valB ? 1 : 0));
        });
        setShowData(sortedData);
    };

    const handlePageChange = (event, value) => { setPage(value); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleFilterChange = (column, newValues) => { setActiveFilters(prev => ({ ...prev, [column]: newValues })); };
    const handleClearFilters = () => { setActiveFilters({}); setSearchTerm(''); };


    // 8. RENDERIZADO
    return (
        <Container maxWidth="xl" sx={{ py: 6, bgcolor: '#f9fafb', minHeight: '100vh', position: 'relative' }}>
            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            {/* BARRA DE HERRAMIENTAS */}
            <Box sx={{
                mb: 2, bgcolor: 'white', p: 2, borderRadius: 4,
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex', gap: 2, alignItems: 'center'
            }}>
                <TextField
                    fullWidth placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><Search color={activeFilterCount > 0 || searchTerm ? primaryColor : "#9ca3af"} /></InputAdornment>),
                        sx: { borderRadius: 3, bgcolor: '#f9fafb' }
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: '#e0e0e0' }, '&.Mui-focused fieldset': { borderColor: primaryColor } } }}
                />

                <Button variant="outlined" onClick={() => setViewListType(isList ? 'grid' : 'list')} sx={{ height: 56, borderRadius: 3, px: 3, borderColor: '#e0e0e0', color: 'text.primary', textTransform: 'none', fontWeight: 600, flexShrink: 0 }} className='hidden md:block'>
                    {isList ? <LayoutGridIcon size={20} className='me-2 stroke-red-700' /> : <LayoutListIcon size={20} className='me-2 stroke-red-700' />}
                    <span className='hidden md:block text-red-700'>{isList ? 'Grilla' : 'Lista'}</span>
                </Button>

                <Badge badgeContent={activeFilterCount} color="error">
                    <Button variant={activeFilterCount > 0 ? "contained" : "outlined"} onClick={() => setIsDrawerOpen(true)} sx={{ height: 56, borderRadius: 3, px: 3, borderColor: activeFilterCount > 0 ? primaryColor : '#e0e0e0', bgcolor: activeFilterCount > 0 ? primaryColor : 'white', color: activeFilterCount > 0 ? 'white' : 'text.primary', '&:hover': { bgcolor: activeFilterCount > 0 ? primaryColor : '#f5f5f5' }, textTransform: 'none', fontWeight: 600, flexShrink: 0 }}>
                        <SlidersHorizontal size={20} className={`me-2 ${activeFilterCount > 0 ? 'stroke-white' : 'stroke-red-700'}`} />
                        <span className='hidden md:block'>Filtros</span>
                    </Button>
                </Badge>
            </Box>

            <FilterDrawer
                open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
                availableFilters={availableFilters} activeFilters={activeFilters}
                onFilterChange={handleFilterChange} onClearAll={handleClearFilters}
                aliases={columnAliases}
            />

            {/* CHIPS DE FILTRO RÁPIDO */}
            {quickFiltersData.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                    {quickFiltersData.map((preset) => (
                        <Chip
                            key={preset.label} label={preset.label} onClick={() => handleApplyPreset(preset)}
                            color={selectedPreset === preset.label ? "primary" : "default"}
                            variant={selectedPreset === preset.label ? "filled" : "outlined"}
                            sx={{ fontWeight: 700, px: 1, cursor: 'pointer', transition: 'all 0.2s', borderColor: selectedPreset === preset.label ? primaryColor : '#e0e0e0', bgcolor: selectedPreset === preset.label ? primaryColor : 'white', color: selectedPreset === preset.label ? 'white' : 'text.primary', '&:hover': { bgcolor: selectedPreset === preset.label ? primaryColor : '#f5f5f5' } }}
                        />
                    ))}
                    {selectedPreset === "Personalizado" && <Chip label="Filtro manual activo" onDelete={handleClearFilters} color="secondary" size="small" />}
                </Stack>
            )}

            {/* CONTENIDO PRINCIPAL */}
            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map(n => (<Grid size={{ xs: 12, sm: (isList ? 13 : 6), md: (isList ? 12 : gridSize) }} key={n}><Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4 }} /></Grid>))}
                </Grid>
            ) : (
                <Box>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box component="span" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                            <span>Filtrados: <strong>{processedData.length}</strong> de <strong>{showData.length}</strong> registros totales</span>
                        </Box>
                        <Box className="flex">
                            {!isList && (
                                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                    <InputLabel>Ordenar por</InputLabel>
                                    <Select value={order} label="Ordenar por" onChange={handleOrderChange}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {availableOrderColumns.map(order => (<MenuItem key={order.key} value={order.key}>{order.label}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </Box>

                    {isList ? (
                        <TableList
                            data={itemsWithAds.filter(i => !i._isAd)}
                            columns={sourceConfig?.columns || []}
                            aliases={columnAliases}
                        />
                    ) : (
                        <Grid container spacing={3}>
                            {paginatedData.map((item, index) => {
                                // Renderizar Anuncio
                                if (item._isAd) {
                                    return (
                                        <Grid size={{ xs: 12, sm: 6, md: gridSize }} key={`ad-${index}`} className="flex justify-center">
                                            <AdCard primaryColor={primaryColor} />
                                        </Grid>
                                    );
                                }

                                // Renderizar Tarjeta (Usamos el helper memorizado para rendimiento)
                                const mappedItem = mapItemWithAliases(item);

                                return (
                                    <Grid size={{ xs: 12, sm: 6, md: gridSize }} key={item._id || item.id || index}>
                                        <DirectoryCard
                                            item={mappedItem}
                                            viewType={viewListType}
                                            primaryColor={primaryColor}
                                            sourceConfig={sourceConfig}
                                            research={research}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}

                    {!isList && itemsWithAds.length > itemsPerPage && (
                        <Stack spacing={2} sx={{ mt: 5, mb: 2, display: 'flex', alignItems: 'center' }}>
                            <Pagination count={Math.ceil(itemsWithAds.length / itemsPerPage)} page={page} onChange={handlePageChange} color="primary" size="large" shape="rounded" />
                        </Stack>
                    )}
                </Box>
            )}

            {/* WIDGETS DE COMPARACIÓN */}
            <ComparisonWidget />
            <ComparisonModal sourceConfig={sourceConfig} />

        </Container>
    );
};

// ========================================================================
// WRAPPER PRINCIPAL (Provee el contexto)
// ========================================================================
const DirectorySection = (props) => {
    return (
        <ComparisonProvider>
            <DirectorySectionContent {...props} />
        </ComparisonProvider>
    );
};

export default DirectorySection;