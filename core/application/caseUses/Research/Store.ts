import { Research } from "@core/domain/repositories/entities";
import { BrandRepository, ResearchRepository } from "@core/domain/repositories";
import { DeleteResearchBrand, CreateResearchBrand, FindByResearchId } from "../Brand";

export class Store {
    constructor(
        private researchRepo: ResearchRepository,
        private brandRepo: BrandRepository
    ) { }

    async execute(research: Research, id?: string) {
        // Validar campos obligatorios
        const newErrors: any = {};

        if (!research.title.trim()) newErrors.title = "El título es obligatorio.";
        if (!research.path.trim()) {
            newErrors.path = "El path es obligatorio.";
        } else if (!/^[a-z0-9-]+$/.test(research.path)) {
            newErrors.path = "El path solo puede contener letras minúsculas, números y guiones.";
        }
        if (!research.description?.trim() || research.description === '<p></p>') {
            newErrors.description = "La descripción es obligatoria.";
        }
        if (!research.dateRange.trim()) newErrors.dateRange = "El rango de fechas es obligatorio.";
        if (!research.category) newErrors.category = "Debe seleccionar una categoría.";
        if (!research.subCategory) newErrors.subCategory = "Debe seleccionar una subcategoría.";
        if (!research.icon) newErrors.icon = "Debe subir un ícono.";

        // Validar formato del path
        const pathRegex = /^[a-z0-9-]+$/;
        if (!pathRegex.test(research.path)) {
            newErrors.path = "El path solo puede contener letras minúsculas, números y guiones";
        }

        // Verificar que el path no esté duplicado (solo en creación o si cambió en edición)
        if (!id || (id && research.path !== (await this.researchRepo.findById(id))?.path)) {
            const existingResearch = await this.researchRepo.findByPath?.(research.path);
            if (existingResearch) {
                newErrors.path = `El path "${research.path}" ya está en uso por otra investigación`;
            }
        }

        if(Object.keys(newErrors).length > 0){
            return { error: newErrors };
        }

        // Si se proporciona un ID, es una actualización
        if (id) {
            if (research.brands.length > 0) {
                await this.saveBrand(research, id);
            }
            return await this.researchRepo.store(research, id);
        }

        // Asegurar que version esté inicializada
        if (!research.version) {
            research.version = 1;
        }

        const researchDB = await this.researchRepo.store(research);
        if (research.brands.length > 0) {
            await this.saveBrand(research, researchDB.id);
        }
        return { research };
    }

    private async saveBrand(research, id) {
        if (research.brands.length > 0) {
            const getCommand = new FindByResearchId(this.brandRepo);
            const brandDB = await getCommand.execute(id);

            const newBrand = research.brands.filter(b => !brandDB.some(a => a.id === b.id));
            if (newBrand.length > 0) {
                const addCommand = new CreateResearchBrand(this.brandRepo);
                await Promise.all(
                    newBrand.map(brand =>
                        addCommand.execute(id, brand)
                    )
                )
            }

            const removeBrand = brandDB.filter(b => !research.brands.some(a => a.id === b.id));
            if (removeBrand.length > 0) {
                const removeCommand = new DeleteResearchBrand(this.brandRepo);
                await Promise.all(removeBrand.map(brand => {
                    removeCommand.execute(brand.id);
                }))
            }
        }
    }
}