import { LogosRepository } from "@core/domain/repositories";

export class FindByLogoId {
    constructor(private logosRepo: LogosRepository) { }

    async execute(logoId: string) {
        return await this.logosRepo.findByLogoId(logoId);
    }
}