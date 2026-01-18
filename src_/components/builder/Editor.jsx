import styles from './Editor.module.css';
import { Box, Drawer, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import PageRenderer from './Renderer';
import { v4 as uuidv4 } from 'uuid';
import Navigation from '../Navigation';
import { useEditor } from '@src/hooks/builder/useEditor';
import { SECTION_SCHEMAS } from './sectionRegistry';
import { CopyPlusIcon, MoveIcon, TrashIcon } from 'lucide-react'; // Asumiendo que tienes XIcon, sino usa texto
import { useSortableList } from '@src/hooks/useSortableList';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { SortableItem } from '../SortableItem';

import renderFieldInput from './helpers/renderFieldInput';

export default function Builder() {
    const {
        openSections,
        sections,
        selectedSectionId,
        setSections,
        setOpenSections,
        toggleSectionDrawer,
        setSelectedSectionId
    } = useEditor();

    // 1. Añadir Sección (Mejorado)
    const addSection = (type) => {
        const schema = SECTION_SCHEMAS[type];
        const initialProps = schema.fields.reduce((acc, field) => ({
            ...acc, [field.name]: field.default
        }), {});

        const newSection = {
            id: uuidv4(),
            type: type,
            props: initialProps
        };

        setSections([...sections, newSection]);

        // UX: Seleccionar la nueva sección inmediatamente para editarla
        setSelectedSectionId(newSection.id);

        // UX: Cerrar el drawer de abajo
        setOpenSections(false);
    };

    // 2. Manejar clic en el Sidebar Izquierdo
    const handleSelectSection = (id) => {
        setSelectedSectionId(id);
        // Si el drawer de abajo estaba abierto, cerrarlo
        setOpenSections(false);
    };

    const activeSection = sections.find(s => s.id === selectedSectionId);
    const activeSchema = activeSection ? SECTION_SCHEMAS[activeSection.type] : null;

    // Hook genérico reutilizable
    const { dndContextProps, sortableContextProps } = useSortableList(
        sections,
        setSections,
        async (newOrder) => {
            // 🔥 Persistimos los índices en backend
            /*for (const logo of newOrder) {
                await apiSyncService.update("Logo", logo.id, {
                    index: logo.index
                });
            }*/
        }
    );

    // 4. Eliminar Sección
    const handleDeleteSection = (e, sectionId) => {
        // Detenemos la propagación para que no seleccione la sección ni inicie el drag
        e.stopPropagation();

        if (window.confirm("¿Estás seguro de eliminar esta sección?")) {
            setSections(prev => prev.filter(s => s.id !== sectionId));

            // Si la sección borrada era la seleccionada, deseleccionamos
            if (selectedSectionId === sectionId) {
                setSelectedSectionId(null);
            }
        }
    };

    return (
        <>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navigation />

                {/* Contenedor Flex para Sidebar Izq + Canvas */}
                <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>

                    {/* --- SIDEBAR IZQUIERDO --- */}
                    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }} className={styles.drawer}>
                        <Box p={2}>
                            <Box className="border-b border-[lightgray] pb-2">
                                <Button onClick={toggleSectionDrawer(true)} variant="outlined" fullWidth startIcon={<CopyPlusIcon size={16} />}>
                                    Añadir sección
                                </Button>
                            </Box>
                            <Box className="pt-3">
                                <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>CAPAS</Typography>

                                <DndContext {...dndContextProps}>
                                    <SortableContext {...sortableContextProps}>
                                        <List dense>
                                            {sections.map((sect, index) => (
                                                <SortableItem key={sect.id} id={sect.id}>
                                                    <div className="flex border border-zinc-400 rounded p-2">
                                                        <div className="flex flex-col gap-2 mr-2 px-1 text-gray-400 justify-around">
                                                            {/* Icono Mover */}
                                                            <MoveIcon className="w-4 h-4 cursor-grab hover:text-gray-600" />

                                                            {/* Icono Eliminar */}
                                                            <TrashIcon
                                                                className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors"
                                                                // Importante: onClick ejecuta la lógica
                                                                onClick={(e) => handleDeleteSection(e, sect.id)}
                                                                // Importante: onPointerDown evita que dnd-kit inicie el arrastre aquí
                                                                onPointerDown={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <ListItem
                                                            key={sect.id}
                                                            onClick={() => handleSelectSection(sect.id)}
                                                            selected={selectedSectionId === sect.id}
                                                            sx={{
                                                                borderLeft: selectedSectionId === sect.id ? '4px solid primary.main' : '4px solid transparent',
                                                                bgcolor: selectedSectionId === sect.id ? 'action.selected' : 'transparent'
                                                            }}
                                                            style={{ padding: 0 }}
                                                        >
                                                            <ListItemText
                                                                primary={SECTION_SCHEMAS[sect.type].label}
                                                                secondary={`Sección ${index + 1}`}
                                                            />
                                                        </ListItem>
                                                    </div>
                                                </SortableItem>
                                            ))}
                                        </List>
                                    </SortableContext>
                                </DndContext>
                            </Box>
                        </Box>
                    </Drawer>

                    {/* --- CENTER: Preview --- */}
                    <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#f0f2f5', p: 4 }}>
                        {/* Simulamos una "hoja" de papel centrada */}
                        <Box sx={{ maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', boxShadow: 3 }}>
                            <PageRenderer sections={sections} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* --- SIDEBAR DERECHO (Editor) --- */}
            {selectedSectionId && <Drawer
                anchor="right"
                sx={{ width: 240, flexShrink: 0 }} className={styles.drawer}
                open={selectedSectionId}
            >
                <Box p={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6">{activeSchema.label}</Typography>
                        <Button size="small" color="error" onClick={() => setSelectedSectionId(null)}>
                            Cerrar
                        </Button>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={3}>
                        {activeSchema.fields.map(field => (
                            <Box key={field.name}>
                                {renderFieldInput(field, activeSection, setSections)}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Drawer>}

            {/* --- DRAWER INFERIOR (Selector) --- */}
            <Drawer
                anchor="bottom"
                open={openSections}
                onClose={toggleSectionDrawer(false)}
            >
                <Box p={4}>
                    <Typography variant="h6" gutterBottom>Selecciona un bloque para añadir</Typography>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {Object.keys(SECTION_SCHEMAS).map(type => (
                            <Button
                                key={type}
                                variant="outlined"
                                onClick={() => addSection(type)}
                                sx={{ height: 100, display: 'flex', flexDirection: 'column', gap: 1 }}
                            >
                                {/* Aquí podrías poner un icono según el tipo */}
                                <span>+</span>
                                {SECTION_SCHEMAS[type].label}
                            </Button>
                        ))}
                    </div>
                </Box>
            </Drawer>
        </>
    );
}