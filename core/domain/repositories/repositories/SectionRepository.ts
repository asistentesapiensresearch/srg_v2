import { Section } from '../entities';

export interface SectionRepository {
  get(id?:string): Promise<Section[]>;
  store(section: Section, id?:string): Promise<Section>;
  delete(id: string): Promise<boolean>;
}