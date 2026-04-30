import { GoogleAd } from '../entities';

export interface GoogleAdRepository {
  get(filters?: any): Promise<GoogleAd[]>;
  create(template: GoogleAd): Promise<GoogleAd | null>;
  update(id: string, template: GoogleAd): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}