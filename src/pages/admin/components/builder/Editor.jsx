import { useState, useEffect, useMemo, memo, lazy, Suspense } from 'react'; // 1. Importar memo, lazy, Suspense
import { Box, Typography, Chip, Button } from '@mui/material';
import { Code } from 'lucide-react';

// Componentes Internos
import Navigation from '@src/components/navigation';
import PageRenderer from './Renderer';

// Hooks
import { useEditor } from '@src/hooks/builder/useEditor';
import { useParams } from 'react-router-dom';
import { TemplateAmplifyRepository } from '@core/infrastructure/repositories/TemplateAmplifyRepository';
import { useResearchs } from '@src/pages/admin/Research/hooks/useResearchs';
import { FindByResearchId, FindByInstitutionId } from '@core/application/caseUses/Template';
import { Preloader } from '@src/components/preloader';

// Modales y Paneles
import AddSections from './AddSections';
import ListSections from './ListSections';
import EditSection from './EditSection';
import { useInstitutions } from '../../Intitutions/hooks/useInstitutions';

// 2. Carga perezosa del ExportTemplate (Mejora carga inicial)
const ExportTemplate = lazy(() => import('./ExportTemplate'));

// 3. Memorización de componentes pesados
// Esto evita que se re-rendericen si sus props (sections) no cambian
const MemoizedPageRenderer = memo(PageRenderer);
const MemoizedListSections = memo(ListSections);
const MemoizedEditSection = memo(EditSection);
const MemoizedAddSections = memo(AddSections);

// Función pura fuera del componente (no causa re-renders)
const findNodeById = (nodes, id) => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children && node.children.length > 0) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function Builder() {

    const { id: dataID, type } = useParams();
    const { researchs, institutions, loading } = (type == 'research' ? useResearchs() : useInstitutions());
    // useMemo para evitar instanciar el repositorio en cada render (micro-optimización)
    const templateRepository = useMemo(() => new TemplateAmplifyRepository(), []);

    const {
        openSections,
        sections,
        selectedSectionId,
        setSections,
        setOpenSections,
        setSelectedSectionId
    } = useEditor();

    const [targetParentId, setTargetParentId] = useState(null);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
    const [currentData, setCurrentData] = useState(null);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // ========== CARGAR INVESTIGACIÓN Y TEMPLATE ==========
    useEffect(() => {
        const loadDataAndTemplate = async () => {
            if (!dataID || loading) return;

            setIsLoadingTemplate(true);
            try {
                const data = (type == 'research' ? researchs : institutions).find(r => r.id === dataID);

                if (!data) {
                    setIsLoadingTemplate(false);
                    return;
                }

                setCurrentData(data);

                const templateCommand = new (type == 'research' ? FindByResearchId : FindByInstitutionId)(templateRepository);
                const template = await templateCommand.execute(dataID);

                if (template) {
                    setCurrentTemplate(template);
                    try {
                        const savedSections = JSON.parse(template.themeSettings);
                        if (Array.isArray(savedSections)) {
                            setSections(savedSections);
                        } else {
                            console.warn('⚠️ El template no es un array válido');
                        }
                    } catch (parseError) {
                        console.error('❌ Error al parsear el template:', parseError);
                    }
                } else {
                    setCurrentTemplate(null);
                }
            } catch (error) {
                console.error('❌ Error al cargar:', error);
            } finally {
                setIsLoadingTemplate(false);
            }
        };

        loadDataAndTemplate();
    }, [dataID, researchs, institutions, loading, setSections, templateRepository]); // Dependencias correctas

    // Mostrar loader
    if (loading || isLoadingTemplate) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
                <Preloader />
                <Typography>Cargando editor...</Typography>
            </Box>
        );
    }

    if (!currentData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" color="error">❌ Investigación no encontrada</Typography>
                <Typography variant="body2" color="text.secondary">ID: {dataID}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>

            <Navigation />

            {/* Barra de información */}
            <Box sx={{
                p: 2,
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        📝 Editando: {currentData.title}
                    </Typography>
                    <Chip
                        label={currentTemplate ? '✅ Template existente' : '🆕 Nuevo template'}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Code size={16} />}
                    onClick={() => setIsExportModalOpen(true)}
                    sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                        boxShadow: 'none'
                    }}
                >
                    Exportar Template
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>

                {/* 4. USAR LOS COMPONENTES MEMORIZADOS */}
                <MemoizedListSections
                    dataID={dataID}
                    sections={sections}
                    setSections={setSections}
                    findNodeById={findNodeById}
                    selectedSectionId={selectedSectionId}
                    setSelectedSectionId={setSelectedSectionId}
                    targetParentId={targetParentId}
                    setTargetParentId={setTargetParentId}
                    setOpenSections={setOpenSections}
                    currentTemplate={currentTemplate}
                    setCurrentTemplate={setCurrentTemplate}
                />

                {/* CANVAS CENTRAL (El más pesado) */}
                <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', p: 4, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', maxWidth: '1200px', bgcolor: 'white', minHeight: '80vh', boxShadow: 3, borderRadius: 1 }}>
                        <MemoizedPageRenderer sections={sections} />
                    </Box>
                </Box>

                {/* SIDEBAR DERECHO */}
                <MemoizedEditSection
                    sections={sections}
                    setSections={setSections}
                    findNodeById={findNodeById}
                    selectedSectionId={selectedSectionId}
                    setSelectedSectionId={setSelectedSectionId}
                />

            </Box>

            {/* DRAWER INFERIOR */}
            <MemoizedAddSections
                setSections={setSections}
                openSections={openSections}
                setOpenSections={setOpenSections}
                targetParentId={targetParentId}
                setTargetParentId={setTargetParentId}
                setSelectedSectionId={setSelectedSectionId}
            />

            {/* 5. SUSPENSE PARA CARGA PEREZOSA DEL MODAL */}
            {isExportModalOpen && (
                <Suspense fallback={null}>
                    <ExportTemplate
                        sections={sections}
                        openExport={isExportModalOpen}
                        setOpenExport={setIsExportModalOpen}
                    />
                </Suspense>
            )}

        </Box>
    );
}