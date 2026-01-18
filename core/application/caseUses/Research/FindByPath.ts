import { ResearchRepository } from "@core/domain/repositories";

export class FindById {
    constructor(private researchRepo: ResearchRepository){}

    async execute(id:string){
        if(!id){
            throw new Error("El campo ID es obligatorio");
        }
        return await this.researchRepo.findById(id);
    }
}