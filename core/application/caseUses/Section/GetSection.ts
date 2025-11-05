import { ISectionRepository } from "@core/domain/repositories";

export class GetSection {
    constructor(private sectionRepo: ISectionRepository){}

    async execute(id:string){
        return await this.sectionRepo.findById(id);
    }
}