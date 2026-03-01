import { TestimonialRepository } from '@core/domain/repositories/repositories/TestimonialRepository';
import { apiSyncService } from '../api/apiSync.service';
import { Testimonial } from '@core/domain/repositories/entities/Testimonial';

export class TestimonialAmplifyRepository implements TestimonialRepository {

    async store(testimonial: Testimonial, id?: string): Promise<Testimonial> {
        const payload = {
            institutionId: testimonial.institutionId,
            name: testimonial.name,
            role: testimonial.role || null,
            content: testimonial.content,
            photo: testimonial.photo || null
        };

        if (id) {
            const data = await apiSyncService.update('Testimonial', id, payload);
            return data as Testimonial;
        } else {
            const data = await apiSyncService.create('Testimonial', payload);
            return data as Testimonial;
        }
    }

    async findByEntity(institutionId: string): Promise<Testimonial[]> {
        // Filtrar usando el servicio
        return (await apiSyncService.query(
            'Testimonial',
            'listTestimonialByInstitutionId',
            { institutionId }
        )).data;
    }

    async delete(id: string): Promise<boolean> {
        await apiSyncService.delete('Testimonial', id);
        return true;
    }
}