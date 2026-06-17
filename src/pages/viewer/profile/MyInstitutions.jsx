import { Typography, Box, Alert } from '@mui/material';
import { InstitutionCard } from '@src/pages/admin/Intitutions/components/InstitutionCard'; // Reutilizamos Card
import { Preloader } from '@src/components/preloader';
import { useAllyInstitutions } from './hooks/useAllyInstitutions';
import { useNavigate } from 'react-router-dom';

export const MyInstitutions = () => {
    const navigate = useNavigate();
    const { institutions, loading, error } = useAllyInstitutions();

    const handleManage = (institution) => {
        navigate(`/profile/institutions/manage/${institution.id}`);
    };

    if (loading) return <Preloader />;

    return (
        <>
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
