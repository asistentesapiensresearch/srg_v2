import { Institution } from "@core/domain/entities";
import { IInstitutionRepository } from "@core/domain/repositories";

export class Save {
    constructor(private institutionRepo: IInstitutionRepository){}

    async execute(institution:Institution){
        return await this.institutionRepo.save(institution);
    }
}