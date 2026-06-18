import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Button, Typography, Box } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { generateClient } from 'aws-amplify/data';

import { AllyInstitutionForm } from './components/AllyInstitutionForm';
import { Preloader } from '@src/components/preloader';

const client = generateClient();

const AllyManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const backPath = location.pathname.startsWith('/profile')
        ? '/profile/institutions'
        : '/allies';

    const [institution, setInstitution] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInstitution = useCallback(async () => {
        if (!id) return null;
        const { data } = await client.models.Institution.get({ id }, {
            authMode: 'userPool'
        });
        setInstitution(data);
        return data;
    }, [id]);

    useEffect(() => {
        const fetchInst = async () => {
            if (!id) return;
            try {
                // Obtenemos la institución.
                // Si el usuario NO es el dueño (adminEmail), Amplify lanzará un error 
                // o devolverá null gracias a la regla 'allow.ownerDefinedIn'.
                await fetchInstitution();
            } catch (error) {
                console.error("Acceso denegado o error:", error);
                // Si falla, probablemente no tenga permisos
                navigate(backPath);
            } finally {
                setLoading(false);
            }
        };
        fetchInst();
    }, [id, navigate, backPath, fetchInstitution]);

    if (loading) {
        return (
            <Box className="h-screen flex items-center justify-center">
                <Preloader />
            </Box>
        );
    }

    if (!institution) {
        return (
            <Container className="py-12 text-center">
                <Typography variant="h5">Institución no encontrada o acceso denegado.</Typography>
                <Button onClick={() => navigate(backPath)} className="mt-4">Volver</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" className="py-8">
            <Button
                startIcon={<ArrowLeft size={18} />}
                onClick={() => navigate(backPath)}
                className="mb-6 text-gray-500 hover:text-gray-900"
            >
                Volver al Panel
            </Button>

            <AllyInstitutionForm
                institution={institution}
                onCancel={() => navigate(backPath)}
                onSaveSuccess={async (updatedInstitution) => {
                    if (updatedInstitution) {
                        setInstitution(updatedInstitution);
                    }
                }}
            />
        </Container>
    );
};

export default AllyManager;
