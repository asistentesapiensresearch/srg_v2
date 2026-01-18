import { ResearchRepository } from "@core/domain/repositories";

export class Get {
    constructor(private researchRepo: ResearchRepository) { }

    async execute(filters?: any) {
        if (filters) {
            return await this.researchRepo.get(filters);
        }
        return await this.researchRepo.get();
    }
}