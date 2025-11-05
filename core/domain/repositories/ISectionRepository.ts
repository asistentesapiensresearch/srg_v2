import { Section } from '../entities';

export interface ISectionRepository {
  findById(id: string): Promise<Section | null>;
  findByResearch(researchName: string): Promise<Section[]>;
  save(section: Section): Promise<void>;
  delete(id: string): Promise<void>;
}