// core/infrastructure/repositories/TemplateAmplifyRepository.ts
import { TemplateRepository } from "@core/domain/repositories";
import { apiSyncService } from "../api/apiSync.service";
import { Template } from "@core/domain/repositories/entities";

export class TemplateAmplifyRepository implements TemplateRepository {

    async create(template: Template) {
        try {
            const data = await apiSyncService.create('Template', template);
            return data as Template;
        } catch (error) {
            console.error('Error al crear template:', error);
            throw error;
        }
    }

    async update(id: string, template: Template) {
        try {
            await apiSyncService.update('Template', id, template);
            return true;
        } catch (error) {
            console.error('Error al actualizar template:', error);
            throw error;
        }
    }

    async getByResearchId(researchId: string): Promise<Template | null> {
        try {
            const { data, errors } = await apiSyncService.query(
                'Template',
                'listTemplateByResearchId',
                { researchId }
            );

            if (errors && errors.length) {
                console.error('Error al buscar template:', errors);
                return null;
            }

            if (data && data.length > 0) {
                return data[0] as Template;
            }

            return null;
        } catch (error: any) {
            console.error('Error al buscar template por researchId:', error);
            return null;
        }
    }
}