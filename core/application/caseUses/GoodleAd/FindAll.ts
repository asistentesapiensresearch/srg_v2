import { GoogleAdRepository } from "@core/domain/repositories/repositories/GoogleAdRepository";

export class GetAds {
    constructor(private GoogleAdRepository: GoogleAdRepository) { }

    async execute(filters?: any) {
        if (filters) {
            return await this.GoogleAdRepository.get(filters);
        }
        return await this.GoogleAdRepository.get();
    }
}