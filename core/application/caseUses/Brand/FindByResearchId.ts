import { LogosRepository } from "@core/domain/repositories";

export class FindByResearchId {
    constructor(private logosRepo: LogosRepository){}

    async execute(researchId:string){
        return await this.logosRepo.findByResearchId(researchId);
    }
}