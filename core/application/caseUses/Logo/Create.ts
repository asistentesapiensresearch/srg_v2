import { LogosRepository } from "@core/domain/repositories";
import { Logo } from "@core/domain/repositories/entities";

export class Create {
    constructor(private logosRepo: LogosRepository){}

    async execute(logo:Logo){
        return await this.logosRepo.create(logo);
    }
}