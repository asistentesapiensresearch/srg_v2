import { PageRepository } from "@core/domain/repositories/repositories/PageRepository";

export class GetPages {
    constructor(private pageRepo: PageRepository) { }

    async execute(filters?: any) {
        if (filters) {
            return await this.pageRepo.get(filters);
        }
        return await this.pageRepo.get();
    }
}