import { Brand, ResearchBrand } from '../entities';

export interface BrandRepository {
  get(filters?: any): Promise<Brand[]>;
  store(brand: Brand, id?:string): Promise<Brand | null>;
  delete(id: string): Promise<boolean>;
  findByResearchId(researchId: string): Promise<Brand[]>;
  createResearchBrand(researchId: string, brandId: string): Promise<ResearchBrand>;
  deleteResearchBrand(id: string): Promise<boolean>;
}