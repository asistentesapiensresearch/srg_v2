import { Section } from "@core/domain/entities";
import { ISectionRepository } from "@core/domain/repositories";

export class Save {
    constructor(private sectionRepo: ISectionRepository){}

    async execute(section:Section){
        return await this.sectionRepo.save(section);
    }
}