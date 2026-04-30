import { GoogleAdRepository } from "@core/domain/repositories/repositories/GoogleAdRepository";


export class FindById {
    constructor(private googleAdRepository: GoogleAdRepository){}

    async execute(id:string){
        return await this.googleAdRepository.findById(id);
    }
}