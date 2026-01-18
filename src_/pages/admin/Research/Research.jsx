import { Button, Typography } from "@mui/material";
import { useResearchs } from "@src/hooks/useResearchs";
import { PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { ResearchForm } from "./ResearchForm";
import useWhyDidYouUpdate from "../../../hooks/useWhyDidYouUpdate"
import { useSortableList } from "@src/hooks/useSortableList";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { ResearchCard } from "./ResearchCard";
import { SortableItem } from "@src/components/SortableItem";

const Research = () => {

    const { loading, researchs, setReseearchs } = useResearchs();
    const [openForm, setOpenForm] = useState(false);
    const [selectedResearch, setSelectedResearch] = useState(null);

    if (import.meta.env.MODE === "development") {
        useWhyDidYouUpdate("Research", {
            researchs,
            setReseearchs,
            openForm,
            setOpenForm,
            selectedResearch
        });
    }

    const handleClickOpen = useCallback(() => setOpenForm(true), []);

    const handleClose = useCallback(() => {
        setSelectedResearch(undefined);
        setOpenForm(false);
    }, []);

    const { dndContextProps, sortableContextProps } = useSortableList(
        researchs,
        setReseearchs,
        async (newOrder) => {
            // 🔥 Persistimos los índices en backend
            for (const research of researchs) {
                await apiSyncService.update("Research", research.id, {
                    index: research.index
                });
            }
        }
    );

    const handleClickEdit = useCallback((research) => {
        setSelectedResearch(research);
    },[]);

    return (
        <>
            {(openForm || selectedResearch) && (
                <ResearchForm
                    research={selectedResearch}
                    onClose={handleClose}
                />
            )}

            <div className="flex items-center mb-4 gap-4">
                <Typography variant="h5">
                    Investigaciones
                </Typography>
                <Button variant="contained" color="error" onClick={handleClickOpen}>
                    <PlusIcon size={20} />
                </Button>
            </div>

            {/* 🔥 Drag & Drop profesional */}
            <DndContext {...dndContextProps}>
                <SortableContext {...sortableContextProps}>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {loading ?
                            <>
                                <ResearchCard loading={loading} />
                                <ResearchCard loading={loading} />
                                <ResearchCard loading={loading} />
                            </>
                            :
                            researchs
                                .sort((a, b) => a.index - b.index)
                                .map(research => (
                                    <SortableItem key={research.id} id={research.id}>
                                        <ResearchCard
                                            research={research}
                                            handleClickEdit={handleClickEdit}
                                            />
                                    </SortableItem>
                                ))
                        }
                    </div>

                </SortableContext>
            </DndContext>
        </>
    );
};

export default Research;