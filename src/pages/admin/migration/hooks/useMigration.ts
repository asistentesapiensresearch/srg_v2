import { useMemo } from 'react';
import wpData from './query.json';
import { useArticle } from '../../Articles/hooks/useArticle';
import { useTemplate } from '../../components/builder/hooks/useTemplate';

export const useMigration = () => {
    const { articles, loading: loadingArticles, handleSave: saveArticle } = useArticle();
    const { templates, loading: loadingTemplates, handleSave: saveTemplate, setRefresh: setRefreshTemplates } = useTemplate();

    const items = useMemo(() => {
        // Validación de seguridad: Nos aseguramos de que sean arreglos antes de procesar
        const safeArticles = Array.isArray(articles) ? articles : [];
        const safeTemplates = Array.isArray(templates) ? templates : [];

        return (wpData as any[]).map((wp: any) => {
            // Buscamos el artículo por slug
            const dbArticle = safeArticles.find(a => a.slug === wp.slug);

            // Buscamos el template asociado al ID del artículo encontrado
            const dbTemplate = dbArticle
                ? safeTemplates.find(t => t.articleId === dbArticle.id)
                : null;

            return {
                ...wp,
                dbArticle: dbArticle || null,
                dbTemplate: dbTemplate || null,
                existsInArticles: !!dbArticle,
                existsInTemplates: !!dbTemplate,
            };
        });
    }, [articles, templates]); // React detectará cambios cuando las listas se actualicen

    return {
        items,
        loading: loadingArticles || loadingTemplates,
        saveArticle,
        saveTemplate,
        refreshTemplates: () => setRefreshTemplates((prev: number) => prev + 1)
    };
};