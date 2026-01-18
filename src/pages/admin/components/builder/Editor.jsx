// src/components/builder/Editor.jsx
import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, Button, Typography, IconButton, Grid, Divider, CircularProgress, Chip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { CopyPlusIcon, X as CloseIcon, LayoutTemplate } from 'lucide-react';

// Componentes Internos
import Navigation from '@src/components/navigation';
import { SortableItem } from '@src/components/SortableItem';
import PageRenderer from './Renderer';
import { SECTION_SCHEMAS } from './sectionRegistry';
import { TEMPLATE_REGISTRY } from './templateRegistry';
import { LayerItem } from './LayerItem';
import renderFieldInput from './helpers/renderFieldInput';

// Hooks
import { useEditor } from '@src/hooks/builder/useEditor';
import { useSortableList } from '@src/hooks/useSortableList';
import { useParams } from 'react-router-dom';
import { TemplateAmplifyRepository } from '@core/infrastructure/repositories/TemplateAmplifyRepository';
import { useResearchs } from '@src/hooks/useResearchs';
import { Create, Update, FindByResearchId } from '@core/application/caseUses/Template';

// ==========================================
// HELPERS RECURSIVOS
// ==========================================

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

const addNodeToTree = (nodes, parentId, newNode) => {
    if (!parentId) return [...nodes, newNode];

    return nodes.map(node => {
        if (node.id === parentId) {
            return { ...node, children: [...(node.children || []), newNode] };
        }
        if (node.children) {
            return { ...node, children: addNodeToTree(node.children, parentId, newNode) };
        }
        return node;
    });
};

const deleteNodeFromTree = (nodes, idToDelete) => {
    return nodes
        .filter(node => node.id !== idToDelete)
        .map(node => ({
            ...node,
            children: node.children ? deleteNodeFromTree(node.children, idToDelete) : []
        }));
};

