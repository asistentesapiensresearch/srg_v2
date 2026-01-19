import { ResearchRepository } from "@core/domain/repositories";

export class Delete {
    constructor(private researchRepo: ResearchRepository){}

    async execute(id:string){
        return await this.researchRepo.delete(id);
    }
}