// src/hooks/useResearchs.ts
import { useEffect, useState } from "react";
import { ResearchAmplifyRepository } from "@core/infrastructure/repositories/ResearchAmplifyRepository";
import { TemplateAmplifyRepository } from "@core/infrastructure/repositories/TemplateAmplifyRepository";
import { Delete, Get, Store } from "@core/application/caseUses/Research";
import { Create as CreateTemplate, FindByResearchId, Update as UpdateTemplate } from "@core/application/caseUses/Template";
import { FindByResearchId as FindLogoByResearchId } from "@core/application/caseUses/Logo";
import { Logo, Research, Template } from "@core/domain/repositories/entities";
import { LogoAmplifyRepository } from "@core/infrastructure/repositories/LogoAmplifyRepository";

export function useResearchs() {
    const researchRepository = new ResearchAmplifyRepository();
    const templateRepository = new TemplateAmplifyRepository();
    const logosRepository = new LogoAmplifyRepository();
    const [loading, setLoading] = useState(false);
    const [researchs, setResearchs] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const command = new Get(researchRepository);
                const researchsDB = (await command.execute() as any[]);
                if (researchsDB.length > 0) {
                    const getLogos = new FindLogoByResearchId(logosRepository);
                    const newResearch = await Promise.all(
                        researchsDB.map(async (r) => {
                            const logos = await getLogos.execute(r.id);
                            return {
                                ...r,
                                logosResearch: await Promise.all(
                                    logos.map(async (l:any) => ({
                                        ...l,
                                        logo: (await l.logo()).data
                                    }))
                                )
                            }
                        })
                    )
                    console.log('newResearch',newResearch)
                    setResearchs(newResearch.sort((a, b) => a.index - b.index));
                }
            } catch (error) {
                console.error("Error fetching researchs:", error);
            } finally {
                setLoading(false);
            }
        };
        if (!loading) init();
    }, [refresh]);

    const getTemplate = async (researchId: string) => {
        const command = new FindByResearchId(templateRepository);
        return await command.execute(researchId);
    }

    const storeResearch = async (research: Research, id?: string) => {
        const command = new Store(researchRepository, logosRepository);
        return await command.execute(research, id);
    }

    const deleteResearch = async (id: string) => {
        const command = new Delete(researchRepository);
        await command.execute(id);
    }

    const createTemplate = async (template: Template) => {
        const command = new CreateTemplate(templateRepository);
        return await command.execute(template);
    }

    const updateTemplate = async (id: string, template: Template) => {
        const command = new UpdateTemplate(templateRepository);
        return await command.execute(id, template);
    }

    return {
        loading,
        researchs,
        setRefresh,
        getTemplate,
        setResearchs,
        storeResearch,
        deleteResearch,
        createTemplate,
        updateTemplate,
    };
}