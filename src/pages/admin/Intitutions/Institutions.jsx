import { useState, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { PlusIcon } from "lucide-react";

// Hooks
import { useInstitutions } from "./hooks/useInstitutions";
import useWhyDidYouUpdate from "@src/hooks/useWhyDidYouUpdate";

// Componentes
import { InstitutionForm } from "./components/InstitutionForm";
import { InstitutionCard } from "./components/InstitutionCard";
import { useNavigate } from "react-router-dom";

const Institutions = () => {

    const navigate = useNavigate();

    // 1. Hook de Lógica
    const {
        loading,
        institutions,
        createInstitution,
        updateInstitution,
        deleteInstitution,
        refresh
    } = useInstitutions();

    const [openForm, setOpenForm] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState(null);

    // Debugging (Opcional)
    if (import.meta.env.MODE === "development") {
        useWhyDidYouUpdate("Institutions", { institutions, openForm, selectedInstitution });
    }

    // --- HANDLERS ---

    const handleClickOpen = useCallback(() => {
        setSelectedInstitution(null);
        setOpenForm(true);
    }, []);

    const handleClose = useCallback((institutionDB) => {
        setSelectedInstitution(null);
        setOpenForm(false);
        if (institutionDB) {
            refresh();
        }
    }, [refresh]);

    const handleClickEdit = useCallback((institution) => {
        setSelectedInstitution(institution);
        setOpenForm(true);
    }, []);

    const handleClickDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar esta institución?')) {
            deleteInstitution(id);
        }
    };

    const handleClickBuilder = useCallback((institution) => {
        // Redirige al editor del template. 
        // AJUSTA ESTA RUTA según como tengas configurado tu router para Research.
        // Ejemplo: navigate(`/admin/research/${id}/builder`)
        navigate(`/admin/cms/institution/${institution.id}`); 
    }, [navigate]);

    // --- WRAPPER PARA EL FORMULARIO ---
    // Adapta el retorno del hook a lo que espera el InstitutionForm ({ institution, errors })
    const storeInstitutionWrapper = async (data) => {
        let success = false;

        // 1. Determinar si es Crear o Actualizar
        if (data.id) {
            success = await updateInstitution(data.id, data);
        } else {
            success = await createInstitution(data);
        }

        // 2. Retornar formato compatible con el Form
        // Como tu hook useInstitutions devuelve booleano (true/false) y maneja el error internamente,
        // simulamos la respuesta para el formulario.
        if (success) {
            return { institution: data, errors: null };
        } else {
            return { institution: null, errors: { form: "Ocurrió un error al guardar" } };
        }
    };

    return (
        <>
            {/* FORMULARIO MODAL */}
            {(openForm || selectedInstitution) && (
                <InstitutionForm
                    store={storeInstitutionWrapper}
                    institution={selectedInstitution}
                    onClose={handleClose}
                />
            )}

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8 gap-4 px-2">
                <div>
                    <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                        Instituciones
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                        Gestión del directorio de instituciones educativas
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    sx={{ borderRadius: 2, paddingX: 3, textTransform: 'none', fontWeight: 600 }}
                    startIcon={<PlusIcon size={18} />}
                >
                    Nueva Institución
                </Button>
            </div>

            {/* GRID LAYOUT (LISTADO) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">

                {loading && institutions.length === 0 ? (
                    // LOADING STATE (Skeletons)
                    <>
                        {[1, 2, 3, 4].map((n) => (
                            <InstitutionCard key={n} loading={true} handleClickBuilder={handleClickBuilder} />
                        ))}
                    </>
                ) : (
                    // DATA STATE
                    institutions.map(institution => (
                        <InstitutionCard
                            key={institution.id}
                            institution={institution}
                            handleClickEdit={handleClickEdit}
                            handleClickDelete={handleClickDelete}
                        />
                    ))
                )}

                {/* EMPTY STATE */}
                {!loading && institutions.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <PlusIcon className="text-gray-400" size={32} />
                        </div>
                        <Typography variant="h6" color="text.primary" fontWeight="bold">
                            No hay instituciones
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="max-w-xs mx-auto mb-6">
                            Comienza agregando universidades o institutos para gestionar el directorio.
                        </Typography>
                        <Button variant="outlined" onClick={handleClickOpen}>
                            Crear la primera
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Institutions;