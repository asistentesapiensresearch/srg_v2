import { useMemo } from 'react';
import wpArticlesData from './query.json';      // Tu JSON de artículos
import wpPagesData from './pages.json';         // Tu nuevo JSON limpio de páginas

import { useArticle } from '../../Articles/hooks/useArticle';
import { usePage } from '../../Pages/hooks/usePage';
import { useTemplate } from '../../components/builder/hooks/useTemplate';

export const useMigration = (type = 'article') => {
    const { articles, loading: loadingArticles, handleSave: saveArticle } = useArticle();
    const { pages, loading: loadingPages, handleSave: savePage } = usePage();
    const { templates, loading: loadingTemplates, handleSave: saveTemplate, setRefresh: setRefreshTemplates } = useTemplate();

    const items = useMemo(() => {
        const safeArticles = Array.isArray(articles) ? articles : [];
        const safePages = Array.isArray(pages) ? pages : [];
        const safeTemplates = Array.isArray(templates) ? templates : [];

        // 🔥 SELECCIÓN DINÁMICA DEL JSON
        const wpDataToProcess = type === 'page' ? wpPagesData : wpArticlesData;

        return (wpDataToProcess as any[]).map((wp) => {
            const dbArticle = safeArticles.find(a => a.slug === wp.slug);
            const dbPage = safePages.find(p => p.slug === wp.slug);

            // Vinculamos el template si existe para este artículo O para esta página
            const dbTemplate = (dbArticle || dbPage)
                ? safeTemplates.find(t =>
                    (dbArticle && t.articleId === dbArticle.id) ||
                    (dbPage && t.pageId === dbPage.id)
                )
                : null;

            return {
                ...wp,
                dbArticle: dbArticle || null,
                dbPage: dbPage || null,
                dbTemplate: dbTemplate || null,
                existsInArticles: !!dbArticle,
                existsInPages: !!dbPage,
                existsInTemplates: !!dbTemplate,
            };
        });
    }, [articles, pages, templates, type]);

    return {
        items,
        loading: loadingArticles || loadingPages || loadingTemplates,
        saveArticle,
        savePage,
        saveTemplate,
        refreshTemplates: () => setRefreshTemplates((prev) => prev + 1)
    };
};