import { useNavigate, useSearchParams } from "react-router-dom";
import Hero from "./components/Hero";
import MainRankings from "./components/MainRankings";
import AcademicOffer from "./components/AcademicOffer";
import ScientificEcosystem from "./components/ScientificEcosystem";
import { useResearchs } from "@src/pages/admin/Research/hooks/useResearchs";
import Footer from "./components/Footer";
import { Box, Skeleton } from "@mui/material";
import { useMemo } from "react";
import { useArticle } from "@src/pages/admin/Articles/hooks/useArticle";

const Home = () => {
    const { loading, researchs } = useResearchs();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { articles, loading: loadingArticles } = useArticle();

    // ==================== LÓGICA DE ORGANIZACIÓN (JERARQUÍA) ====================
    const organizedData = useMemo(() => {
        if (!researchs.length) return { rankings: [], indicators: [], groups: [] };

        // 1. Separamos por categorías base
        const mainRankings = researchs.filter(r => r.category === 'Ranking General');
        const specificIndicators = researchs.filter(r => r.category !== 'Ranking General');

        // 2. CREAMOS LA JERARQUÍA: Atamos indicadores a sus padres
        const rankingsWithIndicators = mainRankings.map(parent => ({
            ...parent,
            // Buscamos qué indicadores tienen el parentId de este ranking
            indicators: specificIndicators.filter(ind => ind.parentId === parent.id)
        }));

        // 3. Identificamos indicadores "huérfanos" (por si acaso no tienen parentId)
        const orphanIndicators = researchs.filter(ind => !ind.parentId);

        return {
            rankings: rankingsWithIndicators,
            allIndicators: specificIndicators,
            orphans: orphanIndicators
        };
    }, [researchs]);

    // Handler para búsqueda
    const handleSearch = (searchValue) => {
        if (!searchValue.trim()) return;
        const params = new URLSearchParams(searchParams);
        params.set("search", searchValue);
        navigate(`?${params.toString()}`, { replace: true });

        setTimeout(() => {
            const researchSection = document.getElementById("research-section");
            if (researchSection) {
                researchSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <>
            <main className="max-w-6xl mx-auto px-4 pt-30 space-y-12">
                {
                    loading ? (
                        <HomeSkeleton />
                    ) : (
                        <>
                            <Hero onSearch={handleSearch} />

                            {/* Pasamos los Rankings ya con sus indicadores inyectados */}
                            <MainRankings
                                id="research-section"
                                rankings={organizedData.rankings}
                            />

                            <ScientificEcosystem articles={articles} />
                            <AcademicOffer />
                        </>
                    )
                }
            </main>
            <Footer />
        </>
    );
}

// Componente auxiliar para mantener el código limpio
const HomeSkeleton = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box className="grid md:grid-cols-2 gap-4">
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
        </Box>
        <Box className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            ))}
        </Box>
    </Box>
);

export default Home;