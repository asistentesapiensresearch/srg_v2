import { Testimonial } from "@core/domain/repositories/entities/Testimonial";
import { TestimonialRepository } from "@core/domain/repositories/repositories/TestimonialRepository";

export class FindTestimonialsUseCase {
    constructor(private testimonialRepo: TestimonialRepository) { }

    async execute(institutionId: string): Promise<Testimonial[]> {
        if (!institutionId) {
            throw new Error("Se requiere el ID de la entidad para buscar sus testimonios.");
        }
        return await this.testimonialRepo.findByEntity(institutionId);
    }
}