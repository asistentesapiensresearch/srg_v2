// core/application/caseUses/Template/Update.ts
import { TemplateRepository } from "@core/domain/repositories";
import { Template } from "@core/domain/repositories/entities";

export class Update {
    constructor(private templateRepo: TemplateRepository){}

    async execute(id:string, data:Template){
        return await this.templateRepo.update(id, data);
    }
}