import { Fragment } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Button, TextField, Typography } from '@mui/material';
import PageRenderer from './Renderer';
import { SECTION_SCHEMAS } from './sectionRegistry';
import { v4 as uuidv4 } from 'uuid';
import Navigation from '../Navigation';
import { useEditor } from '@src/hooks/builder/useEditor';
import { MoveIcon } from 'lucide-react';

export default function Builder() {
    const { sections,
        setSections,
        selectedSectionId,
        setSelectedSectionId
    } = useEditor();

    // 1. Añadir Sección
    const addSection = (type) => {
        const schema = SECTION_SCHEMAS[type];
        // Crear objeto inicial basado en los defaults del schema
        const initialProps = schema.fields.reduce((acc, field) => ({
            ...acc, [field.name]: field.default
        }), {});

        const newSection = {
            id: uuidv4(),
            type: type,
            props: initialProps
        };

        setSections([...sections, newSection]);
    };

    // 2. Actualizar Propiedades (El input del sidebar)
    const updateSectionProps = (id, fieldName, value) => {
        setSections(prev => prev.map(sec =>
            sec.id === id ? { ...sec, props: { ...sec.props, [fieldName]: value } } : sec
        ));
    };

    // Obtener esquema de la sección seleccionada para dibujar los inputs
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

    return (
        <Box sx={{ display: 'flex' }}>
            {/* --- SIDEBAR IZQUIERDO: Lista de Secciones --- */}
            <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
                <Box p={2}>
                    <Typography variant="h6">Secciones Disponibles</Typography>
                    {Object.keys(SECTION_SCHEMAS).map(type => (
                        <Button key={type} onClick={() => addSection(type)} fullWidth>
                            + {SECTION_SCHEMAS[type].label}
                        </Button>
                    ))}
                    <hr />
                    <Typography variant="h6">Tus Capas</Typography>
                    <DndContext {...dndContextProps}>
                        <SortableContext {...sortableContextProps}>
                            <List>
                                {sections.map(sec => (
                                    <SortableItem key={sect.id} id={sect.id}>
                                        <div className="flex">
                                            <MoveIcon className="w-4 me-2"/>
                                        </div>
                                        <ListItem button key={sec.id} onClick={() => setSelectedSectionId(sec.id)} selected={selectedSectionId === sec.id}>
                                            <ListItemText primary={SECTION_SCHEMAS[sec.type].label} />
                                        </ListItem>
                                    </SortableItem>
                                ))}
                            </List>
                        </SortableContext>
                    </DndContext>
                    <Button onClick={toggleDrawer(true)}>Añadir secciíon</Button>
                </Box>
            </Drawer>

            {/* --- CENTER: Preview en tiempo real --- */}
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', height: '100vh', overflow: 'auto' }}>
                <Navigation />
                <PageRenderer sections={sections} />
            </Box>

            <Fragment key="bottom">
                <Button onClick={toggleDrawer("bottom", true)}>"bottom"</Button>
                <SwipeableDrawer
                    anchor="bottom"
                    open={state["bottom"]}
                    onClose={toggleDrawer("bottom", false)}
                    onOpen={toggleDrawer("bottom", true)}
                >
                    {list("bottom")}
                </SwipeableDrawer>
            </Fragment>

            {/* --- SIDEBAR DERECHO: Editor de Propiedades --- */}
            {activeSection && (
                <Drawer anchor="right" open={true} variant="persistent" sx={{ width: 300 }}>
                    <Box p={2} width={300}>
                        <Typography variant="h6">Editar {activeSchema.label}</Typography>
                        {activeSchema.fields.map(field => (
                            <Box key={field.name} my={2}>
                                {/* Aquí deberías tener un switch para renderizar ColorPicker, ImageUploader, etc */}
                                <TextField
                                    label={field.label}
                                    fullWidth
                                    value={activeSection.props[field.name]}
                                    onChange={(e) => updateSectionProps(activeSection.id, field.name, e.target.value)}
                                />
                            </Box>
                        ))}
                    </Box>
                </Drawer>
            )}
        </Box>
    );
}