const updateNodeProps = (nodes, id, fieldName, value) => {
    return nodes.map(node => {
        if (node.id === id) {
            return { ...node, props: { ...node.props, [fieldName]: value } };
        }
        if (node.children) {
            return { ...node, children: updateNodeProps(node.children, id, fieldName, value) };
        }
        return node;
    });
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
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
    const [currentResearch, setCurrentResearch] = useState(null);
    const [currentTemplate, setCurrentTemplate] = useState(null);

    const activeSection = findNodeById(sections, selectedSectionId);
    const activeSchema = activeSection ? SECTION_SCHEMAS[activeSection.type] : null;

    const { dndContextProps, sortableContextProps } = useSortableList(
        sections,
        setSections
    );

    // ========== CARGAR INVESTIGACIÓN Y TEMPLATE ==========
    useEffect(() => {
        const loadResearchAndTemplate = async () => {
            if (!researchId || loadingResearchs) return;

            setIsLoadingTemplate(true);
            try {
                // 1. Buscar la investigación
                const research = researchs.find(r => r.id === researchId);
                
                if (!research) {
                    console.error('❌ Investigación no encontrada');
                    console.log('researchId buscado:', researchId);
                    console.log('IDs disponibles:', researchs.map(r => r.id));
                    setIsLoadingTemplate(false);
                    return;
                }

                console.log('✅ Investigación encontrada:', research.title);
                setCurrentResearch(research);

                // 2. Buscar el template asociado
                const templateCommand = new FindByResearchId(templateRepository);
                const template = await templateCommand.execute(researchId);

                if (template) {
                    console.log('✅ Template encontrado:', template);
                    setCurrentTemplate(template);
                    
                    // 3. Parsear y cargar las secciones
                    try {
                        const savedSections = JSON.parse(template.themeSettings);
                        
                        if (Array.isArray(savedSections)) {
                            setSections(savedSections);
                            console.log('✅ Secciones cargadas:', savedSections.length);
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

    // --- ACCIONES ---

    const handleAddSection = (type) => {
        const schema = SECTION_SCHEMAS[type];

        const initialProps = schema.fields.reduce((acc, field) => ({
            ...acc, [field.name]: field.default
        }), {});

        const newSection = {
            id: uuidv4(),
            type: type,
            props: initialProps,
            children: []
        };

        setSections(prev => addNodeToTree(prev, targetParentId, newSection));
        setSelectedSectionId(newSection.id);
        setOpenSections(false);
        setTargetParentId(null);
    };

    const handlePrepareAddChild = (e, parentId) => {
        e.stopPropagation();
        setTargetParentId(parentId);
        setOpenSections(true);
    };

    const handlePrepareAddRoot = () => {
        setTargetParentId(null);
        setOpenSections(true);
    };

    const handleSelectSection = (id) => {
        setSelectedSectionId(id);
    };

    const handleDeleteSection = (e, id) => {
        e.stopPropagation();
        if (window.confirm("¿Eliminar esta sección?")) {
            setSections(prev => deleteNodeFromTree(prev, id));
            if (selectedSectionId === id) setSelectedSectionId(null);
        }
    };

    const handleFieldChange = (field, value) => {
        setSections(prev => updateNodeProps(prev, activeSection.id, field, value));
    };

    const renderLayerTree = (items, depth = 0) => {
        return items.map((sect) => (
            <SortableItem key={sect.id} id={sect.id}>
                <LayerItem
                    section={sect}
                    label={SECTION_SCHEMAS[sect.type]?.label || sect.type}
                    isSelected={selectedSectionId === sect.id}
                    isActive={false}
                    onClick={() => handleSelectSection(sect.id)}
                    onDelete={handleDeleteSection}
                    onAddChild={handlePrepareAddChild}
                    depth={depth}
                >
                    {sect.children?.length > 0 && (
                        <List disablePadding>
                            {renderLayerTree(sect.children, depth + 1)}
                        </List>
                    )}
                </LayerItem>
            </SortableItem>
        ));
    };

    const handleAddTemplate = (templateKey) => {
        const template = TEMPLATE_REGISTRY[templateKey];
        if (!template) return;

        const newSections = template.getSections();
        setSections(prev => [...prev, ...newSections]);
        setOpenSections(false);
    };

    const handleSave = async () => {
        if (!researchId) {
            alert('No se encontró el ID de la investigación');
            return;
        }

        setIsSaving(true);
        try {
            const themeSettings = JSON.stringify(sections);

            if (currentTemplate?.id) {
                // Actualizar template existente
                const updateCommand = new Update(templateRepository);
                await updateCommand.execute(currentTemplate.id, {
                    themeSettings,
                    researchId
                });
                console.log('✅ Template actualizado');
                alert('Template actualizado correctamente');
            } else {
                // Crear nuevo template
                const createCommand = new Create(templateRepository);
                const newTemplate = await createCommand.execute({
                    themeSettings,
                    researchId
                });
                
                setCurrentTemplate(newTemplate);
                console.log('✅ Template creado:', newTemplate);
                alert('Template creado correctamente');
            }
        } catch (error) {
            console.error("❌ Error al guardar:", error);
            alert('Error al guardar el template: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

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
                <CircularProgress size={60} />
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
                <Typography variant="subtitle1" fontWeight="bold">
                    📝 Editando: {currentResearch.title}
                </Typography>
                <Chip 
                    label={currentTemplate ? '✅ Template existente' : '🆕 Nuevo template'}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>

                {/* SIDEBAR IZQUIERDO */}
                <Drawer
                    variant="permanent"
                    sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', position: 'relative' } }}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">CAPAS</Typography>
                            <Button
                                onClick={handlePrepareAddRoot}
                                variant="outlined"
                                size="small"
                                fullWidth
                                startIcon={<CopyPlusIcon size={14} />}
                            >
                                Añadir a raíz
                            </Button>
                        </Box>

                        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                            <DndContext {...dndContextProps}>
                                <SortableContext {...sortableContextProps}>
                                    <List disablePadding>
                                        {renderLayerTree(sections)}
                                    </List>
                                </SortableContext>
                            </DndContext>

                            {sections.length === 0 && (
                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                                    No hay secciones.<br/>Añade una para comenzar.
                                </Typography>
                            )}

                            {sections.length > 0 && (
                                <Button
                                    onClick={handleSave}
                                    variant="contained"
                                    size="small"
                                    fullWidth
                                    disabled={isSaving}
                                    color='primary'
                                    style={{ marginTop: 15 }}
                                >
                                    {isSaving ? 'Guardando...' : '💾 Guardar'}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Drawer>

                {/* CANVAS CENTRAL */}
                <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', p: 4, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', maxWidth: '1200px', bgcolor: 'white', minHeight: '80vh', boxShadow: 3, borderRadius: 1 }}>
                        <PageRenderer sections={sections} />
                    </Box>
                </Box>

                {/* SIDEBAR DERECHO */}
                {activeSection && activeSchema && (
                    <Drawer
                        variant="permanent"
                        sx={{ width: 400, flexShrink: 0, '& .MuiDrawer-paper': { width: 400, boxSizing: 'border-box', position: 'relative' } }}
                    >
                        <Box p={3}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #eee" pb={2}>
                                <Typography variant="h6" fontSize={16} fontWeight="bold">
                                    {activeSchema.label}
                                </Typography>
                                <IconButton size="small" onClick={() => setSelectedSectionId(null)}>
                                    <CloseIcon size={16} />
                                </IconButton>
                            </Box>

                            <Box display="flex" flexDirection="column" gap={2} mt={2}>
                                {activeSchema.fields.map((field) => (
                                    <Box key={field.name}>
                                        {renderFieldInput(
                                            field,
                                            activeSection.props[field.name],
                                            (value) => handleFieldChange(field.name, value)
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Drawer>
                )}

            </Box>

            {/* DRAWER INFERIOR */}
            <Drawer
                anchor="bottom"
                open={openSections}
                onClose={() => setOpenSections(false)}
                PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
            >
                <Box p={4}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Plantillas Predefinidas</Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {Object.entries(TEMPLATE_REGISTRY).map(([key, temp]) => (
                            <Grid item xs={12} sm={6} md={3} key={key}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => handleAddTemplate(key)}
                                    sx={{ height: '100px', display: 'flex', flexDirection: 'column', bgcolor: 'primary.50' }}
                                >
                                    <LayoutTemplate size={24} />
                                    <Typography variant="subtitle2" mt={1}>{temp.label}</Typography>
                                    <Typography variant="caption" color="textSecondary">{temp.description}</Typography>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" gutterBottom textAlign="center">
                        {targetParentId ? 'Añadir elemento dentro del contenedor' : 'Añadir nueva sección'}
                    </Typography>

                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(140px, 1fr))" gap={2} mt={2}>
                        {Object.keys(SECTION_SCHEMAS).map(type => (
                            <Button
                                key={type}
                                variant="outlined"
                                onClick={() => handleAddSection(type)}
                                sx={{
                                    height: 100,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    borderColor: '#e0e0e0',
                                    color: '#555',
                                    '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' }
                                }}
                            >
                                <CopyPlusIcon size={24} />
                                <Typography variant="caption" fontWeight="bold">{SECTION_SCHEMAS[type].label}</Typography>
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Drawer>

        </Box>
    );
}