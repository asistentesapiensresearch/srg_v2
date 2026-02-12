import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Box, Button, Drawer, List, Typography } from "@mui/material";
import { useSortableList } from "@src/hooks/useSortableList";
import { CopyPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { SECTION_SCHEMAS } from './sectionRegistry';
import { SortableItem } from "@src/components/SortableItem";
import { LayerItem } from "./LayerItem";
import { Create, Update } from "@core/application/caseUses/Template";
import { TemplateAmplifyRepository } from "@core/infrastructure/repositories/TemplateAmplifyRepository";
import ExportTemplate from "./ExportTemplate";

// ==========================================
// HELPERS RECURSIVOS
// ==========================================

const deleteNodeFromTree = (nodes, idToDelete) => {
    return nodes
        .filter(node => node.id !== idToDelete)
        .map(node => ({
            ...node,
            children: node.children ? deleteNodeFromTree(node.children, idToDelete) : []
        }));
};

export default function ListSections({
    sections,
    researchId,
    setSections,
    findNodeById,
    selectedSectionId,
    setSelectedSectionId,
    setTargetParentId,
    setOpenSections,
    currentTemplate
}) {

    const templateRepository = new TemplateAmplifyRepository();
    const [isSaving, setIsSaving] = useState(false);
    const [openExport, setOpenExport] = useState(false);
    const { dndContextProps, sortableContextProps, activeId, overId } = useSortableList(
        sections,
        setSections,
        SECTION_SCHEMAS
    );

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

    const handlePrepareAddRoot = () => {
        setTargetParentId(null);
        setOpenSections(true);
    };

    const handleExport = () => {
        setOpenExport(true);
    };

    const handlePrepareAddChild = (e, parentId) => {
        e.stopPropagation();
        setTargetParentId(parentId);
        setOpenSections(true);
    };

    const renderLayerTree = (items, depth = 0) => {
        return items.map((sect) => (
            <SortableItem key={sect.id} id={sect.id}>
                <LayerItem
                    section={sect}
                    label={SECTION_SCHEMAS[sect.type]?.label || sect.type}
                    isSelected={selectedSectionId === sect.id}
                    isActive={activeId === sect.id} // 🔥 Detectar si está siendo arrastrado
                    isDragging={activeId === sect.id} // 🔥 Nuevo prop
                    isOver={overId === sect.id} // 🔥 Nuevo prop
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

    return (
        <>
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

                            {/* 🔥 DragOverlay para preview durante el arrastre */}
                            <DragOverlay>
                                {activeId ? (
                                    <Box
                                        sx={{
                                            bgcolor: 'white',
                                            border: '2px solid #1976d2',
                                            borderRadius: 1,
                                            p: 1,
                                            boxShadow: 3,
                                            opacity: 0.9
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight={600}>
                                            {(() => {
                                                const activeNode = findNodeById(sections, activeId);
                                                return SECTION_SCHEMAS[activeNode?.type]?.label || 'Elemento';
                                            })()}
                                        </Typography>
                                    </Box>
                                ) : null}
                            </DragOverlay>
                        </DndContext>

                        {sections.length === 0 && (
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                                No hay secciones.<br />Añade una para comenzar.
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
                        {sections.length > 0 && (
                            <Button
                                onClick={handleExport}
                                variant="contained"
                                size="small"
                                fullWidth
                                disabled={isSaving}
                                color='primary'
                                style={{ marginTop: 15 }}
                            >
                                Exportar
                            </Button>
                        )}
                    </Box>
                </Box>
            </Drawer>
            <ExportTemplate
                sections={sections}
                openExport={openExport}
                setOpenExport={setOpenExport} />
        </>
    );
}