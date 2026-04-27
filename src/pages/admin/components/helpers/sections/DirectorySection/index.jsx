import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box, Container, Grid, Skeleton, Alert, Button,
    InputAdornment, TextField, Badge,
    FormControl, InputLabel, Select, MenuItem,
    Pagination, Stack, Chip, Typography
} from "@mui/material";
import { LayoutGridIcon, LayoutListIcon, Search, SlidersHorizontal } from "lucide-react";

import { generateClient } from "aws-amplify/data";
import { DirectoryCard } from './results/DirectoryCard';
import { AdCard } from './results/AdCard';
import { FilterDrawer } from './filters/FilterDrawer';
import { fetchSheet } from './fetchSheet';
import TableList from './results/TableList';

import { ComparisonProvider } from './comparison/ComparisonContext';
import ComparisonWidget from './comparison/ComparisonWidget';
import ComparisonModal from './comparison/ComparisonModal';
import { CardColSapiens } from './cards/CardColSapiens';

const client = generateClient();

// ========================================================================
// HELPERS
// ========================================================================

const cleanString = (val) => {
    if (val === null || val === undefined) return "";
    return String(val)
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
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
    return { label: defaultItem.label, filters: sanitized };
};

// función para obtener items Aleatorios
const getRandomItems = (data, count = 3) => {
  if (!data || data.length === 0) return [];

  const result = [];
  const usedIndexes = new Set();

  while (result.length < count && usedIndexes.size < data.length) {
    const randomIndex = Math.floor(Math.random() * data.length);

    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);
      result.push(data[randomIndex]);
    }
  }
  return result;
};

