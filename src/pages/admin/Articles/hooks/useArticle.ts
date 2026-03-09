import { useState, useCallback, useEffect } from 'react';
import { ArticleAmplifyRepository } from "@core/infrastructure/repositories/ArticleAmplifyRepository";
import { Article } from "@core/domain/entities/Article";
import { GetArticles } from '@core/application/caseUses/Article/GetArticles';
import { TemplateAmplifyRepository } from '@core/infrastructure/repositories/TemplateAmplifyRepository';
import { FindByArticleId } from '@core/application/caseUses/Template/FindByArticleId';

export const useArticle = () => {

    const [refresh, setRefresh] = useState(0);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const repo = new ArticleAmplifyRepository();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const command = new GetArticles(repo);
                const articlesDB = await command.execute();
                setArticles(articlesDB);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false)
            }
        };
        if (!loading)
            init();
    }, [refresh]);

    const getTemplate = async (articleId) => {
        const templateRepo = new TemplateAmplifyRepository();
        return await (new FindByArticleId(templateRepo)).execute(articleId);
    }

    const handleSave = async (article: Article, id?: string) => {
        setLoading(true);
        try {
            const result = await repo.store(article, id);
            if (result && !result.errors) {
                setRefresh(r => r + 1);
            }
            return result;
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const success = await repo.delete(id);
        if (success) {
            setArticles(prev => prev.filter(a => a.id !== id));
        }
        return success;
    };

    return {
        refresh,
        setRefresh,
        articles,
        loading,
        handleSave,
        getTemplate,
        handleDelete,
    };
};