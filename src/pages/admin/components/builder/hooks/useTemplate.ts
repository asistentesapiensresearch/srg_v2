import { useState, useEffect } from 'react';
import { TemplateAmplifyRepository } from '@core/infrastructure/repositories/TemplateAmplifyRepository';
import { FindByArticleId } from '@core/application/caseUses/Template/FindByArticleId';
import { Template } from '@core/domain/repositories/entities';
import { GetTemplates } from '@core/application/caseUses/Template/GetTemplates';
import { Create, FindByInstitutionId, FindByResearchId, Update } from '@core/application/caseUses/Template';

export const useTemplate = () => {

    const [refresh, setRefresh] = useState(0);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(false);
    const repo = new TemplateAmplifyRepository();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const command = new GetTemplates(repo);
                const templatesDB = await command.execute();
                setTemplates(templatesDB);
            } catch (error) {
                console.error("Error fetching templates:", error);
            } finally {
                setLoading(false)
            }
        };
        if (!loading)
            init();
    }, [refresh]);

    const handleSave = async (template: Template, id?: string) => {
        let templatesDB;
        if(id){
            const command = new Update(repo);
            templatesDB = await command.execute(id, template);
        } else {
            const command = new Create(repo);
            templatesDB = await command.execute(template);
        }
        setTemplates(templatesDB);
    };

    const getByArticlenId = async (id:string) => {
        const command = new FindByArticleId(repo);
        return await command.execute(id);
    }

    const getByResearchId = async (id:string) => {
        const command = new FindByResearchId(repo);
        return await command.execute(id);
    }

    const getByInstitutionId = async (id:string) => {
        const command = new FindByInstitutionId(repo);
        return await command.execute(id);
    }

    return {
        refresh,
        loading,
        templates,
        handleSave,
        setRefresh,
        getByResearchId,
        getByArticlenId,
        getByInstitutionId,
    };
};