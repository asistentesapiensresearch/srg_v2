import { useState } from "react";
import { useSections } from "@src/pages/admin/Sections/hooks/useSections";

import { Button, Skeleton, Typography } from "@mui/material";
import { PlusIcon } from "lucide-react";

import { SectionForm } from "./components/SectionForm";
import { SectionCard } from "./components/SectionCard";
import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

import { SortableItem } from "@src/components/SortableItem";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortableList } from "@src/hooks/useSortableList";

const Sections = () => {

    const { loading, sections, setSections } = useSections();
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
                        {loading && (
                            <>
                                <Skeleton variant="rectangular" width={210} height={36} className="rounded-lg"/>
                                <Skeleton variant="rectangular" width={210} height={36} className="rounded-lg"/>
                                <Skeleton variant="rectangular" width={210} height={36} className="rounded-lg"/>
                            </>
                        )}
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