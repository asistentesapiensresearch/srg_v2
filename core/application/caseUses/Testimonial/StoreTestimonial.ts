import { Testimonial } from "@core/domain/repositories/entities/Testimonial";
import { TestimonialRepository } from "@core/domain/repositories/repositories/TestimonialRepository";

export interface StoreTestimonialResult {
    success: boolean;
    data?: Testimonial;
    errors?: Record<string, string>;
}

export class StoreTestimonialUseCase {
    constructor(private testimonialRepo: TestimonialRepository) { }

    async execute(input: Testimonial, id?: string): Promise<StoreTestimonialResult> {
        const errors: Record<string, string> = {};

        // 1. Validaciones de Reglas de Negocio
        if (!input.institutionId) {
            errors.institutionId = "El ID de la institución asociada es obligatorio.";
        }
        if (!input.name || !input.name.trim()) {
            errors.name = "El nombre de la persona es obligatorio.";
        }
        if (!input.content || !input.content.trim()) {
            errors.content = "El texto del testimonio no puede estar vacío.";
        }

        // Si hay errores, detenemos el proceso y devolvemos el fallo
        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        try {
            // 2. Ejecutar la persistencia en el repositorio
            const result = await this.testimonialRepo.store(input, id);
            return { success: true, data: result };
        } catch (error: any) {
            console.error("Error en StoreTestimonialUseCase:", error);
            return {
                success: false,
                errors: { form: error.message || "Error inesperado al guardar el testimonio." }
            };
        }
    }
}