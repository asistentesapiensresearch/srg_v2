import { InstitutionRepository } from "@core/domain/repositories";
import { apiSyncService } from "../api/apiSync.service";
import { Institution } from "@core/domain/repositories/entities";

export class InstitutionAmplifyRepository implements InstitutionRepository {

    async findById(id: string) {
        const { data: Institutions } = await apiSyncService.query('Institution', 'listInstitutionById', { id });
        return Institutions[0];
    }

    async findAll(limit: number, filter: any) {
        return (await apiSyncService.get('Institution', limit, filter) as any);
    }

    async create(institution: Institution) {
        try {
            const { errors, data: newInstitution } = await apiSyncService.create('Institution', institution);
            if (errors) {
                console.log('Error al crear:', errors);
                return null;
            }
            return (newInstitution as any);
        } catch (error) {
            console.log('Error al crear:', error);
            return null;
        }
    }

    update(id: string, institution: Institution): Promise<boolean>;
    delete(id: string): Promise<void>;

    async findByName(name: string) {
        const { data: logos } = await apiSyncService.query('Logo', 'listLogoByName', { name });
        return logos[0];
    }

    async update(id: string, template: Template) {
        const { errors } = await apiSyncService.update('Template', id, template);
        if (errors) {
            console.log('Error al actualizar:', errors);
            return null;
        }
        return true;
    }
}