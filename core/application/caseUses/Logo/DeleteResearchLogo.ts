import { LogosRepository } from "@core/domain/repositories";

export class DeleteResearchLogo {
    constructor(private logosRepo: LogosRepository){}

    async execute(id:string){
        return await this.logosRepo.deleteResearchLogo(id);
    }
}