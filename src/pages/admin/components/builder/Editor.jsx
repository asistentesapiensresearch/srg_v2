// src/components/builder/Editor.jsx
import { useState, useEffect } from 'react';
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
import { FindByResearchId } from '@core/application/caseUses/Template';
import { Preloader } from '@src/components/preloader';

// Modales y Paneles
import AddSections from './AddSections';
import ListSections from './ListSections';
import EditSection from './EditSection';
import ExportModal from './ExportTemplate'; // <-- 1. Importamos el nuevo modal

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

    const { researchs, loading: loadingResearchs } = useResearchs();
    const { id: researchId } = useParams();
    const templateRepository = new TemplateAmplifyRepository();

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
    const [currentResearch, setCurrentResearch] = useState(null);
    const [currentTemplate, setCurrentTemplate] = useState(null);

    // 2. NUEVO ESTADO PARA EL MODAL DE EXPORTACIÓN
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // ========== CARGAR INVESTIGACIÓN Y TEMPLATE ==========
    useEffect(() => {
        const loadResearchAndTemplate = async () => {
            if (!researchId || loadingResearchs) return;

            setIsLoadingTemplate(true);
            try {
                // 1. Buscar la investigación
                const research = researchs.find(r => r.id === researchId);

                if (!research) {
                    setIsLoadingTemplate(false);
                    return;
                }

                setCurrentResearch(research);

                // 2. Buscar el template asociado
                const templateCommand = new FindByResearchId(templateRepository);
                const template = await templateCommand.execute(researchId);

                if (template) {
                    setCurrentTemplate(template);

                    // 3. Parsear y cargar las secciones
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
                    console.log('ℹ️ Esta investigación no tiene template aún');
                    setCurrentTemplate(null);
                }
            } catch (error) {
                console.error('❌ Error al cargar:', error);
            } finally {
                setIsLoadingTemplate(false);
            }
        };

        loadResearchAndTemplate();
    }, [researchId, researchs, loadingResearchs]);

    // Mostrar loader
    if (loadingResearchs || isLoadingTemplate) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <Preloader />
                <Typography>Cargando editor...</Typography>
            </Box>
        );
    }

    // Validar investigación
    if (!currentResearch) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography variant="h6" color="error">
                    ❌ Investigación no encontrada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ID: {researchId}
                </Typography>
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
                        📝 Editando: {currentResearch.title}
                    </Typography>
                    <Chip
                        label={currentTemplate ? '✅ Template existente' : '🆕 Nuevo template'}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                </Box>

                {/* 3. BOTÓN PARA ABRIR EL MODAL DE EXPORTACIÓN */}
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

                {/* SIDEBAR IZQUIERDO */}
                <ListSections
                    researchId={researchId}
                    sections={sections}
                    setSections={setSections}
                    findNodeById={findNodeById}
                    selectedSectionId={selectedSectionId}
                    setSelectedSectionId={setSelectedSectionId}
                    targetParentId={targetParentId}
                    setTargetParentId={setTargetParentId}
                    setOpenSections={setOpenSections}
                    currentTemplate={currentTemplate} />

                {/* CANVAS CENTRAL */}
                <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', p: 4, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', maxWidth: '1200px', bgcolor: 'white', minHeight: '80vh', boxShadow: 3, borderRadius: 1 }}>
                        <PageRenderer sections={sections} />
                    </Box>
                </Box>

                {/* SIDEBAR DERECHO */}
                <EditSection
                    sections={sections}
                    setSections={setSections}
                    findNodeById={findNodeById}
                    selectedSectionId={selectedSectionId}
                    setSelectedSectionId={setSelectedSectionId} />

            </Box>

            {/* DRAWER INFERIOR */}
            <AddSections
                setSections={setSections}
                openSections={openSections}
                setOpenSections={setOpenSections}
                targetParentId={targetParentId}
                setTargetParentId={setTargetParentId}
                setSelectedSectionId={setSelectedSectionId} />

            {/* 4. MODAL DE EXPORTACIÓN */}
            <ExportModal
                open={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                value={sections}
            />

        </Box>
    );
}