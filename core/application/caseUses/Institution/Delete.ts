import { IInstitutionRepository } from "@core/domain/repositories";

export class Delete {
    constructor(private institutionRepo: IInstitutionRepository){}

    async execute(id:string){
        return await this.institutionRepo.delete(id);
    }
}