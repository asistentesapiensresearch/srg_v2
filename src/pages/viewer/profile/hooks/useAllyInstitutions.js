import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { fetchUserAttributes } from 'aws-amplify/auth';

const client = generateClient();

export const useAllyInstitutions = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyInstitutions = async () => {
        setLoading(true);
        try {
            // 1. Obtener email del usuario logueado
            const attributes = await fetchUserAttributes();
            const email = attributes.email;

            if (!email) {
                throw new Error("No se pudo identificar el correo del usuario.");
            }

            // 2. Consultar instituciones donde adminEmail coincida
            const { data } = await client.models.Institution.listInstitutionsByAdmin({
                adminEmail: email
            });

            setInstitutions(data);
        } catch (err) {
            console.error("Error cargando instituciones del aliado:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyInstitutions();
    }, []);

    return {
        institutions,
        loading,
        error,
        refresh: fetchMyInstitutions
    };
};