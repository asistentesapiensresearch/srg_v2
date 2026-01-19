import { BrandRepository } from "@core/domain/repositories";

export class Get {
    constructor(private brandRepo: BrandRepository) { }

    async execute(filters?: any) {
        if (filters) {
            return await this.brandRepo.get(filters);
        }
        return await this.brandRepo.get();
    }
}