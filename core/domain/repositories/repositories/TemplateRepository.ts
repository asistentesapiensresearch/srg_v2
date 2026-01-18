// core/domain/repositories/repositories/TemplateRepository.ts
import { Template } from '../entities';

export interface TemplateRepository {
  update(id: string, template: Template): Promise<boolean>;
  create(template: Template): Promise<Template | null>;
  getByResearchId(researchId: string): Promise<Template | null>;
}