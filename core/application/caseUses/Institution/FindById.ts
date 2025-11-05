import { IInstitutionRepository } from "@core/domain/repositories";

export class FindById {
    constructor(private institutionRepo: IInstitutionRepository){}

    async execute(id:string){
        return await this.institutionRepo.findById(id);
    }
}