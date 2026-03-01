import { Testimonial } from '../entities/Testimonial';

export interface TestimonialRepository {
    store(testimonial: Testimonial, id?: string): Promise<Testimonial>;
    findByEntity(institutionId: string): Promise<Testimonial[]>;
    delete(id: string): Promise<boolean>;
}