import { TestimonialRepository } from "@core/domain/repositories/repositories/TestimonialRepository";

export class DeleteTestimonialUseCase {
    constructor(private testimonialRepo: TestimonialRepository) { }

    async execute(id: string): Promise<boolean> {
        if (!id) {
            throw new Error("El ID es requerido para eliminar el testimonio.");
        }
        return await this.testimonialRepo.delete(id);
    }
}