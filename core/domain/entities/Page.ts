export class Page {
    public readonly id?: string;
    public title: string;
    public slug: string; // URL amigable: "mi-primer-articulo"
    public summary: string;
    public coverImage?: string;
    public author: string;
    public category: string;
    public content: Record<string, any>; // Aquí guardamos el JSON del Builder
    public isPublished: boolean;
    public publishedAt?: string;

    constructor(props: Page) {
        Object.assign(this, props);
    }
}