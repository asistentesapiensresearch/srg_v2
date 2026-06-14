import { Page } from "@core/domain/entities/Page";

export interface PageRepository {
    get(filters?: any): Promise<Page[]>;
    store(page: Page, id?: string): Promise<Page>;
    findBySlug(slug: string): Promise<Page | null>;
    delete(id: string): Promise<boolean>;
}