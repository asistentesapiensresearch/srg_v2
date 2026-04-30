// core/infrastructure/repositories/TemplateAmplifyRepository.ts
import { GoogleAd } from "@core/domain/repositories/entities";
import { apiSyncService } from "../api/apiSync.service";

export class GoogleAdAmplifyRepository {

    async get(filters?: any): Promise<any[]> {
        try {
            const data = await apiSyncService.get('GoogleAd', undefined, filters);
            return (data || []) as GoogleAd[];
        } catch (error) {
            console.error('Error al obtener la lista de GoogleAd:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<GoogleAd> {
        try {
            const data = await apiSyncService.getById('GoogleAd', id);
            return (data || []) as GoogleAd;
        } catch (error) {
            console.error('Error al obtener la lista de GoogleAd:', error);
            throw error;
        }
    }

    async create(googleAd: any) {
        try {
            const data = await apiSyncService.create('GoogleAd', googleAd);
            return data as GoogleAd;
        } catch (error) {
            console.error('Error al crear GoogleAd:', error);
            throw error;
        }
    }

    async update(id: string, googleAd: any) {
        try {
            await apiSyncService.update('Template', id, googleAd);
            return true;
        } catch (error) {
            console.error('Error al actualizar GoogleAd:', error);
            throw error;
        }
    }

    async delete(id: string) {
        try {
            const { data, errors } = await apiSyncService.delete('GoogleAd', id);
            if (errors) throw new Error(errors[0].message);
            return data;
        } catch (error) {
            console.error("Error deleting GoogleAd:", error);
            throw error;
        }
    }


}