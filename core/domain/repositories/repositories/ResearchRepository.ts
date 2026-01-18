import { Research } from '../entities';

export interface ResearchRepository {
  store(research: Research, id?: string): Promise<Research>;
  get(filters?: any): Promise<Research[]>;
  findById(id: string): Promise<Research | null>;
  findByPath(path: string): Promise<Research | null>;
  delete(id: string): Promise<boolean>;
}