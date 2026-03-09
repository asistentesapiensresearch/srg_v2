// core/domain/repositories/repositories/TemplateRepository.ts
import { Template } from '../entities';

export interface TemplateRepository {
  get(filters?: any): Promise<Template[]>;
  update(id: string, template: Template): Promise<boolean>;
  create(template: Template): Promise<Template | null>;
  getByResearchId(researchId: string): Promise<Template | null>;
  getByInstitutionId(institutionId: string): Promise<Template | null>;
  getByArticlenId(articleId: string): Promise<Template | null>;
}