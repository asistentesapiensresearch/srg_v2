import { TemplateRepository } from "@core/domain/repositories";

export class FindByPageId {
    constructor(private templateRepo: TemplateRepository) { }

    async execute(pageId: string) {
        if (!pageId) {
            throw new Error("El campo pageId es obligatorio");
        }
        return await this.templateRepo.getByPageId(pageId);
    }
}