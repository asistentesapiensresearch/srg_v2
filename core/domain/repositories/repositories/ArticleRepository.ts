import { Article } from "@core/domain/entities/Article";

export interface ArticleRepository {
    get(filters?: any): Promise<Article[]>;
    store(article: Article, id?: string): Promise<Article>;
    findBySlug(slug: string): Promise<Article | null>;
    delete(id: string): Promise<boolean>;
}