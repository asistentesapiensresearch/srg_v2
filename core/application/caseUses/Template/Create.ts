// core/application/caseUses/Template/Create.ts
import { TemplateRepository } from "@core/domain/repositories";
import { Template } from "@core/domain/repositories/entities";

export class Create {
    constructor(private templateRepo: TemplateRepository){}

    async execute(template:Template){
        return await this.templateRepo.create(template);
    }
}