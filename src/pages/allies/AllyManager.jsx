import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { generateClient } from 'aws-amplify/data';

import { AllyInstitutionForm } from './components/AllyInstitutionForm';
import { Preloader } from '@src/components/preloader';

const client = generateClient();

const AllyManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [institution, setInstitution] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInst = async () => {
            if (!id) return;
            try {
                // Obtenemos la institución.
                // Si el usuario NO es el dueño (adminEmail), Amplify lanzará un error 
                // o devolverá null gracias a la regla 'allow.ownerDefinedIn'.
                const { data } = await client.models.Institution.get({ id });
                setInstitution(data);
            } catch (error) {
                console.error("Acceso denegado o error:", error);
                // Si falla, probablemente no tenga permisos
                navigate('/allies');
            } finally {
                setLoading(false);
            }
        };
        fetchInst();
    }, [id, navigate]);

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
                <Button onClick={() => navigate('/allies')} className="mt-4">Volver</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" className="py-8">
            <Button
                startIcon={<ArrowLeft size={18} />}
                onClick={() => navigate('/allies')}
                className="mb-6 text-gray-500 hover:text-gray-900"
            >
                Volver al Panel
            </Button>

            <AllyInstitutionForm
                institution={institution}
                onCancel={() => navigate('/allies')}
                onSaveSuccess={() => {
                    alert("¡Información actualizada correctamente!");
                    navigate('/allies');
                }}
            />
        </Container>
    );
};

export default AllyManager;