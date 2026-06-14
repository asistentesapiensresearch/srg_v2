import { useMemo } from 'react';
import wpData from './query.json'; // O el archivo que contenga ambos tipos
import { useArticle } from '../../Articles/hooks/useArticle';
import { usePage } from '../../Pages/hooks/usePage';
import { useTemplate } from '../../components/builder/hooks/useTemplate';

export const useMigration = () => {
    const { articles, loading: loadingArticles, handleSave: saveArticle } = useArticle();
    const { pages, loading: loadingPages, handleSave: savePage } = usePage();
    const { templates, loading: loadingTemplates, handleSave: saveTemplate, setRefresh: setRefreshTemplates } = useTemplate();

    const items = useMemo(() => {
        const safeArticles = Array.isArray(articles) ? articles : [];
        const safePages = Array.isArray(pages) ? pages : [];
        const safeTemplates = Array.isArray(templates) ? templates : [];

        return (wpData as any[]).map((wp: any) => {
            // Buscamos si existe en Artículos o en Páginas
            const dbArticle = safeArticles.find(a => a.slug === wp.slug);
            const dbPage = safePages.find(p => p.slug === wp.slug);

            // Buscamos el template asociado a cualquiera de los dos
            const dbTemplate = (dbArticle || dbPage)
                ? safeTemplates.find(t =>
                    (dbArticle && t.articleId === dbArticle.id) ||
                    (dbPage && t.pageId === dbPage.id)
                )
                : null;

            return {
                ...wp,
                dbArticle: dbArticle || null,
                dbPage: dbPage || null, // 🔥 Nuevo
                dbTemplate: dbTemplate || null,
                existsInArticles: !!dbArticle,
                existsInPages: !!dbPage,     // 🔥 Nuevo
                existsInTemplates: !!dbTemplate,
            };
        });
    }, [articles, pages, templates]);

    return {
        items,
        loading: loadingArticles || loadingPages || loadingTemplates,
        saveArticle,
        savePage,
        saveTemplate,
        refreshTemplates: () => setRefreshTemplates((prev: number) => prev + 1)
    };
};