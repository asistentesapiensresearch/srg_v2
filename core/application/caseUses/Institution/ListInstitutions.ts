import { InstitutionAmplifyRepository } from "../../../infrastructure/repositories/InstitutionAmplifyRepository";

export class ListInstitutions {
    constructor(private repository: InstitutionAmplifyRepository) { }

    async execute() {
        return await this.repository.list();
    }
}