// ========================================================================
// COMPONENTE PRINCIPAL
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

    // Configuración Agrupación
    groupByColumn = "",   // Se espera el ALIAS aquí (ej: 'id_colegio')
    versionColumn = "",   // Se espera el ALIAS aquí (ej: 'year')
    targetVersion = "",   // Valor esperado (ej: '2025')

    // Configuración Enriquecimiento
    enableEnrichment = false,
    enrichmentKey = "",   // Se espera el ALIAS aquí
    enrichmentType = "",
    enrichmentSubtype = ""
}) => {

    // --- ESTADOS ---
    const [activeFilters, setActiveFilters] = useState(() => getInitialConfig(quickFilters).filters);
    const [selectedPreset, setSelectedPreset] = useState(() => getInitialConfig(quickFilters).label);

    // Almacena la data YA normalizada, enriquecida y agrupada (Lista maestra)
    const [masterData, setMasterData] = useState([]);

    // Data filtrada y lista para paginar
    const [showData, setShowData] = useState([]);

    // Data items Cards Aleatorio
    const [randomItems, setRandomItems] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('');
    const [viewListType, setViewListType] = useState(viewType === 'grid' ? 'grid' : 'list');

    // --- MEMOS DE CONFIG ---
    const gridSize = Math.floor(12 / Math.max(1, itemsPerColumn));
    const isList = viewListType === 'list';
    const activeFilterCount = Object.values(activeFilters).flat().length;
    const quickFiltersData = useMemo(() => parseQuickFilters(quickFilters), [quickFilters]);
    const columnAliases = useMemo(() => sourceConfig?.columnAliases || {}, [sourceConfig]);



    // ========================================================================
    // 1. EL GRAN PIPELINE DE DATOS (Fetch -> Alias -> Enrich -> Sort -> Group)
    // ========================================================================
    useEffect(() => {
        if (!sourceConfig?.sheetId) { setMasterData([]); return; }

        const runDataPipeline = async () => {
            setLoading(true);
            setError(null);
            try {
                // ---------------------------------------------------------
                // PASO 1: FETCH
                // ---------------------------------------------------------
                const { selectedSheet, sheetId } = sourceConfig;
                const rawRows = await fetchSheet(sheetId, selectedSheet);
                console.log({rawRows});

                // ---------------------------------------------------------
                // PASO 2: AJUSTAR ALIAS (NORMALIZACIÓN TEMPRANA)
                // ---------------------------------------------------------
                // Creamos un array donde CADA objeto ya tiene las keys configuradas en el alias.
                // Si en Excel es "Nombre Col" y el alias es "name", el objeto tendrá ambas.
                let processedData = rawRows.map(row => {
                    const normalizedRow = { ...row }; // Copia base

                    // Inyectar keys de alias
                    Object.keys(columnAliases).forEach(excelHeader => {
                        const aliasKey = columnAliases[excelHeader];
                        // Si el row tiene el header original, asignamos el valor al alias
                        if (row[excelHeader] !== undefined) {
                            normalizedRow[aliasKey] = row[excelHeader];
                        }
                    });

                    // Inicializar flags
                    normalizedRow._isEnriched = false;
                    normalizedRow.history = [];
                    normalizedRow._hasHistory = false;
                    return normalizedRow;
                });

                // ---------------------------------------------------------
                // PASO 3: ENRIQUECIMIENTO (USANDO YA LOS ALIAS)
                // ---------------------------------------------------------
                if (enableEnrichment && enrichmentKey) {
                    try {
                        // Filtros BD
                        let filter = {};
                        if (enrichmentType) filter.type = { eq: enrichmentType };
                        if (enrichmentSubtype) filter.subtype = { eq: enrichmentSubtype };

                        // Fetch BD
                        const { data: institutionsDB } = await client.models.Institution.list({
                            filter: Object.keys(filter).length > 0 ? filter : undefined,
                            limit: 4000
                        });

                        // Crear mapa de búsqueda
                        const institutionMap = new Map();
                        institutionsDB.forEach(inst => {
                            if (inst.name) institutionMap.set(cleanString(inst.name), inst);
                        });

                        // Merge
                        processedData = processedData.map(row => {
                            // Buscamos usando la key que puede ser un Alias ya inyectado en Paso 2
                            const lookupValue = cleanString(row[enrichmentKey]);

                            if (lookupValue && institutionMap.has(lookupValue)) {
                                const dbModel = institutionMap.get(lookupValue);
                                // Aplanar para evitar proxies
                                const dbData = {
                                    logo: dbModel.logo,
                                    rectorName: dbModel.rectorName,
                                    rectorPhoto: dbModel.rectorPhoto,
                                    rectorSocial: dbModel.rectorSocial,
                                    socialMedia: dbModel.socialMedia,
                                    website: dbModel.website,
                                    isLinked: dbModel.isLinked,
                                    path: dbModel.path,
                                    languages: dbModel.languages,
                                    description: dbModel.description,
                                    type: dbModel.type,
                                    subtype: dbModel.subtype
                                };
                                // Retornar merge (Spread dbData al final para sobrescribir si es necesario)
                                return { ...row, ...dbData, _isEnriched: true };
                            }
                            return row;
                        });

                    } catch (err) {
                        console.error("Error Enriqueciendo:", err);
                    }
                }

                // ---------------------------------------------------------
                // PASO 4 Y 5: ORDENAR Y AGRUPAR
                // ---------------------------------------------------------
                // Ahora usamos `processedData` que ya tiene alias y datos enriquecidos.

                let finalGroupedData = [];

                if (!groupByColumn) {
                    finalGroupedData = processedData;
                } else {

                    const groups = {};

                    processedData.forEach((item, index) => {
                        // Obtenemos el valor usando el ALIAS
                        const rawValue = item[groupByColumn];

                        // 🔥 CORRECCIÓN: Usar nombre real o indicador claro de error
                        let groupKey;

                        if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
                            // Usamos el valor limpio para agrupar (evita duplicados por tildes/mayúsculas)
                            groupKey = cleanString(rawValue);
                        } else {
                            // Si falla, mostramos un texto claro para depurar
                            // Intenta usar el nombre del colegio si existe otra columna común, sino marca error
                            const posibleNombre = item['Nombre'] || item['nombre'] || item['Institution'] || `Fila_${index}`;
                            groupKey = `SIN_DATO_EN_${groupByColumn}__(${posibleNombre})`;

                            console.warn(`⚠️ Item sin valor para agrupar "${groupByColumn}":`, item);
                        }

                        if (!groups[groupKey]) groups[groupKey] = [];
                        groups[groupKey].push(item);
                    });

                    // Procesar cada grupo (History Logic)
                    const targetClean = cleanString(targetVersion);

                    Object.values(groups).forEach(records => {
                        // 1. Ordenar por versión (Año)
                        if (versionColumn) {
                            records.sort((a, b) => {
                                const valA = String(a[versionColumn] || "");
                                const valB = String(b[versionColumn] || "");
                                const numA = parseInt(valA.replace(/\D/g, ''), 10);
                                const numB = parseInt(valB.replace(/\D/g, ''), 10);
                                if (!isNaN(numA) && !isNaN(numB) && numA !== numB) return numB - numA;
                                return valB.localeCompare(valA, undefined, { numeric: true });
                            });
                        }

                        // 2. Seleccionar Principal
                        let mainRecord = null;
                        if (targetVersion && versionColumn) {
                            mainRecord = records.find(r => cleanString(r[versionColumn]) === targetClean);
                        }
                        if (!mainRecord) mainRecord = records[0];

                        // 3. Generar Historial
                        const history = records.filter(r => r !== mainRecord);

                        finalGroupedData.push({
                            ...mainRecord,
                            history: history,
                            _hasHistory: history.length > 0
                        });
                    });
                }

                setMasterData(finalGroupedData);

            } catch (err) {
                console.error(err);
                setError(err.message || "Error procesando datos");
            } finally {
                setLoading(false);
            }
        };

        runDataPipeline();
        // Dependencias críticas: Si cambia el Sheet ID o los Alias, se corre todo de nuevo.
    }, [sourceConfig, enableEnrichment, enrichmentKey, enrichmentType, enrichmentSubtype, groupByColumn, versionColumn, targetVersion, columnAliases]);


    // ========================================================================
    // 6. PASO 6: FILTRADO (Sobre la Master Data ya agrupada)
    // ========================================================================

    // Este efecto escucha cambios en filtros/busqueda y actualiza `showData`
    useEffect(() => {
        if (!masterData) return;

        let filtered = [...masterData];

        // A. Buscador Global
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                Object.values(item).some(val =>
                    val && String(val).toLowerCase().includes(term)
                )
            );
        }

        // B. Filtros Rápidos / Facetas
        const activeKeys = Object.keys(activeFilters);
        if (activeKeys.length > 0) {
            filtered = filtered.filter(item => {
                return activeKeys.every(key => {
                    const selectedValues = activeFilters[key];
                    if (!selectedValues || selectedValues.length === 0) return true;

                    // Buscamos en el item (que ya tiene alias)
                    const itemValue = item[key];
                    return selectedValues.some(fVal => cleanString(fVal) === cleanString(itemValue));
                });
            });
        }

        // C. Ordenamiento Visual (Grid/List sorting)
        if (order) {
            const parts = order.split('_');
            const direction = parts.pop(); // 'ascendente' | 'descendente'
            const column = parts.join('_'); // Alias

            filtered.sort((a, b) => {
                let valA = a[column] || "";
                let valB = b[column] || "";

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return direction === 'ascendente'
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                }
                // Fallback simple
                return direction === 'ascendente'
                    ? (valA > valB ? 1 : -1)
                    : (valA < valB ? 1 : -1);
            });
        }

        setShowData(filtered);
        setPage(1); // Reset pagina al filtrar

    }, [masterData, searchTerm, activeFilters, order]);


    // ========================================================================
    // UI HELPERS (Filters, Pagination, Ads)
    // ========================================================================

    const availableFilters = useMemo(() => {
        // Calculamos filtros basados en la data visible o la maestra? 
        // Usualmente sobre `masterData` para que las opciones no desaparezcan al filtrar,
        // pero aquí usaremos `showData` para facetas dependientes si prefieres.
        // Usemos `masterData` para consistencia de opciones disponibles.
        if (!masterData.length) return {};

        const filters = {};
        if (sourceConfig?.columns) {
            sourceConfig.columns.forEach(header => {
                // Resolvemos si header es un Alias o Nombre Original
                // Como `masterData` ya tiene los ALIAS inyectados, usamos el Alias si existe.
                const alias = columnAliases[header] || header;

                const uniqueValues = [...new Set(masterData.map(item => item[alias]))]
                    .filter(val => val !== null && val !== undefined && val !== "")
                    .sort((a, b) => String(a).localeCompare(String(b)));

                if (uniqueValues.length > 0) {
                    filters[alias] = { label: alias, values: uniqueValues };
                }
            });
        }
        return filters;
    }, [masterData, sourceConfig, columnAliases]);

    const itemsWithAds = useMemo(() => {
        if (!showAds || showData.length === 0) return showData;
        const result = [];
        let adCount = 0;
        showData.forEach((item, index) => {
            // Asignar ID visual para React Keys
            result.push({ ...item, _isAd: false, _renderId: item.id || `item-${index}` });
            if ((index + 1) % itemsPerAds === 0) {
                adCount++;
                result.push({ _isAd: true, _renderId: `ad-${adCount}`, title: adTitle, desc: adText });
            }
        });
        return result;
    }, [showData, showAds, itemsPerAds, adTitle, adText]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return itemsWithAds.slice(startIndex, endIndex);
    }, [itemsWithAds, page, itemsPerPage]);


    useEffect(() => {
        if (!masterData || masterData.length === 0) return;

        const aliados = masterData.filter( el => el["Vinculada"] === "Sí");

        // inicial
        setRandomItems(getRandomItems(aliados));

        const interval = setInterval(() => {
            setRandomItems(getRandomItems(aliados));
        }, 10000); // cada 10 segundos

        return () => clearInterval(interval);
    }, [masterData]);

    // --- HANDLERS ---
    const handleApplyPreset = (preset) => {
        setSelectedPreset(preset.label);
        // Convertir formato simple a formato de filtro interno
        const rawFilters = preset.filters || {};
        const sanitizedFilters = {};
        Object.keys(rawFilters).forEach(key => {
            const val = rawFilters[key];
            if (Array.isArray(val)) sanitizedFilters[key] = val;
            else if (val) sanitizedFilters[key] = [val];
        });
        setActiveFilters(sanitizedFilters);
    };

    // Inicializar filtros rápidos
    useEffect(() => {
        const config = getInitialConfig(quickFilters);
        if (config.label) {
            setActiveFilters(config.filters);
            setSelectedPreset(config.label);
        }
    }, [quickFilters]);


    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <Box sx={{ px: 3, py: 6, bgcolor: '#f9fafb', width:"100%", minHeight: '100vh', position: 'relative' }}>
            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            {
                randomItems && <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 4,
                    pb: 6,
                    alignItems: "stretch",
                }}>
                    {
                        randomItems.map( el => (<CardColSapiens props={el} />))
                    }
                </Box>
            }

            {/* HEADER */}
            <Box sx={{ mb: 2, bgcolor: 'white', p: 2, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><Search color={activeFilterCount > 0 || searchTerm ? primaryColor : "#9ca3af"} /></InputAdornment>),
                        sx: { borderRadius: 3, bgcolor: '#f9fafb' }
                    }}
                    sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'transparent' } } }}
                />
                <Button variant="outlined" onClick={() => setViewListType(isList ? 'grid' : 'list')} sx={{ height: 56, borderRadius: 3, px: 3, borderColor: '#e0e0e0', color: 'text.primary', textTransform: 'none' }} className='hidden md:flex'>
                    {isList ? <LayoutGridIcon size={20} className='me-2 stroke-red-700' /> : <LayoutListIcon size={20} className='me-2 stroke-red-700' />}
                    <span className='hidden md:block text-red-700'>{isList ? 'Grilla' : 'Lista'}</span>
                </Button>
                <Badge badgeContent={activeFilterCount} color="error">
                    <Button variant={activeFilterCount > 0 ? "contained" : "outlined"} onClick={() => setIsDrawerOpen(true)} sx={{ height: 56, borderRadius: 3, px: 3, borderColor: activeFilterCount > 0 ? primaryColor : '#e0e0e0', bgcolor: activeFilterCount > 0 ? primaryColor : 'white', color: activeFilterCount > 0 ? 'white' : 'text.primary', textTransform: 'none' }}>
                        <SlidersHorizontal size={20} className={`me-2 ${activeFilterCount > 0 ? 'stroke-white' : 'stroke-red-700'}`} />
                        <span className='hidden md:block'>Filtros</span>
                    </Button>
                </Badge>
            </Box>

            <FilterDrawer
                open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
                availableFilters={availableFilters} activeFilters={activeFilters}
                onFilterChange={(col, vals) => setActiveFilters(prev => ({ ...prev, [col]: vals }))}
                onClearAll={() => { setActiveFilters({}); setSearchTerm(''); }}
                aliases={columnAliases}
            />

            {/* PRESETS */}
            {parseQuickFilters(quickFilters).length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
                    {parseQuickFilters(quickFilters).map((preset) => (
                        <Chip
                            key={preset.label} label={preset.label} onClick={() => handleApplyPreset(preset)}
                            color={selectedPreset === preset.label ? "primary" : "default"}
                            variant={selectedPreset === preset.label ? "filled" : "outlined"}
                            sx={{ fontWeight: 700, borderColor: selectedPreset === preset.label ? primaryColor : '#e0e0e0', bgcolor: selectedPreset === preset.label ? primaryColor : 'white', color: selectedPreset === preset.label ? 'white' : 'text.primary' }}
                        />
                    ))}
                </Stack>
            )}

            {/* CONTENIDO */}
            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map(n => (<Grid size={{ xs: 12, sm: 6, md: gridSize }} key={n}><Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4 }} /></Grid>))}
                </Grid>
            ) : (
                <Box>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Mostrando <strong>{itemsWithAds.filter(x => !x._isAd).length}</strong> resultados</Typography>
                        {!isList && (
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel>Ordenar por</InputLabel>
                                <Select value={order} label="Ordenar por" onChange={(e) => setOrder(e.target.value)}>
                                    <MenuItem value=""><em>Defecto</em></MenuItem>
                                    {(sourceConfig?.orderColumns || []).map(col => {
                                        const alias = columnAliases[col] || col;
                                        return [
                                            <MenuItem key={`${alias}_asc`} value={`${alias}_ascendente`}>{alias} (Asc)</MenuItem>,
                                            <MenuItem key={`${alias}_desc`} value={`${alias}_descendente`}>{alias} (Desc)</MenuItem>
                                        ]
                                    })}
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    {isList ? (
                        <TableList data={itemsWithAds.filter(i => !i._isAd)} columns={sourceConfig?.columns || []} aliases={columnAliases} />
                    ) : (
                        <Grid container spacing={3}>
                            {paginatedData.map((item, index) => {
                                if (item._isAd) return <Grid size={{ xs: 12, sm: 6, md: gridSize }} key={item._renderId} className="flex justify-center"><AdCard primaryColor={primaryColor} title={item.title} desc={item.desc} /></Grid>;

                                return (
                                    <Grid size={{ xs: 12, sm: 6, md: gridSize }} key={item._renderId}>
                                        <DirectoryCard item={item} viewType={viewListType} primaryColor={primaryColor} sourceConfig={sourceConfig} research={research} />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}

                    {!isList && itemsWithAds.length > itemsPerPage && (
                        <Stack spacing={2} sx={{ mt: 5, mb: 2, alignItems: 'center' }}>
                            <Pagination count={Math.ceil(itemsWithAds.length / itemsPerPage)} page={page} onChange={(e, v) => { setPage(v); window.scrollTo({ top: 0, behavior: 'smooth' }) }} color="primary" size="large" shape="rounded" />
                        </Stack>
                    )}
                </Box>
            )}

            <ComparisonWidget />
            <ComparisonModal sourceConfig={sourceConfig} />
        </Box>
    );
};

// Wrapper
const DirectorySection = (props) => (
    <ComparisonProvider>
        <DirectorySectionContent {...props} />
    </ComparisonProvider>
);

export default DirectorySection;