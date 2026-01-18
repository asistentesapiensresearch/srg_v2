// src/view/sections/DirectorySection/index.jsx
import { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Grid, Skeleton, Alert, Button,
    InputAdornment, TextField, Badge,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Stack
} from "@mui/material";
import { LayoutGridIcon, LayoutListIcon, Search, SlidersHorizontal } from "lucide-react";

// Componentes
import { DirectoryCard } from './results/DirectoryCard';
import { AdCard } from './results/AdCard';
import { FilterDrawer } from './filters/FilterDrawer';
import { fetchSheet } from './fetchSheet';
import { getValue } from './results/utils';
import TableList from './results/TableList';

const DirectorySection = ({
    sourceConfig,
    viewType = 'grid',
    itemsPerAds = 3,
    itemsPerColumn = 3,
    showAds = true,
    primaryColor = "var(--color-red-700)",
    adTitle = "Publicidad",
    adText = "Tu marca aquí.",
    research,
    itemsPerPage = 12
}) => {
    // --- ESTADOS ---
    const [data, setData] = useState([]);
    const [showData, setShowData] = useState([]); // Datos agrupados y listos para filtrar
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Búsqueda y Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [page, setPage] = useState(1);

    const [viewListType, setViewListType] = useState(viewType === 'grid' ? 'grid' : 'list');

    const gridSize = Math.floor(12 / Math.max(1, itemsPerColumn));

    const [order, setOrder] = useState('');

    // --- LÓGICA DE ORDENAMIENTO (Global para Grid) ---
    const handleOrderChange = (event) => {
        const value = event.target.value;
        setOrder(value);

        if (value === "") {
            // Si quita el orden, restauramos el orden original (por defecto, alfabético o como venga)
            // Aquí simplemente forzamos un re-render con la data base, pero idealmente podrías guardar el orden inicial
            return;
        }

        const parts = value.split('_');
        const direction = parts.pop();
        const column = parts.join('_');

        const sortedData = [...showData].sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            if (valA == null) valA = "";
            if (valB == null) valB = "";

            if (typeof valA === 'string' && typeof valB === 'string') {
                return direction.toLowerCase() === 'ascendente'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            if (direction.toLowerCase() === 'ascendente') {
                return valA < valB ? -1 : (valA > valB ? 1 : 0);
            } else {
                return valA > valB ? -1 : (valA < valB ? 1 : 0);
            }
        });

        setShowData(sortedData);
    };

    // --- HELPER: PROCESAR DATOS (AGRUPAR + HISTORIAL) ---
    const processDataWithHistory = (rawData) => {
        if (!rawData || rawData.length === 0) return [];

        // 1. Agrupar por nombre de institución
        const groups = {};

        rawData.forEach(item => {
            // Busca la columna nombre usando varias keywords comunes
            const name = getValue(item, ['nombre', 'name', 'colegio', 'institucion', 'title']) || 'Sin Nombre';
            const key = String(name).trim().toUpperCase();

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });

        // 2. Seleccionar registro principal vs historial
        const processedResults = [];
        // Normalizamos el rango buscado (ej: "2025-2026" -> "2025-2026") quitando espacios si es necesario
        const targetRange = research?.dateRange ? String(research.dateRange).replaceAll(' ', '') : '';

        Object.values(groups).forEach(groupRecords => {
            let mainRecord = null;

            if (targetRange) {
                // Buscamos el registro que coincida con el año seleccionado
                mainRecord = groupRecords.find(r => {
                    // Busca columna año/vigencia
                    const rYear = getValue(r, ['año', 'year', 'vigencia', 'date', 'rango']);
                    return rYear && String(rYear).replaceAll(' ', '') === targetRange;
                });
            }

            // Si no hay coincidencia exacta o no hay filtro, tomamos el primero (el más reciente o el 0)
            if (!mainRecord) {
                mainRecord = groupRecords[0];
            }

            if (mainRecord) {
                // El resto son historia
                const history = groupRecords.filter(r => r !== mainRecord);

                // Creamos el objeto final
                processedResults.push({
                    ...mainRecord,
                    history: history
                });
            }
        });

        return processedResults;
    };

    // --- 1. CARGA DE DATOS ---
    useEffect(() => {
        if (!sourceConfig?.sheetId) { setData([]); return; }
        setLoading(true); setError(null);

        const fetchData = async () => {
            try {
                const { selectedSheet, sheetId } = sourceConfig;
                const rawData = await fetchSheet(sheetId, selectedSheet);

                // Procesamos agrupación e historial AQUÍ
                const groupedData = processDataWithHistory(rawData);

                setData(groupedData);
                setShowData(groupedData);
                setLoading(false);
            } catch (err) {
                console.error(err); setError(err.message); setLoading(false);
            }
        };
        fetchData();
        // Recargamos si cambia la config o el rango de fecha del research
    }, [sourceConfig, research?.dateRange]);

    // Opciones de ordenamiento para el Select
    const availableOrderColumns = useMemo(() => {
        if (!sourceConfig.orderColumns || sourceConfig.orderColumns?.length === 0) return [];
        const orders = [];
        sourceConfig.orderColumns.forEach(order => {
            const options = ['Ascendente', 'Descendente'];
            options.forEach(opt => {
                orders.push({
                    key: `${order}_${opt}`,
                    label: `${order} - ${opt}`
                });
            });
        });
        return orders;
    }, [sourceConfig]);

    // --- 2. CÁLCULO DE FILTROS (Basado en la data ya agrupada) ---
    const availableFilters = useMemo(() => {
        if (!showData.length) return {};
        const filters = {};
        if (sourceConfig.filters) {
            sourceConfig.filters.forEach(header => {
                const uniqueValues = [...new Set(showData.map(item => item[header]))]
                    .filter(Boolean)
                    .sort((a, b) => String(a).localeCompare(String(b)));
                if (uniqueValues.length > 0) {
                    filters[header] = uniqueValues;
                }
            });
        }
        return filters;
    }, [showData, sourceConfig]);

    // --- LÓGICA DE FILTRADO (Search + Filters) ---
    const processedData = useMemo(() => {
        return showData.filter(item => {
            // A. Búsqueda Global
            const matchesSearch = Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
            // B. Filtros Activos
            const matchesFilters = Object.entries(activeFilters).every(([key, selectedValues]) => {
                if (!selectedValues || selectedValues.length === 0) return true;
                return selectedValues.includes(item[key]);
            });
            return matchesSearch && matchesFilters;
        });
    }, [showData, searchTerm, activeFilters]);

    // --- INYECCIÓN DE PUBLICIDAD ---
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

    // --- PAGINACIÓN (Grid) ---
    useEffect(() => {
        setPage(1);
    }, [searchTerm, activeFilters, order, showData]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return itemsWithAds.slice(startIndex, endIndex);
    }, [itemsWithAds, page, itemsPerPage]);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // HANDLERS
    const handleFilterChange = (column, newValues) => {
        setActiveFilters(prev => ({ ...prev, [column]: newValues }));
    };

    const handleClearFilters = () => {
        setActiveFilters({});
        setSearchTerm('');
    };

    const activeFilterCount = Object.values(activeFilters).flat().length;
    const isList = viewListType === 'list';

    // --- RENDER ---
    return (
        <Container maxWidth="xl" sx={{ py: 6, bgcolor: '#f9fafb', minHeight: '100vh' }}>

            {/* HEADER CONTROLS */}
            <Box sx={{
                mb: 2, bgcolor: 'white', p: 2, borderRadius: 4,
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex', gap: 2, alignItems: 'center'
            }}>
                <TextField
                    fullWidth
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start"><Search color="#9ca3af" /></InputAdornment>
                        ),
                        sx: { borderRadius: 3, bgcolor: '#f9fafb' }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'transparent' },
                            '&:hover fieldset': { borderColor: '#e0e0e0' },
                            '&.Mui-focused fieldset': { borderColor: primaryColor },
                        }
                    }}
                />

                <Button
                    variant="outlined"
                    onClick={() => setViewListType(isList ? 'grid' : 'list')}
                    sx={{
                        height: 56, borderRadius: 3, px: 3, borderColor: '#e0e0e0',
                        color: 'text.primary', textTransform: 'none', fontWeight: 600, flexShrink: 0
                    }}
                    className='hidden md:block'
                >
                    {isList ? <LayoutGridIcon size={20} className='me-2 stroke-red-700' /> : <LayoutListIcon size={20} className='me-2 stroke-red-700' />}
                    <span className='hidden md:block text-red-700'>{isList ? 'Grilla' : 'Lista'}</span>
                </Button>

                <Badge badgeContent={activeFilterCount} color="primary">
                    <Button
                        variant="outlined"
                        onClick={() => setIsDrawerOpen(true)}
                        sx={{
                            height: 56, borderRadius: 3, px: 3, borderColor: '#e0e0e0',
                            textTransform: 'none', fontWeight: 600, flexShrink: 0, marginRight: 0
                        }}
                    >
                        <SlidersHorizontal size={20} className='me-2 stroke-red-700' />
                        <span className='hidden md:block text-red-700'>Filtros</span>
                    </Button>
                </Badge>
            </Box>

            <FilterDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                availableFilters={availableFilters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearFilters}
            />

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map(n => (
                        <Grid item xs={12} sm={isList ? 13 : 6} md={isList ? 12 : gridSize} key={n}>
                            <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box component="span" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                            {isList
                                ? <span>Total resultados: <strong>{itemsWithAds.filter(i => !i._isAd).length}</strong></span>
                                : <span>Mostrando <strong>{paginatedData.length}</strong> de <strong>{itemsWithAds.filter(i => !i._isAd).length}</strong></span>
                            }
                        </Box>
                        <Box className="flex">
                            {(activeFilterCount > 0 || searchTerm) && (
                                <Button size="small" onClick={handleClearFilters} color="inherit">
                                    Limpiar todo
                                </Button>
                            )}

                            {/* Ocultamos ordenar global en modo Tabla porque la tabla tiene sus propios headers */}
                            {!isList && (
                                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                    <InputLabel>Ordenar por</InputLabel>
                                    <Select value={order} label="Ordenar por" onChange={handleOrderChange}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {availableOrderColumns.map(order => (<MenuItem value={order.key}>{order.label}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </Box>

                    {/* VIEW SWITCHER */}
                    {isList ? (
                        /* VISTA TABLA: Recibe data filtrada (sin ads) y maneja su paginación interna */
                        <TableList
                            data={itemsWithAds.filter(i => !i._isAd)}
                            columns={sourceConfig.columns || []}
                            aliases={sourceConfig.columnAliases || {}}
                        />
                    ) : (
                        /* VISTA GRID: Usa paginación global */
                        <Grid container spacing={3}>
                            {paginatedData.map((item, index) => {
                                if (item._isAd) {
                                    return (
                                        <Grid item xs={12} sm={6} md={gridSize} key={item._id} className="flex justify-center">
                                            <AdCard item={item} primaryColor={primaryColor} />
                                        </Grid>
                                    );
                                }
                                return (
                                    <Grid item xs={12} sm={6} md={gridSize} key={item._id || index}>
                                        <DirectoryCard
                                            item={item}
                                            viewType={viewListType}
                                            primaryColor={primaryColor}
                                            sourceConfig={sourceConfig} // <-- Pasar configuración para los Alias
                                            research={research}         // <-- Pasar contexto de búsqueda
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}

                    {/* PAGINACIÓN GRID (Solo visible si no es lista) */}
                    {!isList && itemsWithAds.length > itemsPerPage && (
                        <Stack spacing={2} sx={{ mt: 5, mb: 2, display: 'flex', alignItems: 'center' }}>
                            <Pagination
                                count={Math.ceil(itemsWithAds.length / itemsPerPage)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                shape="rounded"
                            />
                        </Stack>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default DirectorySection;