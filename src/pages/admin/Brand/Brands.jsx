import { useState, useCallback } from "react";
import { Button, Typography, Box } from "@mui/material";
import { PlusIcon } from "lucide-react";

import { BrandForm } from "./components/BrandForm";
import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

import { SortableItem } from "../../../components/SortableItem";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, SortableContext } from "@dnd-kit/sortable";
import { useSortableList } from "@src/hooks/useSortableList";
import { useBrand } from "./hooks/useBrand";
import { BrandCard } from "./components/BrandCard"; // 🔥 Importamos la nueva card

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
    const [activeId, setActiveId] = useState(null); // Para el DragOverlay (opcional, mejora visual)

    // Configuración de sensores para mejorar la experiencia de arrastre
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Evita clicks accidentales
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const { dndContextProps, sortableContextProps } = useSortableList(
        brands,
        setBrands,
        async (newOrder) => {
            // Persistir orden
            for (const brand of newOrder) {
                await apiSyncService.update("Brand", brand.id, {
                    index: brand.index
                });
            }
        }
    );

    // --- HANDLERS ---
    const handleClose = (brand) => {
        setSelectedBrand(null);
        setOpenForm(false);
        if (brand) setRefresh(u => u + 1);
    };

    const handleClickOpen = () => {
        setSelectedBrand(null);
        setOpenForm(true);
    };

    const handleClickEdit = useCallback((brand) => {
        setSelectedBrand(brand);
        setOpenForm(true);
    }, []);

    const handleClickDelete = useCallback(async (brand) => {
        if (!confirm(`¿Eliminar la marca "${brand.name}"?`)) return;
        try {
            await apiSyncService.delete("Brand", brand.id);
            setBrands(prev => prev.filter(b => b.id !== brand.id));
        } catch (e) {
            console.error(e);
            alert("Error al eliminar");
        }
    }, [setBrands]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        if (dndContextProps.onDragStart) dndContextProps.onDragStart(event);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        dndContextProps.onDragEnd(event);
    };

    return (
        <>
            {/* Modal de Formulario */}
            {openForm && (
                <BrandForm
                    brand={selectedBrand}
                    onClose={handleClose}
                    store={saveBrand}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                        Marcas y Aliados
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                        Gestiona los logos que aparecen en los templates
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                    startIcon={<PlusIcon size={18} />}
                >
                    Nueva Marca
                </Button>
            </div>

            {/* Grid de Drag & Drop */}
            <DndContext
                {...dndContextProps}
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext {...sortableContextProps}>

                    {/* 🔥 GRID RESPONSIVE */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10">

                        {loading && brands.length === 0 ? (
                            // Skeletons
                            Array.from({ length: 6 }).map((_, i) => (
                                <BrandCard key={i} loading={true} />
                            ))
                        ) : (
                            brands
                                .sort((a, b) => a.index - b.index)
                                .map(brand => (
                                    <SortableItem key={brand.id} id={brand.id}>
                                        <BrandCard
                                            brand={brand}
                                            onEdit={handleClickEdit}
                                            onDelete={handleClickDelete}
                                            dragging={activeId === brand.id}
                                        />
                                    </SortableItem>
                                ))
                        )}

                        {!loading && brands.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-gray-400">
                                <Typography>No hay marcas creadas</Typography>
                            </div>
                        )}
                    </div>

                </SortableContext>

                {/* Overlay opcional para ver lo que arrastras flotando */}
                <DragOverlay>
                    {activeId ? (
                        <div style={{ transform: 'scale(1.05)' }}>
                            <BrandCard
                                brand={brands.find(b => b.id === activeId)}
                                dragging={true}
                            />
                        </div>
                    ) : null}
                </DragOverlay>

            </DndContext>
        </>
    );
};

export default Brands;