import { ISectionRepository } from "@core/domain/repositories";

export class Delete {
    constructor(private sectionRepo: ISectionRepository){}

    async execute(id:string){
        return await this.sectionRepo.delete(id);
    }
}