import { Gallery } from "@core/domain/repositories/entities/Gallery";
import { GalleryRepository } from "@core/domain/repositories/repositories/GalleryRepository";

export interface StoreGalleryResult {
    success: boolean;
    data?: Gallery;
    errors?: Record<string, string>;
}

export class StoreGalleryUseCase {
    constructor(private galleryRepo: GalleryRepository) { }

    async execute(input: Gallery, id?: string): Promise<StoreGalleryResult> {
        const errors: Record<string, string> = {};

        // 1. Validaciones de Dominio
        if (!input.name || !input.name.trim()) {
            errors.name = "El nombre de la galería es obligatorio.";
        }

        if (!input.images || (Array.isArray(input.images) && input.images.length === 0)) {
            errors.images = "Debe subir al menos una imagen a la galería.";
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        try {
            // 2. Persistencia
            const result = await this.galleryRepo.store(input, id);
            return { success: true, data: result };
        } catch (error: any) {
            console.error("Error en StoreGalleryUseCase:", error);
            return {
                success: false,
                errors: { form: error.message || "Error inesperado al guardar la galería." }
            };
        }
    }
}