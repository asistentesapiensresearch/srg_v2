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
import { Preloader } from '@src/components/Preloader';

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

    /* ================= RENDER ================= */
    return (
        <Container maxWidth="xl" className="py-8">
            {/* ===== HEADER ===== */}
            <Box>
                <Box className="md:flex items-center gap-6 mb-4">
                    <Typography variant="h4" className="font-bold text-red-700">
                        {research.title}
                    </Typography>

                    <Box className="p-2 px-4 bg-gray-50 rounded-lg mt-2 md:m-0">
                        <Typography variant="caption" className="text-gray-600">
                            Última actualización:{' '}
                            {research.updatedAt
                                ? new Date(research.updatedAt).toLocaleDateString('es-ES')
                                : 'No disponible'}
                        </Typography>
                    </Box>
                </Box>

                <Box className="mb-4">
                    {research.alert && research.alert !== '<p></p>' && (
                        <Alert severity="warning">
                            <div dangerouslySetInnerHTML={{ __html: research.alert }} />
                        </Alert>
                    )}
                </Box>

                <Box className="flex items-start gap-6 mb-6">
                    <div className="text-center">
                        {research.icon && (
                            <Avatar sx={{ width: 100, height: 100 }} className="mb-3">
                                <StorageImage
                                    alt={research.title}
                                    path={research.icon}
                                    className="w-full h-full object-contain"
                                />
                            </Avatar>
                        )}

                        {research.dateRange && (
                            <Chip label={research.dateRange} color="primary" />
                        )}
                    </div>

                    <Box>
                        {research.description && research.description !== '<p></p>' && (
                            <Box className="mt-4">
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: research.description }}
                                />
                            </Box>
                        )}
                        {/* ===== LOGOS ===== */}
                        {Array.isArray(research.logosResearch) && research.logosResearch.length > 0 && (
                            <Box className="flex flex-wrap gap-4 mt-4">
                                {research.logosResearch.map((logoResearch, idx) => (
                                    <Link to={logoResearch.logo.link} key={idx} target='blank'>
                                        <StorageImage
                                            alt="Logo"
                                            path={logoResearch.logo.key}
                                            className="w-full h-full object-contain"
                                        />
                                    </Link>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* ===== TEMPLATE ===== */}
            {templateLoading && (
                <Box className="flex justify-center my-6">
                    <Preloader />
                </Box>
            )}
            {!templateLoading && templateSections.length > 0 && (
                <Paper elevation={3} className="mb-6">
                    <PageRenderer sections={templateSections} research={research} />
                </Paper>
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
