import { ArticleRepository } from "@core/domain/repositories/repositories/ArticleRepository";
import { apiSyncService } from "../api/apiSync.service";
import { Article } from "@core/domain/entities/Article";

export class ArticleAmplifyRepository implements ArticleRepository {

    async store(article: Article, id?: string): Promise<any> {
        try {
            let result;
            let errors: Record<string, string> = {};

            // Validaciones básicas de negocio en infraestructura
            if (!article.title?.trim()) {
                errors.title = "El título es obligatorio.";
            }
            if (!article.slug?.trim()) {
                errors.slug = "El slug es obligatorio.";
            }

            if (Object.keys(errors).length > 0) {
                return { errors };
            }

            // Preparar el objeto para persistencia
            const dataToSave = { ...article };
            delete (dataToSave as any).id; // Evitar enviar el ID en el cuerpo si existe

            if (!id) {
                // Crear nuevo artículo
                const { data, errors: apiErrors } = await apiSyncService.create('Article', dataToSave) as any;
                if (apiErrors) return { errors: apiErrors };
                result = data;
            } else {
                // Actualizar artículo existente
                const { data, errors: apiErrors } = await apiSyncService.update('Article', id, dataToSave) as any;
                if (apiErrors) return { errors: apiErrors };
                result = data;
            }

            return result as Article;
        } catch (error) {
            console.error('Error al guardar artículo:', error);
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const { errors } = await apiSyncService.delete('Article', id);
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

    async findBySlug(slug: string): Promise<Article | null> {
        try {
            // Utilizamos el índice secundario definido en el schema: listArticleBySlug
            const { data } = await apiSyncService.query('Article', 'listArticleBySlug', { slug }) as any;

            if (data && data.length > 0) {
                return data[0] as Article;
            }

            return null;
        } catch (error) {
            console.error('Error al buscar artículo por slug:', error);
            return null;
        }
    }

    async get(filters?: any): Promise<Article[]> {
        try {
            // El apiSyncService.get maneja la lista completa o filtrada
            const data = await apiSyncService.get('Article', undefined, filters);
            return (data || []) as Article[];
        } catch (error) {
            console.error('Error al obtener la lista de artículos:', error);
            throw error;
        }
    }
}