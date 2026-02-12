// src/pages/admin/components/helpers/sections/ModalSection/schema.js
export default {
    label: "Modal / Pop-up Contenedor",
    icon: "Maximize",
    isContainer: true,
    fields: [
        {
            name: "editorMode",
            label: "🛠️ Modo Diseño (Forzar apertura)",
            type: "boolean",
            default: true,
            help: "Mantenlo activado para editar el contenido. Desactívalo para probar."
        },
        {
            name: "triggerType",
            label: "Tipo de Activación",
            type: "select",
            default: "button",
            options: [
                { label: "Botón Propio (Este componente)", value: "button" },
                { label: "Click en Elemento Externo (ID / Clase)", value: "selector" }, // 🔥 NUEVA OPCIÓN
                { label: "Automático (Tiempo)", value: "auto" }
            ]
        },
        // Opción para SELECTOR (ID/Clase)
        {
            name: "triggerSelector",
            label: "Selector del Elemento (ID o Clase)",
            type: "text",
            default: "#mi-boton",
            help: "Ejemplo ID: #boton-contacto | Ejemplo Clase: .btn-abrir-modal",
            // Mostrar solo si triggerType == selector
        },
        // Opciones para BOTÓN PROPIO
        {
            name: "buttonText",
            label: "Texto del Botón",
            type: "text",
            default: "",
            placeholder: ""
        },
        {
            name: "buttonVariant",
            label: "Estilo del Botón",
            type: "select",
            default: "contained",
            options: [
                { label: "Relleno", value: "contained" },
                { label: "Borde", value: "outlined" },
                { label: "Texto", value: "text" }
            ]
        },
        // Opciones AUTOMÁTICAS
        {
            name: "autoDelay",
            label: "Retraso (Segundos)",
            type: "number",
            default: 2
        },
        {
            name: "frequency",
            label: "Frecuencia",
            type: "select",
            default: "always",
            options: [
                { label: "Siempre", value: "always" },
                { label: "Una vez por sesión", value: "session" },
                { label: "Una vez al día", value: "day" }
            ]
        },
        {
            name: "modalSize",
            label: "Tamaño",
            type: "select",
            default: "md",
            options: [
                { label: "Pequeño", value: "sm" },
                { label: "Mediano", value: "md" },
                { label: "Grande", value: "lg" },
                { label: "Pantalla Completa", value: "full" }
            ]
        },
        {
            name: "title",
            label: "Título del Modal",
            type: "text",
            default: ""
        }
    ]
};