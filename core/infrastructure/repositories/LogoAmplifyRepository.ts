import { LogosRepository } from "@core/domain/repositories";
import { apiSyncService } from "../api/apiSync.service";
import { Logo } from "@core/domain/repositories/entities";

export class LogoAmplifyRepository implements LogosRepository {

    async update(id: string, logo: Logo) {
        const { errors } = await apiSyncService.update('Logo', id, logo);
        if (errors) {
            console.log('Error al actualizar:', errors);
            return null;
        }
        return true;
    }

    async create(logo: Logo) {
        try {
            const { errors, data: newLogo } = await apiSyncService.create('Logo', logo);
            if (errors) {
                console.log('Error al actualizar:', errors);
                return null;
            }
            return (newLogo as any);
        } catch (error) {
            console.log('Error al actualizar:', error);
            return null;
        }
    }

    async delete(id) {
        try {
            const { data: deletedTodo, errors } = await apiSyncService.delete('Logo', id);
            if (errors) {
                console.log('Error al actualizar:', errors);
                return null;
            }
            return true;
        } catch (error) {
            console.log('Error al actualizar:', error);
            return null;
        }
    }

    async createResearchLogo(researchId: string, logoId: string) {
        try {
            const { errors, data: newLogo } = await apiSyncService.create('ResearchLogo', { researchId, logoId });
            if (errors) {
                console.log('Error al crear:', errors);
                return null;
            }
            return (newLogo as any);
        } catch (error) {
            console.log('Error al crear:', error);
            return null;
        }
    }

    async deleteResearchLogo(id: string) {
        const { data: deletedTodo, errors } = await apiSyncService.delete('ResearchLogo', id);
        if (errors) {
            console.log('Error al eliminar:', errors);
            return null;
        }
        return true;
    }

    async findByResearchId(researchId: string) {
        const { data: logos } = await apiSyncService.query('ResearchLogo', 'listLogoByResearchId', { researchId });
        return logos;
    }
    async findByLogoId(logoId: string) {
        const { data: logos } = await apiSyncService.query('ResearchLogo', 'listLogoByLogoId', { logoId });
        return logos;
    }
}
