import { ArticleRepository } from "@core/domain/repositories/repositories/ArticleRepository";

export class GetArticles {
    constructor(private articleRepo: ArticleRepository) { }

    async execute(filters?: any) {
        if (filters) {
            return await this.articleRepo.get(filters);
        }
        return await this.articleRepo.get();
    }
}