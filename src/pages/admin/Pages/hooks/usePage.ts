import { useState, useCallback, useEffect } from 'react';
import { PageAmplifyRepository } from "@core/infrastructure/repositories/PageAmplifyRepository";
import { Page } from "@core/domain/entities/Page";
import { GetPages } from '@core/application/caseUses/Page/GetPages';
import { TemplateAmplifyRepository } from '@core/infrastructure/repositories/TemplateAmplifyRepository';
import { FindByPageId } from '@core/application/caseUses/Template/FindByPageId';

export const usePage = () => {

    const [refresh, setRefresh] = useState(0);
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(false);
    const repo = new PageAmplifyRepository();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const command = new GetPages(repo);
                const pagesDB = await command.execute();
                setPages(pagesDB);
            } catch (error) {
                console.error("Error fetching Pages:", error);
            } finally {
                setLoading(false)
            }
        };
        if (!loading)
            init();
    }, [refresh]);

    const getTemplate = async (pageId) => {
        const templateRepo = new TemplateAmplifyRepository();
        return await (new FindByPageId(templateRepo)).execute(pageId);
    }

    const handleSave = async (page: Page, id?: string) => {
        setLoading(true);
        try {
            const result = await repo.store(page, id);
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
            setPages(prev => prev.filter(a => a.id !== id));
        }
        return success;
    };

    return {
        refresh,
        setRefresh,
        pages,
        loading,
        handleSave,
        getTemplate,
        handleDelete,
    };
};