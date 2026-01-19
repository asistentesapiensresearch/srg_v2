import { BrandRepository } from "@core/domain/repositories";

export class DeleteResearchBrand {
    constructor(private brandsRepo: BrandRepository){}

    async execute(id:string){
        return await this.brandsRepo.deleteResearchBrand(id);
    }
}