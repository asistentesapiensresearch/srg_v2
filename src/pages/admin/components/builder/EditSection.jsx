import { Box, Drawer, IconButton, Typography } from "@mui/material";
import renderFieldInput from './helpers/renderFieldInput';
import { SECTION_SCHEMAS } from './sectionRegistry';
import { X as CloseIcon } from "lucide-react";

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

export default function EditSection({
    sections,
    setSections,
    findNodeById,
    selectedSectionId,
    setSelectedSectionId
}) {

    const activeSection = findNodeById(sections, selectedSectionId);
    const activeSchema = activeSection ? SECTION_SCHEMAS[activeSection.type] : null;

    const handleFieldChange = (field, value) => {
        setSections(prev => updateNodeProps(prev, activeSection.id, field, value));
    };

    return (
        <>
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

                        <Box display="flex" flexDirection="column" gap={1} mt={2}>
                            {activeSchema.fields
                                .filter((field) => {
                                    if (!field.condition) return true;

                                    const props = activeSection?.props || {};

                                    try {
                                        return new Function(
                                            ...Object.keys(props),
                                            `return ${field.condition}`
                                        )(...Object.values(props));
                                    } catch (e) {
                                        console.warn("Error evaluando condition:", field.condition);
                                        return true;
                                    }
                                })
                                .map((field) => (
                                    <Box key={field.name}>
                                        {renderFieldInput(
                                            field,
                                            activeSection,
                                            (value) => handleFieldChange(field.name, value)
                                        )}
                                    </Box>
                                ))
                            }
                        </Box>
                    </Box>
                </Drawer>
            )}
        </>
    );
}