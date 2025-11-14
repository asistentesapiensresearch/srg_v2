import { useState } from "react";
import { useSections } from "@src/hooks/useSections";

import { Button, Typography } from "@mui/material";
import { PlusIcon } from "lucide-react";

import { SectionForm } from "./SectionForm";
import { SectionCard } from "./SectionCard";
import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

import { SortableItem } from "../../../components/SortableItem";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortableList } from "@src/hooks/useSortableList";

const Sections = () => {

    const { sections, setSections } = useSections();
    const [openForm, setOpenForm] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);

    // Hook genérico reutilizable
    const { dndContextProps, sortableContextProps } = useSortableList(
        sections,
        setSections,
        async (newOrder) => {
            // 🔥 Persistimos los índices en backend
            for (const section of newOrder) {
                await apiSyncService.update("Section", section.id, {
                    index: section.index
                });
            }
        }
    );

    // --- Modales ---
    const handleClose = (section) => {
        setSelectedSection(null);
        setOpenForm(false);

        if (section) {
            setSections(values => [
                ...values.filter(v => v.id !== section.id),
                section
            ]);
        }
    };

    const handleClickOpen = () => setOpenForm(true);

    const handleClickEdit = (section) => {
        setSelectedSection(section);
        setOpenForm(true);
    };

    const handleClickDelete = async (section) => {
        if (!confirm(`¿Eliminar la sección ${section.name}?`)) return;

        const researchs = await section.Researchs();

        if (researchs.length > 0) {
            alert("Tiene investigaciones asociadas.");
            return;
        }

        await apiSyncService.delete("Section", section.id);
        setSections(values => values.filter(v => v.id !== section.id));
    };

    return (
        <>
            {openForm && (
                <SectionForm
                    section={selectedSection}
                    onClose={handleClose}
                />
            )}

            <div className="flex items-center mb-4 gap-4">
                <Typography variant="h5">
                    Secciones
                </Typography>
                <Button variant="contained" color="error" onClick={handleClickOpen}>
                    <PlusIcon size={20} />
                </Button>
            </div>

            {/* 🔥 Drag & Drop profesional */}
            <DndContext {...dndContextProps}>
                <SortableContext {...sortableContextProps}>

                    <div className="flex flex-wrap gap-4">
                        {sections
                            .sort((a, b) => a.index - b.index)
                            .map(section => (
                                <SortableItem key={section.id} id={section.id}>
                                    <SectionCard
                                        isAdmin={true}
                                        section={section}
                                        handleClickEdit={() => handleClickEdit(section)}
                                        handleClickDelete={() => handleClickDelete(section)}
                                    />
                                </SortableItem>
                            ))}
                    </div>

                </SortableContext>
            </DndContext>
        </>
    );
};

export default Sections;