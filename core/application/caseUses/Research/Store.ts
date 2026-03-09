import { Research } from "@core/domain/repositories/entities";
import { ResearchRepository } from "@core/domain/repositories";

// Interfaz para estandarizar la respuesta del Caso de Uso
export interface StoreResult {
    success: boolean;
    data?: Research;
    errors?: Record<string, string>;
}

export class Store {
    // Regex constante para no recrearla en cada ejecución
    private static readonly PATH_REGEX = /^[a-z0-9-]+$/;

    constructor(private researchRepo: ResearchRepository) { }

    async execute(input: Research, id?: string): Promise<StoreResult> {
        const errors: Record<string, string> = {};

        // 1. Sanitización de datos críticos
        // Aseguramos que el path sea seguro aunque el front falle
        input.title = input.title?.trim() || "";
        input.path = input.path?.trim().toLowerCase() || "";

        // 2. Validaciones Sincrónicas (Campos obligatorios y formato)
        if (!input.title) errors.title = "El título es obligatorio.";

        if (!input.path) {
            errors.path = "El path es obligatorio.";
        } else if (!Store.PATH_REGEX.test(input.path)) {
            errors.path = "El path solo puede contener letras minúsculas, números y guiones.";
        }

        if (!input.description?.trim() || input.description === '<p></p>') {
            errors.description = "La descripción es obligatoria.";
        }

        if (!input.category) errors.category = "Debe seleccionar una categoría.";
        if (!input.subCategory) errors.subCategory = "Debe seleccionar una subcategoría.";
        if (!input.icon) errors.icon = "Debe subir un ícono.";

        // Si ya hay errores básicos, retornamos inmediatamente para ahorrar la llamada a BD
        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        // 3. Validación Asíncrona (Duplicidad de Path)
        // Optimizamos la lógica: Buscamos si existe ALGUIEN con ese path
        const existingResearch = await this.researchRepo.findByPath?.(input.path);

        if (existingResearch) {
            // Si estamos CREANDO (no hay id) y existe -> Error
            // Si estamos EDITANDO (hay id) y el ID encontrado es DISTINTO al actual -> Error (conflicto con otro)
            if (!id || (id && existingResearch.id !== id)) {
                return {
                    success: false,
                    errors: { path: `El path "${input.path}" ya está en uso por otra investigación.` }
                };
            }
        }

        try {
            // 4. Persistencia
            let result: Research;

            if (id) {
                // Actualización: Aseguramos mantener datos que no vienen en el input si es necesario
                // O confiamos en que el repositorio maneja el merge.
                // input.updatedAt = new Date(); // Si no lo maneja tu ORM
                result = await this.researchRepo.store(input, id);
            } else {
                // Creación
                input.version = 1;
                // input.createdAt = new Date(); // Si no lo maneja tu ORM
                result = await this.researchRepo.store(input);
            }

            return { success: true, data: result };

        } catch (error) {
            console.error("Error en StoreResearchUseCase:", error);
            // Error genérico de servidor/base de datos
            return {
                success: false,
                errors: { form: "Ocurrió un error inesperado al guardar la investigación." }
            };
        }
    }
}