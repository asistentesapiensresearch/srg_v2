import { GalleryRepository } from "@core/domain/repositories/repositories/GalleryRepository";

export class DeleteGalleryUseCase {
    constructor(private galleryRepo: GalleryRepository) { }

    async execute(id: string): Promise<boolean> {
        if (!id) throw new Error("ID es requerido para eliminar.");
        return await this.galleryRepo.delete(id);
    }
}