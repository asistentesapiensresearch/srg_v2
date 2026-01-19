import { BrandRepository } from "@core/domain/repositories";

export class CreateResearchBrand {
    constructor(private brandsRepo: BrandRepository){}

    async execute(researchId:string, brandId:string){
        return await this.brandsRepo.createResearchBrand(researchId, brandId);
    }
}