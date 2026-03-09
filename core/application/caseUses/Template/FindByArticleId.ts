// core/application/caseUses/Template/FindByArticleId.ts
import { TemplateRepository } from "@core/domain/repositories";

export class FindByArticleId {
    constructor(private templateRepo: TemplateRepository) { }

    async execute(articleId: string) {
        if (!articleId) {
            throw new Error("El campo articleId es obligatorio");
        }
        return await this.templateRepo.getByArticlenId(articleId);
    }
}