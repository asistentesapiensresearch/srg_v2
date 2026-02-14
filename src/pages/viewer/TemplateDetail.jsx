import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Chip,
    Button,
    Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useResearchs } from '@src/pages/admin/Research/hooks/useResearchs';
import PageRenderer from '@src/pages/admin/components/builder/Renderer';
import { Preloader } from '@src/components/preloader';
import { useInstitutions } from '../admin/Intitutions/hooks/useInstitutions';

const TemplateDetail = () => {
    const navigate = useNavigate();

    const params = useParams();
    const fullPath = params["*"];

    const { researchs, loading: loadingResearch, getTemplate: fetchTemplateResearch } = useResearchs();
    const { institutions, loading: loadingInstitution, getTemplate: fetchTemplateInstitution } = useInstitutions();

    const [data, setData] = useState(null);
    const [dataType, setDataType] = useState(null);
    const [error, setError] = useState(null);

    const [templateSections, setTemplateSections] = useState([]);
    const [templateLoading, setTemplateLoading] = useState(false);

    /* ================= 1. BUSCAR PATH COMPLETO ================= */
    useEffect(() => {
        if (loadingResearch || loadingInstitution) return;
        if (!fullPath) return;

        // Limpiamos el path por si acaso (quitamos slashes al inicio o final si la DB no los tiene)
        // Esto asegura que "colegios/mi-colegio" coincida con "colegios/mi-colegio"
        const cleanPath = fullPath.replace(/^\/+|\/+$/g, '');

        console.log("🔍 Buscando Path Completo:", cleanPath);

        // 1. Buscar en Research
        const foundResearch = researchs.find(r => {
            // Normalizamos también el path de la DB para asegurar coincidencia
            const dbPath = (r.path || '').replace(/^\/+|\/+$/g, '');
            return dbPath === cleanPath;
        });

        if (foundResearch) {
            setData(foundResearch);
            setDataType('research');
            setError(null);
            return;
        }

        // 2. Buscar en Institutions
        const foundInstitution = institutions.find(i => {
            const dbPath = (i.path || '').replace(/^\/+|\/+$/g, '');
            return dbPath === cleanPath;
        });

        if (foundInstitution) {
            setData(foundInstitution);
            setDataType('institution');
            setError(null);
            return;
        }

        // 3. No encontrado
        setData(null);
        setDataType(null);
        setError('Página no encontrada');

    }, [fullPath, researchs, institutions, loadingResearch, loadingInstitution]);


    /* ================= 2. CARGAR TEMPLATE ================= */
    useEffect(() => {
        let isMounted = true;

        const loadTemplate = async () => {
            if (!data?.id || !dataType) {
                setTemplateSections([]);
                return;
            }

            setTemplateLoading(true);

            try {
                let template = null;

                if (dataType === 'research') {
                    template = await fetchTemplateResearch(data.id);
                } else if (dataType === 'institution') {
                    template = await fetchTemplateInstitution(data.id);
                }

                if (!template?.themeSettings) {
                    if (isMounted) setTemplateSections([]);
                    return;
                }

                const parsed = JSON.parse(template.themeSettings);

                if (isMounted) {
                    setTemplateSections(Array.isArray(parsed) ? parsed : []);
                }
            } catch (e) {
                console.error('Error loading template', e);
                if (isMounted) setTemplateSections([]);
            } finally {
                if (isMounted) setTemplateLoading(false);
            }
        };

        loadTemplate();

        return () => { isMounted = false; };
    }, [data, dataType]);


    /* ================= RENDERIZADO ================= */
    if (loadingInstitution || loadingResearch) {
        return (
            <Box className="flex justify-center items-center min-h-screen">
                <Preloader />
            </Box>
        );
    }

    // 🔴 ERROR 404 REAL
    if (error || !data) {
        return (
            <Container maxWidth="md" className="py-12 flex flex-col items-center text-center">
                <Box className="mb-6 p-4 bg-red-50 rounded-full">
                    <Typography variant="h1" className="text-4xl">🤷‍♂️</Typography>
                </Box>
                <Typography variant="h4" className="font-bold mb-2 text-gray-800">
                    Página no encontrada
                </Typography>
                <Typography variant="body1" className="mb-8 text-gray-600 max-w-lg">
                    No pudimos encontrar contenido para la ruta: <br />
                    <code className="bg-gray-100 p-1 rounded text-sm text-red-600">/{fullPath}</code>
                </Typography>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    variant="contained"
                    size="large"
                >
                    Ir al inicio
                </Button>
            </Container>
        );
    }

    // 🟢 RENDER DE CONTENIDO
    return (
        <Container maxWidth="xl" className="py-8">
            {/* Header */}
            <Box className="md:flex items-center gap-6 mb-4">
                <Box className="flex items-center gap-2">
                    <Typography variant="h4" className="font-bold text-red-700">
                        {data.title || data.name}
                    </Typography>

                    {data.dateRange && (
                        <Chip label={data.dateRange} color="primary" />
                    )}
                    {dataType === 'institution' && (
                        <Chip label={data.type || "Institución"} color="secondary" variant="outlined" />
                    )}
                </Box>
            </Box>

            {/* Template / Builder */}
            {templateLoading && (
                <Box className="flex justify-center my-6">
                    <Preloader />
                </Box>
            )}

            {!templateLoading && templateSections.length > 0 ? (
                // Asegúrate que tu PageRenderer acepte "research" (por legacy) o "data"
                // Si tu componente interno espera 'research', le pasamos 'data' en ese prop
                <PageRenderer sections={templateSections} research={data} />
            ) : (
                !templateLoading && (
                    <Box className="py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
                        <Typography color="text.secondary">
                            Este sitio existe pero aún no tiene diseño configurado.
                        </Typography>
                    </Box>
                )
            )}

            <Box className="mt-6 flex justify-center">
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    variant="outlined"
                >
                    Volver al inicio
                </Button>
            </Box>
        </Container>
    );
};

export default TemplateDetail;