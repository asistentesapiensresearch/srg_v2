import { ISectionRepository } from "@core/domain/repositories";

export class GetByResearch {
    constructor(private sectionRepo: ISectionRepository){}

    async execute(researchName:string){
        return await this.sectionRepo.findByResearch(researchName);
    }
}