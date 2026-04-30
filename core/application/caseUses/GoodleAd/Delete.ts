import { GoogleAdRepository } from "@core/domain/repositories/repositories/GoogleAdRepository";

export class Delete {
    constructor(private googleAdRepository: GoogleAdRepository){}

    async execute(id:string){
        return await this.googleAdRepository.delete(id);
    }
}