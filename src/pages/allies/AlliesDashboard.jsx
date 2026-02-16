import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Alert, Button } from '@mui/material';
import { LayoutDashboard } from 'lucide-react';

// Hooks
import { useAllyInstitutions } from '../viewer/profile/hooks/useAllyInstitutions';

// Componentes Reutilizados
import { InstitutionCard } from '../admin/Intitutions/components/InstitutionCard';
import { Preloader } from '@src/components/preloader';

const AlliesDashboard = () => {
    const navigate = useNavigate();
    const { institutions, loading, error } = useAllyInstitutions();

    // Handler para ir a la gestión específica (Formulario, etc.)
    const handleManage = (institution) => {
        // Redirige a la ruta donde pondrás el FormBuilder
        navigate(`/allies/manage/${institution.id}`);
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-screen">
                <Preloader />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" className="py-8">

            {/* Header de Bienvenida */}
            <Box className="mb-8">
                <Typography variant="h4" className="font-bold text-gray-800 flex items-center gap-2">
                    <LayoutDashboard className="text-blue-600" />
                    Panel de Aliados
                </Typography>
                <Typography variant="body1" className="text-gray-500 mt-1">
                    Administra la información pública y formularios de tus instituciones asignadas.
                </Typography>
            </Box>

            {/* Manejo de Error */}
            {error && (
                <Alert severity="error" className="mb-4">
                    Ocurrió un error al cargar tus instituciones.
                </Alert>
            )}

            {/* Grid de Instituciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {institutions.length > 0 ? (
                    institutions.map(inst => (
                        <InstitutionCard
                            key={inst.id}
                            institution={inst}
                            // 🔥 Solo pasamos este prop, así no se muestran los botones de admin
                            handleClickManage={handleManage}
                        />
                    ))
                ) : (
                    <Box className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <Typography variant="h6" color="text.secondary">
                            No tienes instituciones asignadas.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="mb-4">
                            Contacta al administrador para que te asigne un colegio.
                        </Typography>
                    </Box>
                )}
            </div>

        </Container>
    );
};

export default AlliesDashboard;