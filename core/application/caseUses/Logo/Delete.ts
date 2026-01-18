import { LogosRepository } from "@core/domain/repositories";

export class Delete {
    constructor(private logosRepo: LogosRepository){}

    async execute(id:string){
        return await this.logosRepo.delete(id);
    }
}