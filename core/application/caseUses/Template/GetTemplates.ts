import { TemplateRepository } from "@core/domain/repositories";

export class GetTemplates {
    constructor(private templateRepo: TemplateRepository) { }

    async execute(filters?: any) {
        if (filters) {
            return await this.templateRepo.get(filters);
        }
        return await this.templateRepo.get();
    }
}