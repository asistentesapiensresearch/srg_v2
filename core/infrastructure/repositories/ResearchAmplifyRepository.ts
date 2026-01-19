import { ResearchRepository } from "@core/domain/repositories";
import { apiSyncService } from "../api/apiSync.service";
import { Research } from "@core/domain/repositories/entities";

// Helper para convertir el modelo de Amplify a entidad Research
const toPlainResearch = (amplifyData: any): Research | null => {
    if (!amplifyData) return null;
    
    // Extraer solo las propiedades de datos
    const {
        id,
        index,
        title,
        path,
        description,
        dateRange,
        icon,
        category,
        subCategory,
        version,
    } = amplifyData;
    
    // Crear objeto con métodos de Research si la entidad los requiere
    const research: Research = {
        id,
        index,
        title,
        path,
        description,
        dateRange,
        icon,
        category,
        subCategory,
        version: version || 1,
        
        // Métodos de la entidad (si existen)
        updateVersion: function() {
            this.version = (this.version || 1) + 1;
            return this;
        },
        
        isValid: function() {
            return !!(
                this.title?.trim() &&
                this.path?.trim() &&
                this.description?.trim() &&
                this.dateRange?.trim() &&
                this.icon?.trim() &&
                this.category?.trim() &&
                this.subCategory?.trim()
            );
        }
    };
    
    return research;
};

export class ResearchAmplifyRepository implements ResearchRepository {
    async get(filters?: any): Promise<Research[]> {
        try {
            const data = await apiSyncService.get('Research', undefined, filters);
            return (data || []).map(toPlainResearch).filter(Boolean) as Research[];
        } catch (error: any) {
            console.error('Error al obtener investigaciones:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<Research | null> {
        try {
            const data = await apiSyncService.getById('Research', id);
            return toPlainResearch(data);
        } catch (error: any) {
            console.error('Error al buscar investigación por ID:', error);
            return null;
        }
    }

    async findByPath(path: string): Promise<Research | null> {
        try {
            const { data, errors } = await apiSyncService.query(
                'Research', 
                'listResearchByPath', 
                { path }
            );
            
            if (errors && errors.length) {
                return null;
            }
            
            return data?.[0] ? toPlainResearch(data[0]) : null;
        } catch (error: any) {
            console.error('Error al buscar investigación por path:', error);
            return null;
        }
    }

    async store(research: Research, id?: string): Promise<Research> {
        try {
            let data;
            
            if (id) {
                // Para update, no enviar campos read-only ni métodos
                const { createdAt, updatedAt, updateVersion, isValid, ...updateData } = research as any;
                data = await apiSyncService.update('Research', id, updateData);
            } else {
                // Para create, no enviar id, createdAt, updatedAt ni métodos
                const { id: _, createdAt, updatedAt, updateVersion, isValid, ...createData } = research as any;
                data = await apiSyncService.create('Research', createData);
            }
            
            const plainData = toPlainResearch(data);
            if (!plainData) {
                throw new Error('No se pudo procesar la respuesta del servidor');
            }
            
            return plainData;
        } catch (error: any) {
            console.error(`Error al ${id ? 'actualizar' : 'crear'} investigación:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await apiSyncService.delete('Research', id);
            return true;
        } catch (error: any) {
            console.error('Error al eliminar investigación:', error);
            throw error;
        }
    }
}