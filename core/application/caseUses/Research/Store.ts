import { Research } from "@core/domain/repositories/entities";
import { LogosRepository, ResearchRepository } from "@core/domain/repositories";
import { DeleteResearchLogo, CreateResearchLogo, FindByResearchId } from "../Logo";

export class Store {
    constructor(
        private researchRepo: ResearchRepository,
        private logoRepo: LogosRepository
    ) { }

    async execute(research: Research, id?: string) {
        // Validar campos obligatorios
        console.log('research', research)
        if (!research.title?.trim()) {
            throw new Error("El título es obligatorio");
        }

        if (!research.path?.trim()) {
            throw new Error("El path es obligatorio");
        }

        if (!research.shortDescription?.trim() || research.shortDescription === '<p></p>') {
            throw new Error("La descripción corta es obligatoria");
        }

        if (!research.description?.trim() || research.description === '<p></p>') {
            throw new Error("La descripción es obligatoria");
        }

        if (!research.alert?.trim() || research.alert === '<p></p>') {
            throw new Error("La alerta es obligatoria");
        }

        if (!research.dateRange?.trim()) {
            throw new Error("El rango de fechas es obligatorio");
        }

        if (!research.sectionId) {
            throw new Error("La sección es obligatoria");
        }

        if (!research.icon?.trim()) {
            throw new Error("El ícono es obligatorio");
        }

        // Validar formato del path
        const pathRegex = /^[a-z0-9-]+$/;
        if (!pathRegex.test(research.path)) {
            throw new Error("El path solo puede contener letras minúsculas, números y guiones");
        }

        // Verificar que el path no esté duplicado (solo en creación o si cambió en edición)
        if (!id || (id && research.path !== (await this.researchRepo.findById(id))?.path)) {
            const existingResearch = await this.researchRepo.findByPath?.(research.path);
            if (existingResearch) {
                throw new Error(`El path "${research.path}" ya está en uso por otra investigación`);
            }
        }

        // Si se proporciona un ID, es una actualización
        if (id) {
            if (research.logos.length > 0) {
                await this.saveLogos(research, id);
            }
            return await this.researchRepo.store(research, id);
        }

        // Asegurar que version esté inicializada
        if (!research.version) {
            research.version = 1;
        }

        const researchDB = await this.researchRepo.store(research);
        if (research.logos.length > 0) {
            await this.saveLogos(research, researchDB.id);
        }
        return research;
    }

    private async saveLogos(research, id) {
        if (research.logos.length > 0) {
            const getCommand = new FindByResearchId(this.logoRepo);
            const logosDB = await getCommand.execute(id);

            const newLogos = research.logos.filter(b => !logosDB.some(a => a.id === b.id));
            if (newLogos.length > 0) {
                const addCommand = new CreateResearchLogo(this.logoRepo);
                await Promise.all(
                    newLogos.map(logo =>
                        addCommand.execute(id, logo)
                    )
                )
            }

            const removeLogos = logosDB.filter(b => !research.logos.some(a => a.id === b.id));
            if (removeLogos.length > 0) {
                const removeCommand = new DeleteResearchLogo(this.logoRepo);
                await Promise.all(removeLogos.map(logo => {
                    removeCommand.execute(logo.id);
                }))
            }
        }
    }
}