import { useState, useCallback } from 'react';
import { GalleryAmplifyRepository } from '@core/infrastructure/repositories/GalleryAmplifyRepository';
// Si creaste los Casos de Uso (StoreGalleryUseCase, etc.), instáncialos aquí.
// Por simplicidad, aquí llamaremos directamente al repositorio, que ya está limpio.

export const useGalleries = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(false);

    // Instanciamos el repositorio de infraestructura
    const repository = new GalleryAmplifyRepository();

    const fetchGalleries = useCallback(async () => {
        setLoading(true);
        try {
            const data = await repository.findAll();
            setGalleries(data || []);
        } catch (error) {
            console.error("Error al cargar galerías:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const storeGallery = async (galleryData, id) => {
        try {
            const savedGallery = await repository.store(galleryData, id);
            await fetchGalleries(); // Refrescamos la lista tras guardar
            return { success: true, gallery: savedGallery };
        } catch (error) {
            console.error("Error al guardar galería:", error);
            return { success: false, errors: { form: error.message } };
        }
    };

    const deleteGallery = async (id) => {
        try {
            await repository.delete(id);
            setGalleries(prev => prev.filter(g => g.id !== id));
            return true;
        } catch (error) {
            console.error("Error al eliminar galería:", error);
            return false;
        }
    };

    return {
        galleries,
        loading,
        fetchGalleries,
        storeGallery,
        deleteGallery
    };
};