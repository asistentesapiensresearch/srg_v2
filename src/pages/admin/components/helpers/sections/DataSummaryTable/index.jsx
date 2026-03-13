import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Container, Skeleton, Alert } from '@mui/material';
import { Linkedin, Mail, Link as LinkIcon, Globe } from 'lucide-react';
import { fetchSheet } from '../DirectorySection/fetchSheet';
import DataSourceManager from '@src/core/data/DataSourceManager';


// Helper de limpieza
const cleanString = (val) => {
    if (val === null || val === undefined) return "";
    return String(val).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

const DataSummaryTable = ({
    sourceConfig,
    filterField = "",
    filterValue = "",

    // Enriquecimiento
    enableEnrichment = false,
    enrichmentKey = "",
    enrichmentType = "",
    enrichmentSubtype = "",

    // Versión / Agrupación
    versionColumn = "",
    targetVersion = "",

    // UI
    tableLayout = "[]",
    borderColor = "#e5e7eb",
    labelColor = "#1f2937"
}) => {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const columnAliases = useMemo(() => sourceConfig?.columnAliases || {}, [sourceConfig]);
    const layout = useMemo(() => {
        try { return JSON.parse(tableLayout || "[]"); }
        catch (e) { return []; }
    }, [tableLayout]);

    // ==========================================
    // PIPELINE DE DATOS
    // ==========================================
    useEffect(() => {
        if (!sourceConfig?.sheetId || !filterField || !filterValue) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch
                const rawRows = await fetchSheet(sourceConfig.sheetId, sourceConfig.selectedSheet);

                // 2. Aplicar Alias a todas las filas
                let processedData = rawRows.map(row => {
                    const normalizedRow = { ...row };
                    Object.keys(columnAliases).forEach(excelHeader => {
                        const alias = columnAliases[excelHeader];
                        if (row[excelHeader] !== undefined) normalizedRow[alias] = row[excelHeader];
                    });
                    return normalizedRow;
                });

                // 3. Filtrar para obtener el "Grupo" histórico de esta entidad
                let filteredData = processedData.filter(item => {
                    const itemVal = item[filterField];
                    return itemVal && cleanString(itemVal) === cleanString(filterValue);
                });

                if (filteredData.length === 0) {
                    setError("No se encontró ningún registro que coincida.");
                    setLoading(false);
                    return;
                }

                // 4. LÓGICA DE VERSIÓN (Igual que Agrupación)
                let mainRecord = null;

                if (versionColumn) {
                    // A. Ordenar Descendente por defecto
                    filteredData.sort((a, b) => {
                        const valA = String(a[versionColumn] || "");
                        const valB = String(b[versionColumn] || "");
                        const numA = parseInt(valA.replace(/\D/g, ''), 10);
                        const numB = parseInt(valB.replace(/\D/g, ''), 10);
                        if (!isNaN(numA) && !isNaN(numB) && numA !== numB) return numB - numA;
                        return valB.localeCompare(valA, undefined, { numeric: true });
                    });

                    // B. Buscar Target Específico
                    if (targetVersion) {
                        const targetClean = cleanString(targetVersion);
                        mainRecord = filteredData.find(r => cleanString(r[versionColumn]) === targetClean);
                    }
                }

                // Si no hay targetVersion o no se encontró, tomamos el más reciente (posición 0 tras el sort)
                if (!mainRecord) {
                    mainRecord = filteredData[0];
                }

                // 5. ENRIQUECIMIENTO (Igual al Directorio)
                if (enableEnrichment && enrichmentKey) {
                    try {
                        let filter = {};
                        if (enrichmentType) filter.type = { eq: enrichmentType };
                        if (enrichmentSubtype) filter.subtype = { eq: enrichmentSubtype };

                        // Fetch BD (Traemos con límite para hacer el matching por cleanString localmente)
                        // Cambio llamado de petición para que dependa directamente de DataSourceManager y su sistema de cacheo
                        const { data: institutionsDB } = await DataSourceManager.findWithFilter(
                            "Institution",
                            filter,
                            3000
                        );

                        const institutionMap = new Map();
                        institutionsDB.forEach(inst => {
                            if (inst.name) institutionMap.set(cleanString(inst.name), inst);
                        });

                        const lookupValue = cleanString(mainRecord[enrichmentKey]);
                        if (lookupValue && institutionMap.has(lookupValue)) {
                            const dbModel = institutionMap.get(lookupValue);
                            const dbData = {
                                logo: dbModel.logo,
                                rectorName: dbModel.rectorName,
                                rectorPhoto: dbModel.rectorPhoto,
                                rectorSocial: dbModel.rectorSocial,
                                socialMedia: dbModel.socialMedia,
                                website: dbModel.website,
                                isLinked: dbModel.isLinked,
                                languages: dbModel.languages,
                                description: dbModel.description,
                                type: dbModel.type,
                                subtype: dbModel.subtype
                            };
                            mainRecord = { ...mainRecord, ...dbData, _isEnriched: true };
                        }
                    } catch (enrichError) {
                        console.error("Error en enriquecimiento:", enrichError);
                    }
                }

                setRecord(mainRecord);

            } catch (err) {
                console.error(err);
                setError("Error procesando los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sourceConfig, filterField, filterValue, versionColumn, targetVersion, enableEnrichment, enrichmentKey, enrichmentType, enrichmentSubtype, columnAliases]);

    // ==========================================
    // RENDERIZADO DE LA TABLA
    // ==========================================
    const renderIcon = (iconName) => {
        switch (iconName) {
            case 'linkedin': return <Linkedin size={16} className="inline mr-1 text-blue-600" />;
            case 'mail': return <Mail size={16} className="inline mr-1 text-gray-600" />;
            case 'globe': return <Globe size={16} className="inline mr-1 text-gray-600" />;
            default: return <LinkIcon size={16} className="inline mr-1 text-gray-600" />;
        }
    };

    const renderCellValue = (cell) => {
        if (!record) return null;

        const value = record[cell.field];
        if (value === undefined || value === null || value === "") return <span className="text-gray-400 italic">N/D</span>;

        switch (cell.type) {
            case 'badge':
                // Extraemos prefix y suffix si existen en el JSON (si no, quedan vacíos)
                const prefix = cell.prefix || "";
                const suffix = cell.suffix || "";

                return (
                    <span
                        className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-sm font-bold border border-gray-300 shadow-sm whitespace-nowrap"
                        style={cell.badgeColor ? { backgroundColor: cell.badgeColor, color: '#fff', borderColor: cell.badgeColor } : {}}
                    >
                        {prefix}{value}{suffix}
                    </span>
                );
            case 'link':
                const url = record[cell.urlField];
                return (
                    <a href={url || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center transition-colors">
                        {value} {cell.icon && renderIcon(cell.icon)}
                    </a>
                );

            case 'email':
                return (
                    <a href={`mailto:${value}`} className="text-gray-700 hover:text-blue-600 hover:underline inline-flex items-center transition-colors">
                        {cell.icon && renderIcon(cell.icon)} {value}
                    </a>
                );

            default: // text
                return <span className="text-gray-700">{value}</span>;
        }
    };

    if (loading) return <Container><Skeleton variant="rectangular" height={300} className="rounded-xl" /></Container>;
    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
    if (!record) return null;

    return (
        <Container maxWidth="md" className="px-[0!important]">
            <Box className="overflow-hidden rounded-xl border bg-white shadow-sm" sx={{ borderColor }}>
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {layout.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor }}>
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        colSpan={cell.colSpan || 1}
                                        className={`p-2 align-middle ${cellIndex > 0 ? 'border-l' : ''}`}
                                        style={{ borderColor }}
                                    >
                                        <Box className="flex items-center flex-wrap gap-1">
                                            {cell.label && (
                                                <Typography component="strong" fontWeight={700} sx={{ color: labelColor }}>
                                                    {cell.label}
                                                </Typography>
                                            )}
                                            {renderCellValue(cell)}
                                        </Box>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Container>
    );
};

export default DataSummaryTable;