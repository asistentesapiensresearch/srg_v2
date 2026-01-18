import { LogosRepository } from "@core/domain/repositories";
import { Logo } from "@core/domain/repositories/entities";

export class Update {
    constructor(private logosRepo: LogosRepository){}

    async execute(id:string, data:Logo){
        return await this.logosRepo.update(id, data);
    }
}