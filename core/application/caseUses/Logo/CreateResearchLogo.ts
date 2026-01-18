import { LogosRepository } from "@core/domain/repositories";

export class CreateResearchLogo {
    constructor(private logosRepo: LogosRepository){}

    async execute(researchId:string, logoId:string){
        return await this.logosRepo.createResearchLogo(researchId, logoId);
    }
}