// core/application/caseUses/Template/FindByResearchId.ts
import { TemplateRepository } from "@core/domain/repositories";

export class FindByResearchId {
    constructor(private templateRepo: TemplateRepository){}

    async execute(researchId: string){
        if(!researchId){
            throw new Error("El campo researchId es obligatorio");
        }
        return await this.templateRepo.getByResearchId(researchId);
    }
}