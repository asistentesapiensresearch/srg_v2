import { GoogleAdRepository } from "@core/domain/repositories/repositories/GoogleAdRepository";
import { GoogleAd } from "@core/domain/repositories/entities";

export class Update {
    constructor(private googleAdRepository: GoogleAdRepository){}

    async execute(id:string, googleAd: GoogleAd ){
        return await this.googleAdRepository.update(id,googleAd);
    }
}