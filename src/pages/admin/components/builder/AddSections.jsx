import { Box, Button, Divider, Drawer, Grid, Typography } from "@mui/material";
import { CopyPlusIcon, LayoutTemplate } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { SECTION_SCHEMAS } from './sectionRegistry';
import { TEMPLATE_REGISTRY } from './templateRegistry';
import DynamicIcon from "./helpers/DynamicIcon";

export default function AddSections({
    openSections,
    targetParentId,
    setTargetParentId,
    setSections,
    setSelectedSectionId,
    setOpenSections
}) {

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

    const handleAddTemplate = (templateKey) => {
        const template = TEMPLATE_REGISTRY[templateKey];
        if (!template) return;

        const newSections = template.getSections();
        setSections(prev => [...prev, ...newSections]);
        setOpenSections(false);
    };

    return (
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
                        <Grid size={{  xs:12, sm:6, md:3 }} key={key}>
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
                            <DynamicIcon name={SECTION_SCHEMAS[type].icon} size={24} />
                            <Typography variant="caption" fontWeight="bold">{SECTION_SCHEMAS[type].label}</Typography>
                        </Button>
                    ))}
                </Box>
            </Box>
        </Drawer>
    );
}