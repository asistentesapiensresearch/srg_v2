import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResearchs } from "@src/hooks/useResearchs";
import { useSections } from "@src/pages/admin/Section/hooks/useSections";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    Box,
    Typography,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { StorageImage } from "@aws-amplify/ui-react-storage";

export const ResearchSection = () => {
    const navigate = useNavigate();
    const { researchs } = useResearchs();
    const { sections } = useSections();
    const [searchParams, setSearchParams] = useSearchParams();

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedDateRange, setSelectedDateRange] = useState("");

    // Sincronizar filtros con URL al cargar o cambiar parámetros
    useEffect(() => {
        const sectionParam = searchParams.get("section");
        const dateRangeParam = searchParams.get("dateRange");
        const searchParam = searchParams.get("search");

        // Si hay un parámetro de sección en la URL
        if (sectionParam) {
            // Buscar la sección por nombre
            const section = sections.find(
                (s) => s.name.toLowerCase() === sectionParam.toLowerCase()
            );
            if (section) {
                setSelectedSection(section.id);
            }
        } else {
            setSelectedSection("");
        }

        // Si hay un parámetro de rango de fechas
        if (dateRangeParam) {
            setSelectedDateRange(dateRangeParam);
        } else {
            setSelectedDateRange("");
        }

        // Si hay un parámetro de búsqueda
        if (searchParam) {
            setSearchTerm(searchParam);
        } else {
            setSearchTerm("");
        }
    }, [searchParams, sections]);

    // Actualizar URL cuando cambien los filtros
    const updateURLParams = (key, value) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        setSearchParams(params);
    };

    // Obtener rangos de fechas únicos
    const dateRanges = useMemo(() => {
        const ranges = researchs
            .map((r) => r.dateRange)
            .filter(Boolean);
        return [...new Set(ranges)];
    }, [researchs]);

    // Filtrar investigaciones
    const filteredResearchs = useMemo(() => {
        return researchs.filter((research) => {
            // Filtro por búsqueda (título o descripción)
            const matchesSearch =
                research.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                research.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro por sección
            const matchesSection =
                !selectedSection || research.sectionId === selectedSection;

            // Filtro por rango de fechas
            const matchesDateRange =
                !selectedDateRange || research.dateRange === selectedDateRange;

            return matchesSearch && matchesSection && matchesDateRange;
        });
    }, [researchs, searchTerm, selectedSection, selectedDateRange]);

    // Handlers con actualización de URL
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        updateURLParams("search", value);
    };

    const handleSectionChange = (sectionId) => {
        setSelectedSection(sectionId);
        const section = sections.find((s) => s.id === sectionId);
        updateURLParams("section", section ? section.name : "");
    };

    const handleDateRangeChange = (dateRange) => {
        setSelectedDateRange(dateRange);
        updateURLParams("dateRange", dateRange);
    };

    // Handler para redirigir al detalle de la investigación
    const handleResearchClick = (research) => {
        navigate(`/${research.path}`);
    };

    if (researchs.length === 0) {
        return (
            <Box className="flex justify-center items-center p-8 max-w-[1200px] mx-auto my-8">
                <Typography variant="h6" color="text.secondary">
                    No hay investigaciones disponibles
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="max-w-[1200px] mx-auto my-8 px-4">
            {/* Título */}
            <Typography variant="h4" className="font-bold mb-6">
                Investigaciones
            </Typography>

            {/* Filtros */}
            <Paper className="p-4 mb-4 shadow-md">
                <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda */}
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Buscar por título o descripción..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Filtro por Sección */}
                    <TextField
                        select
                        label="Sección"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={selectedSection}
                        onChange={(e) => handleSectionChange(e.target.value)}
                    >
                        <MenuItem value="">Todas las secciones</MenuItem>
                        {sections.map((section) => (
                            <MenuItem key={section.id} value={section.id}>
                                {section.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Filtro por Rango de Fechas */}
                    <TextField
                        select
                        label="Período"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={selectedDateRange}
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                    >
                        <MenuItem value="">Todos los períodos</MenuItem>
                        {dateRanges.map((range) => (
                            <MenuItem key={range} value={range}>
                                {range}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* Contador de resultados */}
                <Box className="mt-3">
                    <Typography variant="body2" color="text.secondary">
                        Mostrando {filteredResearchs.length} de {researchs.length} investigaciones
                    </Typography>
                </Box>
            </Paper>

            {/* Tabla */}
            <TableContainer component={Paper} className="shadow-lg">
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow className="bg-gray-100">
                            <TableCell className="font-bold">Ícono</TableCell>
                            <TableCell className="font-bold">Título</TableCell>
                            <TableCell className="font-bold">Descripción</TableCell>
                            <TableCell className="font-bold">Rango de fechas</TableCell>
                            <TableCell className="font-bold">Sección</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredResearchs.length > 0 ? (
                            filteredResearchs
                                .sort((a, b) => a.index - b.index)
                                .map((research) => (
                                    <TableRow
                                        key={research.id}
                                        onClick={() => handleResearchClick(research)}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            "&:hover": { backgroundColor: "#f9fafb" }
                                        }}
                                    >
                                        {/* ÍCONO */}
                                        <TableCell>
                                            {research.icon ? (
                                                <Avatar aria-label="recipe" className="w-[50px!important] h-[50px!important] p-1">
                                                    <StorageImage alt={research.title} path={research.icon} />
                                                </Avatar>
                                            ) : (
                                                <Avatar variant="rounded" className="bg-gray-300">
                                                    ?
                                                </Avatar>
                                            )}
                                        </TableCell>

                                        {/* TÍTULO */}
                                        <TableCell>
                                            <Typography variant="body1" className="font-semibold text-gray-800 hover:text-red-600 transition-colors">
                                                {research.title}
                                            </Typography>
                                            <Typography variant="caption" className="text-gray-500">
                                                /{research.path}
                                            </Typography>
                                        </TableCell>

                                        {/* DESCRIPCIÓN CORTA */}
                                        <TableCell>
                                            {research.shortDescription ? (
                                                <div
                                                    className="text-sm text-gray-700 line-clamp-3 max-w-md"
                                                    dangerouslySetInnerHTML={{
                                                        __html: research.shortDescription,
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    Sin descripción
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* RANGO DE FECHAS */}
                                        <TableCell>
                                            {research.dateRange ? (
                                                <Chip
                                                    label={research.dateRange}
                                                    size="small"
                                                    className="bg-blue-100 text-blue-800"
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    -
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* SECCIÓN */}
                                        <TableCell>
                                            <Typography variant="body2" className="text-gray-600">
                                                {sections.find((s) => s.id === research.sectionId)
                                                    ?.name || "Sin sección"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className="py-8">
                                    <Typography variant="body1" color="text.secondary">
                                        No se encontraron investigaciones con los filtros aplicados
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};