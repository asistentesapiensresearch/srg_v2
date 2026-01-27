import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import {
    Box,
    Container,
    Typography,
    Paper,
    Chip,
    Button,
    Alert,
    Avatar
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useResearchs } from '@src/pages/admin/Research/hooks/useResearchs';
import PageRenderer from '@src/pages/admin/components/builder/Renderer';
import { Preloader } from '@src/components/preloader';

const ResearchDetail = () => {
    const { path } = useParams();
    const navigate = useNavigate();
    const { researchs, loading, getTemplate } = useResearchs();

    const [research, setResearch] = useState(null);
    const [error, setError] = useState(null);

    const [templateSections, setTemplateSections] = useState([]);
    const [templateLoading, setTemplateLoading] = useState(false);

    /* ================= BUSCAR RESEARCH ================= */
    useEffect(() => {
        if (loading) return;

        const found = researchs.find(r => r.path === path);

        if (found) {
            setResearch(found);
            setError(null);
        } else {
            setResearch(null);
            setError('Investigación no encontrada');
        }
    }, [path, researchs, loading]);

    useEffect(() => {
        let isMounted = true;

        const loadTemplate = async () => {
            if (!research?.id) {
                setTemplateSections([]);
                return;
            }

            setTemplateLoading(true);

            try {
                const template = await getTemplate(research.id);

                if (!template?.themeSettings) {
                    setTemplateSections([]);
                    return;
                }

                const parsed = JSON.parse(template.themeSettings);

                if (isMounted) {
                    setTemplateSections(Array.isArray(parsed) ? parsed : []);
                }
            } catch (e) {
                console.error('Error loading/parsing template', e);
                if (isMounted) setTemplateSections([]);
            } finally {
                if (isMounted) setTemplateLoading(false);
            }
        };

        loadTemplate();

        return () => {
            isMounted = false;
        };
    }, [research?.id]);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <Box className="flex justify-center items-center min-h-screen">
                <Preloader />
            </Box>
        );
    }

    /* ================= ERROR ================= */
    if (error || !research) {
        return (
            <Container maxWidth="md" className="py-12">
                <Alert severity="error" className="mb-4">
                    {error || 'Investigación no encontrada'}
                </Alert>
                <Typography variant="body1" className="mb-4 text-gray-600">
                    La página que buscas no existe o ha sido movida.
                </Typography>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    variant="contained"
                >
                    Volver al inicio
                </Button>
            </Container>
        );
    }

    console.log(research)

    /* ================= RENDER ================= */
    return (
        <Container maxWidth="xl" className="py-8">
            {/* ===== HEADER ===== */}
            <Box className="md:flex items-center gap-6 mb-4">
                <Box className="flex items-center gap-2">
                    <Typography variant="h4" className="font-bold text-red-700">
                        {research.title}
                    </Typography>

                    {research.dateRange && (
                        <Chip label={research.dateRange} color="primary" />
                    )}
                </Box>

                <Box className="p-2 px-4 bg-gray-50 rounded-lg mt-2 md:m-0">
                    <Typography variant="caption" className="text-gray-600">
                        Última actualización:{' '}
                        {research.updatedAt
                            ? new Date(research.updatedAt).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })
                            : 'No disponible'}
                    </Typography>
                </Box>
            </Box>

            {/* ===== TEMPLATE ===== */}
            {templateLoading && (
                <Box className="flex justify-center my-6">
                    <Preloader />
                </Box>
            )}
            {!templateLoading && templateSections.length > 0 && (
                <PageRenderer sections={templateSections} research={research} />
            )}

            <Box className="mt-6 flex justify-center">
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    variant="contained"
                    size="large"
                >
                    Volver al inicio
                </Button>
            </Box>
        </Container>
    );
};

export default ResearchDetail;
