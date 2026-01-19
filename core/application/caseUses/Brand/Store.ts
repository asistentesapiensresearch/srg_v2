import { BrandRepository } from "@core/domain/repositories";
import { Brand } from "@core/domain/repositories/entities";

export class Store {
    constructor(private logosRepo: BrandRepository){}

    async execute(brand:Brand, id?:string){
        return await this.logosRepo.store(brand, id);
    }
}