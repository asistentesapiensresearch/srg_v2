import { Section } from "@core/domain/repositories/entities";
import { SectionRepository } from "@core/domain/repositories";

export class Store {
    constructor(private sectionRepo: SectionRepository){}

    async execute(section:Section, id?:string){
        return await this.sectionRepo.store(section, id);
    }
}