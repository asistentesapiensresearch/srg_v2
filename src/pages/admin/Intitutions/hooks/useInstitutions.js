import { useState, useEffect, useCallback } from 'react';
import { InstitutionAmplifyRepository } from '@core/infrastructure/repositories/InstitutionAmplifyRepository';
import { CreateInstitution } from '@core/application/caseUses/Institution/CreateInstitution';
import { ListInstitutions } from '@core/application/caseUses/Institution/ListInstitutions';

const institutionRepo = new InstitutionAmplifyRepository();
const createInstitutionUseCase = new CreateInstitution(institutionRepo);
const listInstitutionsUseCase = new ListInstitutions(institutionRepo);

export const useInstitutions = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInstitutions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listInstitutionsUseCase.execute();
            const safeData = data || [];
            // Ordenar...
            setInstitutions(safeData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createInstitution = async (data) => {
        setLoading(true);
        try {
            await createInstitutionUseCase.execute(data);
            await fetchInstitutions();
            return true;
        } catch (err) {
            console.error(err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 🔥 NUEVO: Función de Actualizar
    const updateInstitution = async (id, data) => {
        setLoading(true);
        try {
            // Nota: Debes implementar el método update en tu repositorio
            await institutionRepo.create({ id, ...data });
            await fetchInstitutions();
            return true;
        } catch (err) {
            console.error(err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteInstitution = async (id) => {
        try {
            await institutionRepo.delete(id);
            setInstitutions(prev => prev.filter(i => i.id !== id));
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, [fetchInstitutions]);

    return {
        institutions,
        loading,
        createInstitution,
        updateInstitution, // Exportar
        deleteInstitution,
        refresh: fetchInstitutions
    };
};