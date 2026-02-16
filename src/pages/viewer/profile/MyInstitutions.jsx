import { Typography, Box, Alert } from '@mui/material';
import { InstitutionCard } from '@src/pages/admin/Intitutions/components/InstitutionCard'; // Reutilizamos Card
import { Preloader } from '@src/components/preloader';
import { useCallback, useState } from 'react';
import { InstitutionForm } from './components/InstitutionForm';
import { useInstitutions } from '@src/pages/admin/Intitutions/hooks/useInstitutions';
import { useAllyInstitutions } from './hooks/useAllyInstitutions';

export const MyInstitutions = () => {
    const { institutions, loading, error, refresh } = useAllyInstitutions();
    const { updateInstitution } = useInstitutions();

    const [openForm, setOpenForm] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState(null);

    const handleManage = (institution) => {
        setSelectedInstitution(institution);
        setOpenForm(true);
    };

    const storeInstitutionWrapper = async (data) => {
        let success = false;

        // 1. Determinar si es Crear o Actualizar
        if (data.id) {
            success = await updateInstitution(data.id, data);
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

    const handleClose = useCallback((institutionDB) => {
        setSelectedInstitution(null);
        setOpenForm(false);
        if (institutionDB) {
            refresh();
        }
    }, [refresh]);

    if (loading) return <Preloader />;

    return (
        <>
            {/* FORMULARIO MODAL */}
            {(openForm || selectedInstitution) && (
                <InstitutionForm
                    store={storeInstitutionWrapper}
                    institution={selectedInstitution}
                    onClose={handleClose}
                    isAdminView={true}
                />
            )}
            <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Mis Instituciones
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                    Gestiona la información pública de los colegios asignados a tu cuenta.
                </Typography>

                {error && <Alert severity="error">Error cargando instituciones.</Alert>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {institutions.length > 0 ? (
                        institutions.map(inst => (
                            <InstitutionCard
                                key={inst.id}
                                institution={inst}
                                handleClickEdit={handleManage}
                                isAdminView={true}
                            />
                        ))
                    ) : (
                        <Typography color="text.secondary">No tienes instituciones asignadas.</Typography>
                    )}
                </div>
            </Box>
        </>
    );
};