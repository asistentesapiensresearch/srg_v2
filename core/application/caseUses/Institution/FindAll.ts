import { IInstitutionRepository } from "@core/domain/repositories";

export class FindAll {
    constructor(private institutionRepo: IInstitutionRepository){}

    async execute(){
        return await this.institutionRepo.findAll();
    }
}