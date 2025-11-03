import { Research } from '../entities';

export interface IResearchRepository {
  findById(id: string): Promise<Research | null>;
  findByInstitutionId(institutionId: string): Promise<Research[]>;
  save(research: Research): Promise<void>;
  delete(id: string): Promise<void>;
}