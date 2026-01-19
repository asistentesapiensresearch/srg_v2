import { BrandRepository } from "@core/domain/repositories";

export class FindByResearchId {
    constructor(private brandRepo: BrandRepository){}

    async execute(researchId:string){
        return await this.brandRepo.findByResearchId(researchId);
    }
}