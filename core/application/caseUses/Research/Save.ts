import { Research } from "@core/domain/entities";
import { IResearchRepository } from "@core/domain/repositories";

export class Save {
    constructor(private researchRepo: IResearchRepository){}

    async execute(research:Research){
        return await this.researchRepo.save(research);
    }
}