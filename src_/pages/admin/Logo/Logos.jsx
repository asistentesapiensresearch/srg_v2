import { useState } from "react";

import { Button, Skeleton, Typography } from "@mui/material";
import { DeleteIcon, EditIcon, PlusIcon, MoveIcon } from "lucide-react";

import { LogoForm } from "./LogoForm";
import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

import { SortableItem } from "../../../components/SortableItem";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortableList } from "@src/hooks/useSortableList";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useLogo } from "@src/hooks/useLogo";

const Logos = () => {

    const { loading, logos, setLogos } = useLogo();
    const [openForm, setOpenForm] = useState(false);
    const [selectedLogo, setSelectedLogo] = useState(null);

    // Hook genérico reutilizable
    const { dndContextProps, sortableContextProps } = useSortableList(
        logos,
        setLogos,
        async (newOrder) => {
            // 🔥 Persistimos los índices en backend
            for (const logo of newOrder) {
                await apiSyncService.update("Logo", logo.id, {
                    index: logo.index
                });
            }
        }
    );

    // --- Modales ---
    const handleClose = (logo) => {
        setSelectedLogo(null);
        setOpenForm(false);

        if (logo) {
            setLogos(values => [
                ...values.filter(v => v.id !== logo.id),
                logo
            ]);
        }
    };

    const handleClickOpen = () => setOpenForm(true);

    const handleClickEdit = (logo) => {
        setSelectedLogo(logo);
        setOpenForm(true);
    };

    const handleClickDelete = async (logo) => {
        if (!confirm(`¿Eliminar el logo ${logo.name}?`)) return;

        await apiSyncService.delete("Logo", logo.id);
        setLogos(values => values.filter(v => v.id !== logo.id));
    };

    return (
        <>
            {openForm && (
                <LogoForm
                    logo={selectedLogo}
                    onClose={handleClose}
                />
            )}

            <div className="flex items-center mb-4 gap-4">
                <Typography variant="h5">
                    Logos
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
                                <Skeleton variant="rectangular" width={210} height={36} className="rounded-lg" />
                                <Skeleton variant="rectangular" width={210} height={36} className="rounded-lg" />
                                <Skeleton variant="rectangular" width={210} height={36} className="rounded-lg" />
                            </>
                        )}
                        {logos
                            .sort((a, b) => a.index - b.index)
                            .map(logo => (
                                <SortableItem key={logo.id} id={logo.id}>
                                    <div className="flex">
                                        <MoveIcon className="w-4 me-2"/>
                                        <label htmlFor="">{logo.name}</label>
                                    </div>
                                    <div className="flex gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                        <StorageImage alt="sleepy-cat" path={logo.key} />
                                        <div className="flex gap-3 items-center">
                                            <EditIcon className="cursor-pointer" onClick={() => handleClickEdit(logo)} />
                                            <DeleteIcon className="cursor-pointer" onClick={() => handleClickDelete(logo)} />
                                        </div>
                                    </div>
                                </SortableItem>
                            ))}
                    </div>

                </SortableContext>
            </DndContext>
        </>
    );
};

export default Logos;