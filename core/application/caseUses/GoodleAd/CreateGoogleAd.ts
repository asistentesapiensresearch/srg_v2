import { GoogleAdRepository } from "@core/domain/repositories/repositories/GoogleAdRepository";
import { GoogleAd } from "@core/domain/repositories/entities";

export class CreateInstitution {
    constructor(private googleAdRepository: GoogleAdRepository) { }

    async execute(data: GoogleAd) {
        if (!data.adUnitPath) throw new Error("El adUnitPath es obligatorio");
        if (!data.slotId) throw new Error("El slotId es obligatorio");
        return await this.googleAdRepository.create(data);
    }
}