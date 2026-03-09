import { InstitutionAmplifyRepository } from "../../../infrastructure/repositories/InstitutionAmplifyRepository";

export class CreateInstitution {
    constructor(private repository: InstitutionAmplifyRepository) { }

    async execute(data: any) {
        // Aquí puedes agregar validaciones de negocio antes de guardar
        if (!data.name) throw new Error("El nombre de la institución es obligatorio");

        return await this.repository.create(data);
    }
}