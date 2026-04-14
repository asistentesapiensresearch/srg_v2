import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Chip,
    Button
} from '@mui/material';
import { useResearchs } from '@src/pages/admin/Research/hooks/useResearchs';
import PageRenderer from '@src/pages/admin/components/builder/Renderer';
import { Preloader } from '@src/components/preloader';
import { useInstitutions } from '../admin/Intitutions/hooks/useInstitutions';
import NotFoundPage from './NotFoundPage';
import { ArrowLeft, Home } from 'lucide-react';
import { useArticle } from '../admin/Articles/hooks/useArticle';

const TemplateDetail = () => {
    const navigate = useNavigate();

    const params = useParams();
    const fullPath = params["*"];

    const { researchs, loading: loadingResearch, getTemplate: fetchTemplateResearch } = useResearchs();
    const { institutions, loading: loadingInstitution, getTemplate: fetchTemplateInstitution } = useInstitutions();
    const { articles, loading: loadingArticle, getTemplate: fetchTemplateArticle } = useArticle();

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

        // 3. Buscar en Artículos
        const foundArticle = articles.find(i => {
            const dbSlug = (i.slug || '').replace(/^\/+|\/+$/g, '');
            return dbSlug === cleanPath;
        });

        if (foundArticle) {
            setData(foundArticle);
            setDataType('article');
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
                } else if (dataType === 'article') {
                    template = await fetchTemplateArticle(data.id);
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

    if (error || !data) {
        return <NotFoundPage />;
    }

    // 🟢 RENDER DE CONTENIDO
    return (
        <Container maxWidth={false} disableGutters className="">
            {/* Header */}
            {/* <Box className="md:flex items-center gap-6 mb-4">
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
            </Box> */}

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

            {/* <Box className='mt-3' sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowLeft size={20} />}
                    onClick={() => navigate(-1)}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: '#cbd5e1',
                        color: '#475569',
                        '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' }
                    }}
                >
                    Regresar
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home size={20} />}
                    onClick={() => navigate('/')}
                    disableElevation
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        bgcolor: '#dc2626', // Rojo
                        '&:hover': { bgcolor: '#b91c1c' }
                    }}
                >
                    Ir al Inicio
                </Button>
            </Box> */}
            
        </Container>
    );
};

export default TemplateDetail;