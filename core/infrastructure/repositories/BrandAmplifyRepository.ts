import { BrandRepository } from "@core/domain/repositories";
import { apiSyncService } from "../api/apiSync.service";
import { Brand } from "@core/domain/repositories/entities";

export class BrandAmplifyRepository implements BrandRepository {

    async store(brand: Brand, id?: string) {
        try {
            let newBrand;
            let errors:any = {}

            if (!brand.name.trim()) {
                errors.name = "El nombre es obligatorio.";
            }
            if (!brand.link.trim()) {
                errors.link = "El link es obligatorio.";
            }
            // Validamos que haya un ícono (ya sea uno existente o uno nuevo)
            if (!brand.key) {
                errors.icon = "Debe subir un ícono.";
            }

            if (Object.keys(errors).length > 0) {
                console.log('Error al actualizar:', errors);
                return { errors };
            }

            if (!id) {
                const { errors, data } = await apiSyncService.create('Brand', brand) as any;
                newBrand = data;
            } else {
                await apiSyncService.update('Brand', id, brand) as any;
            }
            return ({ brand: brand || newBrand } as any);
        } catch (error) {
            console.log('Error al actualizar:', error);
            return null;
        }
    }

    async delete(id) {
        try {
            const { data: deletedTodo, errors } = await apiSyncService.delete('Brand', id);
            if (errors) {
                console.log('Error al actualizar:', errors);
                return null;
            }
            return true;
        } catch (error) {
            console.log('Error al actualizar:', error);
            return null;
        }
    }

    async createResearchBrand(researchId: string, brandId: string) {
        try {
            const { errors, data: newBrand } = await apiSyncService.create('ResearchBrand', { researchId, brandId });
            if (errors) {
                console.log('Error al crear:', errors);
                return null;
            }
            return (newBrand as any);
        } catch (error) {
            console.log('Error al crear:', error);
            return null;
        }
    }

    async deleteResearchBrand(id: string) {
        const { data: deletedTodo, errors } = await apiSyncService.delete('ResearchBrand', id);
        if (errors) {
            console.log('Error al eliminar:', errors);
            return null;
        }
        return true;
    }

    async findByResearchId(researchId: string) {
        const { data: brands } = await apiSyncService.query('ResearchBrand', 'listBrandByResearchId', { researchId });
        return brands;
    }
    async findByBrandId(brandId: string) {
        const { data: brands } = await apiSyncService.query('ResearchBrand', 'listBrandByBrandId', { brandId });
        return brands;
    }
}
