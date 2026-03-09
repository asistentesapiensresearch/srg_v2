import { Article } from "@core/domain/entities/Article";
import { ArticleRepository } from "@core/domain/repositories/repositories/ArticleRepository";

export class StoreArticleUseCase {
    constructor(private articleRepo: ArticleRepository) { }

    async execute(input: Article, id?: string): Promise<Article> {
        // Validación: El slug no puede tener espacios
        input.slug = input.slug.toLowerCase().replace(/\s+/g, '-');

        if (!input.title.trim()) throw new Error("El título es obligatorio.");

        return await this.articleRepo.store(input, id);
    }
}