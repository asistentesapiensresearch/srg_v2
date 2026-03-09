import { apiSyncService } from "../api/apiSync.service";

export class InstitutionAmplifyRepository {

    // Método para CREAR
    async create(institutionData: any) {
        try {
            if (institutionData.id) {
                const { data, errors } = await apiSyncService.update('Institution', institutionData.id, institutionData);
                if (errors) throw new Error(errors[0].message);
                return data;
            }
            const { data, errors } = await apiSyncService.create('Institution', institutionData);
            if (errors) throw new Error(errors[0].message);
            return data;
        } catch (error) {
            console.error("Error creating institution:", error);
            throw error;
        }
    }

    // Método para LISTAR (Este es el que te faltaba conectar)
    async list() {
        try {
            return await apiSyncService.get('Institution');
        } catch (error) {
            console.error("Error listing institutions:", error);
            throw error;
        }
    }

    // Método para ELIMINAR
    async delete(id: string) {
        try {
            const { data, errors } = await apiSyncService.delete('Institution', id);
            if (errors) throw new Error(errors[0].message);
            return data;
        } catch (error) {
            console.error("Error deleting institution:", error);
            throw error;
        }
    }
}