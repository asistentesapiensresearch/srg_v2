// core/application/caseUses/Template/FindByInstitutionId.ts
import { TemplateRepository } from "@core/domain/repositories";

export class FindByInstitutionId {
    constructor(private templateRepo: TemplateRepository) { }

    async execute(institutionId: string) {
        if (!institutionId) {
            throw new Error("El campo institutionId es obligatorio");
        }
        return await this.templateRepo.getByInstitutionId(institutionId);
    }
}