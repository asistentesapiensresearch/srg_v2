import { Institution } from '../entities/Institution';

export interface InstitutionRepository {
    findById(id: string): Promise<Institution | null>;
    findAll(limit: number, filter: any): Promise<Institution[]>;
    create(institution: Institution): Promise<Institution | null>;
    update(id: string, institution: Institution): Promise<boolean>;
    delete(id: string): Promise<void>;
}