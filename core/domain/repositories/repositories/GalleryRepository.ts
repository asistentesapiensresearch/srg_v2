import { Gallery } from '../entities/Gallery';

export interface GalleryRepository {
    store(gallery: Gallery, id?: string): Promise<Gallery>;
    findById(id: string): Promise<Gallery | null>;
    findAll(filter?: any): Promise<Gallery[]>;
    delete(id: string): Promise<boolean>;
}