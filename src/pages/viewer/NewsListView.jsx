import { useState, useMemo } from "react";
import {
    Box, Typography, Grid, TextField, MenuItem,
    Select, FormControl, InputLabel, Pagination,
    InputAdornment, Card
} from "@mui/material";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { useArticle } from "@src/pages/admin/Articles/hooks/useArticle";
import EcosystemCard from "@src/pages/viewer/home/components/EcosystemCard";
import { Preloader } from "@src/components/preloader";

export default function NewsListView() {
    const { articles, loading } = useArticle();

    // ESTADOS DE FILTRADO
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sortOrder, setSortOrder] = useState("desc"); // desc = más reciente

    // ESTADOS DE PAGINACIÓN
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // LÓGICA DE PROCESAMIENTO DE DATOS
    const processedArticles = useMemo(() => {
        let filtered = articles.filter(a => a.isPublished);

        // 1. Filtro de Búsqueda (Título o Resumen)
        if (search) {
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.summary?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 2. Filtro de Categoría
        if (category !== "all") {
            filtered = filtered.filter(a => a.category === category);
        }

        // 3. Ordenamiento por Fecha (publishedAt)
        filtered.sort((a, b) => {
            const dateA = new Date(a.publishedAt || 0).getTime();
            const dateB = new Date(b.publishedAt || 0).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [articles, search, category, sortOrder]);

    // Cálculo de Paginación
    const totalPages = Math.ceil(processedArticles.length / pageSize);
    const paginatedArticles = processedArticles.slice((page - 1) * pageSize, page * pageSize);

    // Extraer categorías únicas para el filtro
    const categories = useMemo(() => {
        const cats = articles.map(a => a.category).filter(Boolean);
        return ["all", ...new Set(cats)];
    }, [articles]);

    if (loading) return <Preloader />;

    return (
        <main className="max-w-7xl mx-auto p-4 mt-10">
            {/* CABECERA Y BUSCADOR */}
            <Box className="mb-12 space-y-6">
                <Typography variant="h3" fontWeight="bold" className="text-gray-900">
                    Noticias y Actualidad
                </Typography>

                <Card className="p-4 shadow-sm border-gray-100 flex flex-wrap gap-4 items-center">
                    <TextField
                        placeholder="Buscar noticias..."
                        variant="outlined"
                        size="small"
                        sx={{ flex: 1, minWidth: '300px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={20} className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Categoría</InputLabel>
                        <Select value={category} label="Categoría" onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>
                                    {cat === 'all' ? 'Todas' : cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Ordenar por</InputLabel>
                        <Select
                            value={sortOrder}
                            label="Ordenar por"
                            onChange={(e) => setSortOrder(e.target.value)}
                            startAdornment={<Box sx={{ mr: 1, display: 'flex' }}>{sortOrder === 'desc' ? <SortDesc size={18} /> : <SortAsc size={18} />}</Box>}
                        >
                            <MenuItem value="desc">Más reciente</MenuItem>
                            <MenuItem value="asc">Más antigua</MenuItem>
                        </Select>
                    </FormControl>
                </Card>
            </Box>

            {/* GRILLA DE RESULTADOS */}
            <Grid container spacing={4}>
                {paginatedArticles.map(article => (
                    <Grid key={article.id} size={{ xs: 12, md: 4, lg: 3 }}>
                        <EcosystemCard article={article} />
                    </Grid>
                ))}
            </Grid>

            {/* CONTROL DE PAGINACIÓN */}
            <Box className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-8">
                <Box className="flex items-center gap-3">
                    <Typography variant="body2" className="text-gray-500">Mostrar:</Typography>
                    <Select
                        size="small"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(e.target.value);
                            setPage(1); // Resetear a la primera página
                        }}
                    >
                        <MenuItem value={10}>10 por página</MenuItem>
                        <MenuItem value={50}>50 por página</MenuItem>
                        <MenuItem value={100}>100 por página</MenuItem>
                    </Select>
                    <Typography variant="body2" className="text-gray-500">
                        de {processedArticles.length} resultados
                    </Typography>
                </Box>

                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                    color="primary"
                    shape="rounded"
                />
            </Box>
        </main>
    );
}