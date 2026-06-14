import { Page } from "@core/domain/entities/Page";
import { PageRepository } from "@core/domain/repositories/repositories/PageRepository";

export class StorePageUseCase {
    constructor(private pageRepo: PageRepository) { }

    async execute(input: Page, id?: string): Promise<Page> {
        input.slug = input.slug.toLowerCase().replace(/\s+/g, '-');
        if (!input.title.trim()) throw new Error("El título es obligatorio.");
        return await this.pageRepo.store(input, id);
    }
}