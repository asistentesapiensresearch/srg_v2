import { useNavigate, useSearchParams } from "react-router-dom";
import { useSections } from "@src/pages/admin/Sections/hooks/useSections";
import Hero from "./components/Hero";
import MainRankings from "./components/MainRankings";
import AcademicOffer from "./components/AcademicOffer";
import SecondarySections from "./components/SecondarySections";
import ScientificEcosystem from "./components/ScientificEcosystem";
import { useResearchs } from "@src/hooks/useResearchs";

const Home = () => {
    const { sections } = useSections();
    const { researchs } = useResearchs();
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
            <main className="max-w-6xl mx-auto px-4 py-30 space-y-12">
                <Hero />
                <MainRankings rankings={groupedData['Ranking General']} />
                <SecondarySections indicators={researchs.filter(r => r.category == 'Indicadores Específicos')} />
                <ScientificEcosystem />
                <AcademicOffer />
            </main>
        </>
    );
}

export default Home;