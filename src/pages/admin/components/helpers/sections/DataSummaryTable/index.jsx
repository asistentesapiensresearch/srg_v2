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
    labelColor = "#1f2937",
    title = "Ficha Técnica", 
}) => {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const columnAliases = useMemo(() => sourceConfig?.columnAliases || {}, [sourceConfig]);
    const layout = useMemo(() => {
        try {
            const parsed = JSON.parse(tableLayout || "[]");
            const blacklist = ['categoria', 'calificacion'];

            const normalizedLayout = Array.isArray(parsed) ? parsed : [];

            return normalizedLayout
                .map(row => Array.isArray(row) ? row.filter(cell => {
                    const field = (cell?.field || "").toString().trim().toLowerCase();
                    return field && !blacklist.includes(field);
                }) : [])
                .filter(row => row.length > 0);
        } catch (e) {
            return [];
        }
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
            case 'linkedin': return <Linkedin size={16} className="inline mr-1 text-white" />;
            case 'mail': return <Mail size={16} className="inline mr-1 text-gray-600" />;
            case 'globe': return <Globe size={16} className="inline mr-1 text-gray-600" />;
            default: return <LinkIcon size={16} className="inline mr-1 text-gray-600" />;
        }
    };

    const renderCellValue = (cell) => {
        if (!record) return null;

        const value = record[cell.field];
        if (value === undefined || value === null || value === "") return <span style={{ color: '#9aa0ad', fontStyle: 'italic', fontSize: '14px' }}>N/D</span>;

        switch (cell.type) {
            case 'badge':
                // Extraemos prefix y suffix si existen en el JSON (si no, quedan vacíos)
                const prefix = cell.prefix || "";
                const suffix = cell.suffix || "";

                const badgeStyle = cell.badgeColor
                    ? { backgroundColor: cell.badgeColor, color: '#fff', padding: '0 6px', borderRadius: '4px' }
                    : { color: '#c0392b' };

                return (
                   <span style={{ fontSize: '14px', fontWeight: 700, ...badgeStyle }}>
                        {prefix}{value}{suffix}
                    </span>
                );
            case 'link':
                const url = record[cell.urlField];
                const isRectorLink = cell.field === 'rectorName' || String(cell.label || '').toLowerCase().includes('rectoría');
                return (
                    <a
                        href={url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={isRectorLink ? 'transition-colors duration-150 hover:text-blue-800 hover:underline' : 'transition-colors duration-150 hover:underline'}
                        style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#2563eb',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        {value}
                        {cell.icon && (
                            <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '5px',
                                    backgroundColor: '#378FE9',
                                    color: '#ffffff',
                                    flexShrink: 0,
                                    marginLeft: '8px',
                                }}>
                                {renderIcon(cell.icon)}
                            </span>
                        )}
                    </a>
                );

            case 'email':
                return (
                    <a href={`mailto:${value}`} style={{ fontSize: '14px', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                        {cell.icon && renderIcon(cell.icon)} {value}
                    </a>
                );

            default: // text
                return <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1f2e' }}>{value}</span>;
        }
    };

    if (loading) return <Container><Skeleton variant="rectangular" height={300} className="rounded-xl" /></Container>;
    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
    if (!record) return null;

    return (
        <Container maxWidth="md" className="px-4" sx={{ mr: 3, mb: 3 }}>
            <Box className="overflow-hidden rounded-xl bg-white shadow-sm flex flex-col" sx={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    padding: '28px 28px 8px 28px',
                    overflow: 'hidden',
                }}>

                {/* Título */}
                <Typography
                    component="h2"
                    sx={{ fontSize: '22px', fontWeight: 700, color: '#1a1f2e', mb: '20px', letterSpacing: '-0.3px' }}
                >
                    {title}
                </Typography>

                {/* Tabla */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {layout.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        colSpan={cell.colSpan || 1}
                                        style={{
                                            padding: '14px 0',
                                            verticalAlign: 'middle',
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                                            {cell.label && (
                                                <span style={{ fontSize: '14px', color: '#9aa0ad', fontWeight: 700 }}>
                                                    {cell.label}
                                                </span>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {renderCellValue(cell)}
                                            </div>
                                        </div>
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