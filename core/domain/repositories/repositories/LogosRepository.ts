import { Logo, ResearchLogo } from '../entities';

export interface LogosRepository {
  create(Logo: Logo): Promise<Logo | null>;
  update(id: string, Logo: Logo): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  findByResearchId(researchId: string): Promise<Logo[]>;
  findByLogoId(logoId: string): Promise<Logo[]>;
  createResearchLogo(researchId: string, logoId: string): Promise<ResearchLogo>;
  deleteResearchLogo(id: string): Promise<boolean>;
}