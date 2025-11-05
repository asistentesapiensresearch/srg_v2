import { IResearchRepository } from "@core/domain/repositories";

export class FindById {
    constructor(private researchRepo: IResearchRepository){}

    async execute(id:string){
        return await this.researchRepo.findById(id);
    }
}