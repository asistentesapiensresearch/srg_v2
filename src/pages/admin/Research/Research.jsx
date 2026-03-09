import React, { useState, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { PlusIcon, FileText } from "lucide-react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

// Hooks
import { useResearchs } from "./hooks/useResearchs";
import { useSortableList } from "@src/hooks/useSortableList";
import useWhyDidYouUpdate from "@src/hooks/useWhyDidYouUpdate";

// Componentes
import { ResearchForm } from "./components/ResearchForm";
import { ResearchCard } from "./components/ResearchCard";
import { SortableItem } from "@src/components/SortableItem";

const Research = () => {
    const {
        loading,
        researchs,
        setResearchs, // Asegúrate de que tu hook exporte esto
        storeResearch, // La función original del hook
        deleteResearch,
        setRefresh
    } = useResearchs();

    const [openForm, setOpenForm] = useState(false);
    const [selectedResearch, setSelectedResearch] = useState(null);

    // --- WRAPPER PARA EL FORMULARIO (LA SOLUCIÓN) ---
    // Este wrapper adapta la respuesta del hook al formato que espera el ResearchForm
    const storeResearchWrapper = async (data, id) => {
        try {
            // Llamamos al hook original
            const result = await storeResearch(data, id);

            // Verificamos si fue exitoso (asumiendo que storeResearch devuelve true o el objeto)
            if (result) {
                // Devolvemos el formato esperado por ResearchForm: { research, errors }
                // Pasamos 'data' para que onClose reciba algo truthy y refresque
                return { research: data, errors: null };
            } else {
                return { research: null, errors: { submit: "No se pudo guardar la investigación." } };
            }
        } catch (error) {
            console.error(error);
            return { research: null, errors: { submit: error.message || "Error inesperado." } };
        }
    };

    // --- HANDLERS ---
    const handleClickOpen = useCallback(() => {
        setSelectedResearch(null);
        setOpenForm(true);
    }, []);

    const handleClose = useCallback((result) => {
        setSelectedResearch(null);
        setOpenForm(false);
        // Si result (researchDB) tiene datos, refrescamos la lista
        if (result) setRefresh(r => r + 1);
    }, [setRefresh]);

    const handleClickEdit = useCallback((research) => {
        setSelectedResearch(research);
    }, []);

    const handleClickDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta investigación?')) {
            deleteResearch(id);
        }
    };

    const { dndContextProps, sortableContextProps } = useSortableList(
        researchs,
        setResearchs,
        async (newOrder) => {
            for (const item of newOrder) {
                const original = researchs.find(r => r.id === item.id);
                if (original && original.index !== item.index) {
                    // Aquí usamos el hook original storeResearch, no el wrapper
                    await storeResearch({ ...item }, item.id);
                }
            }
        }
    );

    // Debugging
    if (import.meta.env.MODE === "development") {
        useWhyDidYouUpdate("Research", { researchs, openForm, selectedResearch });
    }

    return (
        <>
            {(openForm || selectedResearch) && (
                <ResearchForm
                    // 🔥 Pasamos el Wrapper, NO el hook directo
                    store={storeResearchWrapper}
                    research={selectedResearch}
                    onClose={handleClose}
                />
            )}

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8 gap-4 px-2">
                <div>
                    <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                        Investigaciones
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                        Gestiona y ordena los proyectos de investigación publicados
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    sx={{ borderRadius: 2, paddingX: 3, textTransform: 'none', fontWeight: 600 }}
                    startIcon={<PlusIcon size={18} />}
                >
                    Nueva Investigación
                </Button>
            </div>

            {/* CONTENT AREA */}
            {loading ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <ResearchCard key={i} loading={true} />)}
                </div>
            ) : researchs.length > 0 ? (
                <DndContext {...dndContextProps}>
                    <SortableContext {...sortableContextProps}>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
                            {researchs
                                .sort((a, b) => (a.index || 0) - (b.index || 0))
                                .map(research => (
                                    <SortableItem key={research.id} id={research.id}>
                                        <ResearchCard
                                            research={research}
                                            handleClickEdit={handleClickEdit}
                                            handleClickDelete={handleClickDelete}
                                        />
                                    </SortableItem>
                                ))
                            }
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 m-2">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
                        <FileText className="text-blue-400" size={32} />
                    </div>
                    <Typography variant="h6" color="text.primary" fontWeight="bold">
                        No hay investigaciones
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="max-w-xs mx-auto mb-6">
                        Comienza creando proyectos de investigación para mostrarlos en el portal.
                    </Typography>
                    <Button variant="outlined" onClick={handleClickOpen} sx={{ borderRadius: 2, textTransform: 'none' }}>
                        Crear la primera
                    </Button>
                </div>
            )}
        </>
    );
};

export default Research;