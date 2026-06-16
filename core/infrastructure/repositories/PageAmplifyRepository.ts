import { PageRepository } from "@core/domain/repositories/repositories/PageRepository";
import { apiSyncService } from "../api/apiSync.service";
import { Page } from "@core/domain/entities/Page";

export class PageAmplifyRepository implements PageRepository {

    async store(page: Page, id?: string): Promise<any> {
        try {
            let result;
            let errors: Record<string, string> = {};

            // Validaciones básicas de negocio en infraestructura
            if (!page.title?.trim()) {
                errors.title = "El título es obligatorio.";
            }
            if (!page.slug?.trim()) {
                errors.slug = "El slug es obligatorio.";
            }

            if (Object.keys(errors).length > 0) {
                return { errors };
            }

            // Preparar el objeto para persistencia
            const dataToSave = { ...page };
            delete (dataToSave as any).id;

            if (!id) {
                // Crear nuevo artículo
                const { data, errors: apiErrors } = await apiSyncService.create('Page', dataToSave) as any;
                if (apiErrors) return { errors: apiErrors };
                result = data;
            } else {
                // Actualizar artículo existente
                const updated = await apiSyncService.update('Page', id, dataToSave) as any;
                if (updated.errors) return { errors: updated.errors };
                result = updated;
            }

            return result as Page;
        } catch (error) {
            console.error('Error al guardar página:', error);
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const { errors } = await apiSyncService.delete('Page', id);
            if (errors) {
                console.error('Error al eliminar artículo:', errors);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error al eliminar artículo:', error);
            return false;
        }
    }

    async findBySlug(slug: string): Promise<Page | null> {
        try {
            const { data } = await apiSyncService.query('Page', 'listPageBySlug', { slug }) as any;

            if (data && data.length > 0) return data[0] as Page;

            return null;
        } catch (error) {
            console.error('Error al buscar artículo por slug:', error);
            return null;
        }
    }

    async get(filters?: any): Promise<Page[]> {
        try {
            const data = await apiSyncService.get('Page', undefined, filters);
            return (data || []) as Page[];
        } catch (error) {
            console.error('Error al obtener la lista de artículos:', error);
            throw error;
        }
    }
}