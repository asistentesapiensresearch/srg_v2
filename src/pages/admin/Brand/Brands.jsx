import { useState } from "react";

import { Button, Skeleton, Typography } from "@mui/material";
import { DeleteIcon, EditIcon, PlusIcon, MoveIcon } from "lucide-react";

import { BrandForm } from "./components/BrandForm";
import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

import { SortableItem } from "../../../components/SortableItem";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortableList } from "@src/hooks/useSortableList";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useBrand } from "./hooks/useBrand";

const Brands = () => {

    const {
        loading,
        brands,
        setBrands,
        setRefresh,
        saveBrand
    } = useBrand();

    const [openForm, setOpenForm] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);

    // Hook genérico reutilizable
    const { dndContextProps, sortableContextProps } = useSortableList(
        brands,
        setBrands,
        async (newOrder) => {
            // 🔥 Persistimos los índices en backend
            for (const brand of newOrder) {
                await apiSyncService.update("Brand", brand.id, {
                    index: brand.index
                });
            }
        }
    );

    // --- Modales ---
    const handleClose = (brand) => {
        setSelectedBrand(null);
        setOpenForm(false);
        if(brand) setRefresh(update => update + 1);
    };

    const handleClickOpen = () => setOpenForm(true);

    const handleClickEdit = (brand) => {
        setSelectedBrand(brand);
        setOpenForm(true);
    };

    const handleClickDelete = async (brand) => {
        if (!confirm(`¿Eliminar el brand ${brand.name}?`)) return;

        await apiSyncService.delete("Brand", brand.id);
        setBrands(values => values.filter(v => v.id !== brand.id));
    };

    return (
        <>
            {openForm && (
                <BrandForm
                    brand={selectedBrand}
                    onClose={handleClose}
                    store={saveBrand}
                />
            )}

            <div className="flex items-center mb-4 gap-4">
                <Typography variant="h5">
                    Brands
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
                        {brands
                            .sort((a, b) => a.index - b.index)
                            .map(brand => (
                                <SortableItem key={brand.id} id={brand.id}>
                                    <div className="flex">
                                        <MoveIcon className="w-4 me-2"/>
                                        <label htmlFor="">{brand.name}</label>
                                    </div>
                                    <div className="flex gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                        {brand.key && <StorageImage alt="sleepy-cat" path={brand.key} />}
                                        <div className="flex gap-3 items-center">
                                            <EditIcon className="cursor-pointer" onClick={() => handleClickEdit(brand)} />
                                            <DeleteIcon className="cursor-pointer" onClick={() => handleClickDelete(brand)} />
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

export default Brands;