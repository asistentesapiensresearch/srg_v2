import { useNavigate, useSearchParams } from "react-router-dom";
import Hero from "./components/Hero";
import MainRankings from "./components/MainRankings";
import AcademicOffer from "./components/AcademicOffer";
import SecondarySections from "./components/SecondarySections";
import ScientificEcosystem from "./components/ScientificEcosystem";
import { useResearchs } from "@src/pages/admin/Research/hooks/useResearchs";
import Footer from "./components/Footer";
import { Box, Skeleton } from "@mui/material";

const Home = () => {
    const { loading, researchs } = useResearchs();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const groupedData = researchs.reduce((acc, item) => {
        // Definimos nombres por defecto en caso de que sean null
        const category = item.category || "Sin Categoría";
        const subCategory = item.subCategory || "General";

        // Si la categoría no existe en el acumulador, la creamos
        if (!acc[category]) {
            acc[category] = {};
        }

        // Si la subcategoría no existe dentro de esa categoría, la creamos
        if (!acc[category][subCategory]) {
            acc[category][subCategory] = [];
        }

        // Agregamos el objeto al grupo correspondiente
        acc[category][subCategory].push(item);

        return acc;
    }, {});

    // Handler para búsqueda
    const handleSearch = (searchValue) => {
        if (!searchValue.trim()) return;

        const params = new URLSearchParams(searchParams);
        params.set("search", searchValue);

        navigate(`?${params.toString()}`, { replace: true });

        // Scroll a la sección de investigaciones
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
                    loading ? <>
                        <Box className="grid md:grid-cols-2 gap-2 m-0">
                            <Skeleton className="min-h-100"></Skeleton>
                            <Skeleton className="min-h-100"></Skeleton>
                        </Box>
                        <Box className="grid md:grid-cols-2 gap-2 m-0">
                            <div className="grid md:grid-cols-2 gap-2 m-0">
                                <Skeleton ></Skeleton>
                                <Skeleton ></Skeleton>
                                <Skeleton ></Skeleton>
                                <Skeleton ></Skeleton>
                                <Skeleton ></Skeleton>
                                <Skeleton ></Skeleton>
                            </div>
                            <Skeleton></Skeleton>
                        </Box>
                    </> : <>
                        <Hero />
                        <MainRankings rankings={groupedData['Ranking General']} />
                        <SecondarySections indicators={researchs.filter(r => r.category == 'Indicadores Específicos')} />
                        <ScientificEcosystem />
                        <AcademicOffer />
                    </>
                }
            </main>
            <Footer />
        </>
    );
}

export default Home;