import { useState, useCallback } from 'react';

// 1. Importar la Infraestructura (Amplify)
import { TestimonialAmplifyRepository } from '@core/infrastructure/repositories/TestimonialAmplifyRepository';

// 2. Importar los Casos de Uso
import { StoreTestimonialUseCase } from '@core/application/caseUses/Testimonial/StoreTestimonial';
import { FindTestimonialsUseCase } from '@core/application/caseUses/Testimonial/FindTestimonials';
import { DeleteTestimonialUseCase } from '@core/application/caseUses/Testimonial/DeleteTestimonial';

export const useTestimonials = (entityId) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);

    // Inyección de Dependencias
    const repository = new TestimonialAmplifyRepository();
    const findUseCase = new FindTestimonialsUseCase(repository);
    const storeUseCase = new StoreTestimonialUseCase(repository);
    const deleteUseCase = new DeleteTestimonialUseCase(repository);

    const fetchTestimonials = useCallback(async () => {
        if (!entityId) return;
        setLoading(true);
        try {
            // Usamos el caso de uso en lugar del repositorio directamente
            const data = await findUseCase.execute(entityId);
            setTestimonials(data || []);
        } catch (error) {
            console.error("Error al cargar testimonios:", error);
        } finally {
            setLoading(false);
        }
    }, [entityId]);

    const storeTestimonial = async (data, id) => {
        try {
            // El caso de uso ya valida los campos requeridos
            const result = await storeUseCase.execute(data, id);

            if (result.success) {
                await fetchTestimonials(); // Refrescamos la lista
            }
            return result; // Retorna { success, data, errors }
        } catch (error) {
            return { success: false, errors: { form: error.message } };
        }
    };

    const deleteTestimonial = async (id) => {
        try {
            await deleteUseCase.execute(id);
            setTestimonials(prev => prev.filter(t => t.id !== id));
            return true;
        } catch (error) {
            console.error("Error eliminando testimonio", error);
            return false;
        }
    };

    return {
        testimonials,
        loading,
        fetchTestimonials,
        storeTestimonial,
        deleteTestimonial
    };
};