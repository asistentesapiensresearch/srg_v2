import { ListInstitutions } from "@core/application/caseUses/Institution/ListInstitutions";
import { InstitutionAmplifyRepository } from "@core/infrastructure/repositories/InstitutionAmplifyRepository";

export default {
    label: "Carrusel de Testimonios",
    icon: "MessageSquareQuote",
    fields: [
        { name: "data_settings", label: "🔌 ORIGEN DE DATOS", type: "separator" },
        {
            name: "sourceMode",
            label: "Modo de Origen",
            type: "select",
            default: "context",
            options: [
                { label: "Automático (Entidad Actual)", value: "context" },
                { label: "Personalizado (Elegir Institución)", value: "custom" }
            ],
            help: "Automático traerá los testimonios de la institución que se esté visualizando."
        },
        {
            name: "targetEntityId",
            label: "Seleccionar Institución",
            type: "asyncSelect",
            loadOptions: async () => {
                const institutionRepo = new InstitutionAmplifyRepository();
                const data = await (new ListInstitutions(institutionRepo)).execute();
                return data.map(d => ({ label: d.name, value: d.id }));
            },
            condition: "sourceMode === 'custom'"
        },

        { name: "style_settings", label: "🎨 ESTILO VISUAL", type: "separator" },
        {
            name: "layout",
            label: "Diseño de Tarjeta",
            type: "select",
            default: "classic",
            options: [
                { label: "Clásico (Avatar abajo)", value: "classic" },
                { label: "Burbuja (Cita con fondo)", value: "bubble" },
                { label: "Minimalista (Limpio)", value: "minimal" }
            ]
        },
        { name: "isVertical", label: "Orientación vertical", type: "boolean", default: false },
        { name: "heightCarrusel", label: "Altura vertical", type: "text", default: "400px" },
        { name: "itemsPerView", label: "Testimonios visibles (PC)", type: "number", default: 3, min: 1, max: 4 },
        { name: "autoplay", label: "Reproducción Automática", type: "checkbox", default: true },
        { name: "showArrows", label: "Mostrar Flechas", type: "checkbox", default: true },
        { name: "showDots", label: "Mostrar Puntos (Paginación)", type: "checkbox", default: true }, // Nueva opción útil
        { name: "primaryColor", label: "Color de Acento", type: "color", default: "#c10008" },
        { name: "backgroundColor", label: "Color de Fondo", type: "color", default: "#f9fafb" }
    ]
};