import { PageRepository } from "@core/domain/repositories/repositories/PageRepository";

export class FindBySlug {
    constructor(private pageRepo: PageRepository) { }

    async execute(pageSlug: string) {
        return await this.pageRepo.findBySlug(pageSlug);
    }
}