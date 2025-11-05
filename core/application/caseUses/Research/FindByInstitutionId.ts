import { IResearchRepository } from "@core/domain/repositories";

export class FindByInstitutionId {
    constructor(private researchRepo: IResearchRepository){}

    async execute(id:string){
        return await this.researchRepo.findByInstitutionId(id);
    }
}