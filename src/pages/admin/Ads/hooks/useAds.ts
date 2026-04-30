import { GoogleAdAmplifyRepository } from '@core/infrastructure/repositories/GoogleAdAmplifyRepository';
import { useState, useEffect, useCallback } from 'react';

const googleAdRepository = new GoogleAdAmplifyRepository();

export const useAds = () => {

    const [googleAds, setGoogleAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGoogleAds = useCallback(async () => {
        setLoading(true);
        setError(null);
    
        try {
            const data = await googleAdRepository.get();
            setGoogleAds(data || []);
        } catch (err) {
            console.error(err);
            setError(err?.message || 'Error cargando anuncios');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGoogleAd = async (googleAdId) => {
        setLoading(true);
        setError(null);
    
        try {
            return await googleAdRepository.findById(googleAdId);
        } catch (err) {
            console.error(err);
            setError(err?.message || 'Error obteniendo anuncio');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createGoogleAd = async (data) => {
        setLoading(true);
        setError(null);
    
        try {
            const newGoogleAd = await googleAdRepository.create(data);
    
            if (newGoogleAd) {
            setGoogleAds((prev) => [newGoogleAd, ...prev]);
            }
    
            return true;
        } catch (err) {
            console.error(err);
            setError(err?.message || 'Error creando anuncio');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateGoogleAd = async (id, data) => {
        setLoading(true);
        setError(null);
    
        try {
            const updatedGoogleAd = await googleAdRepository.update(id, data);
    
            setGoogleAds((prev) =>
            prev.map((ad) =>
                ad.id === id
                ? { ...ad, ...(updatedGoogleAd || data) }
                : ad
            )
            );
    
            return true;
        } catch (err) {
            console.error(err);
            setError(err?.message || 'Error actualizando anuncio');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteGoogleAd = async (id) => {
        setLoading(true);
        setError(null);
    
        try {
            await googleAdRepository.delete(id);
    
            setGoogleAds((prev) => prev.filter((ad) => ad.id !== id));
    
            return true;
        } catch (err) {
            console.error(err);
            setError(err?.message || 'Error eliminando anuncio');
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoogleAds();
    }, [fetchGoogleAds]);

    return {
        googleAds,
        setGoogleAds,
        loading,
        error,
        fetchGoogleAds,
        getGoogleAd,
        createGoogleAd,
        deleteGoogleAd,
        updateGoogleAd,
    };
};