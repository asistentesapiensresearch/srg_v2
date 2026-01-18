import { useNavigate, useSearchParams } from "react-router-dom";
import { useSections } from "@src/pages/admin/Sections/hooks/useSections";
import Hero from "./components/Hero";
import MainRankings from "./components/MainRankings";
import AcademicOffer from "./components/AcademicOffer";
import SecondarySections from "./components/SecondarySections";
import ScientificEcosystem from "./components/ScientificEcosystem";

const Home = () => {
    const { sections } = useSections();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Handler para filtrar por sección
    const handleSectionClick = (sectionName = null) => {
        const params = new URLSearchParams(searchParams);

        if (sectionName) {
            // Si hay sección, la establecemos
            params.set("section", sectionName);
        } else {
            // Si no hay sección (TODOS), removemos el filtro
            params.delete("section");
        }

        // Actualizar la URL y hacer scroll a la sección de investigaciones
        const queryString = params.toString();
        navigate(queryString ? `?${queryString}` : '', { replace: true });

        // Scroll suave hacia la sección de investigaciones
        setTimeout(() => {
            const researchSection = document.getElementById("research-section");
            if (researchSection) {
                researchSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

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
                <MainRankings />
                <SecondarySections />
                <ScientificEcosystem />
                <AcademicOffer />
            </main>
        </>
    );
}

export default Home;