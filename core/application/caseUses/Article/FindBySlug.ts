import { ArticleRepository } from "@core/domain/repositories/repositories/ArticleRepository";

export class FindBySlug {
    constructor(private articleRepo: ArticleRepository) { }

    async execute(articleSlug: string) {
        return await this.articleRepo.findBySlug(articleSlug);
    }
}