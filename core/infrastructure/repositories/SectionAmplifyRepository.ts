import { SectionRepository } from "@core/domain/repositories";
import { apiSyncService } from "../api/apiSync.service";
import { Section } from "@core/domain/repositories/entities";

export class SectionAmplifyRepository implements SectionRepository {

    async store(section: Section, id?: string) {
        try {
            if (id) {
                const { errors } = await apiSyncService.update('Section', id, section);
                if (errors) {
                    console.log(`Error al actualizar:`, errors);
                    return null;
                }
                return true;
            }
            const { errors, data: newSection } = await apiSyncService.create('Section', section);
            if (errors) {
                console.log(`Error al actualizar:`, errors);
                return null;
            }
            return (newSection as any);
        } catch (error) {
            console.log('Error al actualizar:', error);
            return null;
        }
    }

    async delete(id) {
        try {
            const { errors } = await apiSyncService.delete('Section', id);
            if (errors) {
                console.log('Error al eliminar:', errors);
                return null;
            }
            return true;
        } catch (error) {
            console.log('Error al eliminar:', error);
            return null;
        }
    }

    async get(id?: any): Promise<Section[]> {
        try {
            const { data, errors } = id ? await apiSyncService.query('Section', undefined, {
                id: { eq: id }
            }) : await apiSyncService.get('Section');
            if (errors) {
                console.log('Error al eliminar:', errors);
                return null;
            }
            return (data || []) as Section[];
        } catch (error: any) {
            console.error('Error al obtener investigaciones:', error);
            throw error;
        }
    }
}
