// Nota: Ajusté las rutas de importación que tenían un '/repositories/' duplicado
import { GalleryRepository } from '@core/domain/repositories/repositories/GalleryRepository';
import { apiSyncService } from '../api/apiSync.service';
import { Gallery } from '@core/domain/repositories/entities/Gallery';

export class GalleryAmplifyRepository implements GalleryRepository {

    async store(gallery: Gallery, id?: string): Promise<Gallery> {
        const imagesPayload = typeof gallery.images === 'string'
            ? gallery.images
            : JSON.stringify(gallery.images);

        const payload = {
            name: gallery.name,
            description: gallery.description || null,
            type: gallery.type || 'General',
            entityId: gallery.entityId || null,
            images: imagesPayload
        };

        // apiSyncService retorna la data directamente y lanza el error si falla
        if (id) {
            const data = await apiSyncService.update('Gallery', id, payload);
            return data as Gallery;
        } else {
            const data = await apiSyncService.create('Gallery', payload);
            return data as Gallery;
        }
    }

    async findById(id: string): Promise<Gallery | null> {
        // Usamos getById en lugar de get
        try {
            const data = await apiSyncService.getById('Gallery', id);
            return data ? (data as Gallery) : null;
        } catch (error) {
            // Si no lo encuentra o hay error, retornamos null o dejamos que suba
            return null;
        }
    }

    async findAll(filter?: any): Promise<Gallery[]> {
        // La firma de tu servicio es get(type, limit?, filter?)
        const data = await apiSyncService.get('Gallery', undefined, filter);
        return data as unknown as Gallery[];
    }

    async delete(id: string): Promise<boolean> {
        await apiSyncService.delete('Gallery', id);
        return true;
    }
}