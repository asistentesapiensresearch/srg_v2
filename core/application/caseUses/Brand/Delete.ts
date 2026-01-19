import { BrandRepository } from "@core/domain/repositories";

export class Delete {
    constructor(private brandRepo: BrandRepository){}

    async execute(id:string){
        return await this.brandRepo.delete(id);
    }
}