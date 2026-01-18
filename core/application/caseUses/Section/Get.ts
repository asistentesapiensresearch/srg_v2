import { SectionRepository } from "@core/domain/repositories";

export class Get {
    constructor(private sectionRepo: SectionRepository){}

    async execute(id?:string){
        return await this.sectionRepo.get(id);
    }
}