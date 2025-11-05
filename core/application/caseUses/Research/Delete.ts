import { IResearchRepository } from "@core/domain/repositories";

export class Delete {
    constructor(private researchRepo: IResearchRepository){}

    async execute(id:string){
        return await this.researchRepo.delete(id);
    }
}