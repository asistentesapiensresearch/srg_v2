import FormBuilder from './FormBuilder'; // Asegúrate de importar el componente

export default {
    label: "Formulario de Contacto",
    icon: "ClipboardList",
    fields: [
        {
            name: "title",
            label: "Título Principal",
            type: "text",
            default: "Contáctanos"
        },
        {
            name: "description",
            label: "Instrucciones",
            type: "textarea",
            default: "Déjanos tus datos y te contactaremos pronto."
        },
        {
            name: "config_separator",
            label: "Configuración de Envío",
            type: "separator"
        },
        {
            name: "submitAction",
            label: "Método de Envío",
            type: "select",
            default: "whatsapp",
            options: [
                { label: "WhatsApp (Recomendado)", value: "whatsapp" },
                { label: "Email (Cliente de Correo)", value: "email" }
            ],
            help: "WhatsApp abrirá el chat con los datos precargados. Email abrirá la app de correo del usuario."
        },
         {
            name: "isAdmisiones",
            label: "Es formulario de admisiones",
            type: "boolean",
            default: false,
        },
        {
            name: "destination",
            label: "Destino (Teléfono o Email)",
            type: "text",
            help: "Si es WhatsApp: Número con código país (ej: 57300...). Si es Email: correo@colegio.edu.co",
            default: "",
            condition: "isAdmisiones === false"
        },
        {
            name: "submitButtonText",
            label: "Texto del Botón",
            type: "text",
            default: "Enviar Mensaje"
        },
        {
            name: "fields_separator",
            label: "Diseño del Formulario",
            type: "separator"
        },
        // 🔥 AQUÍ ESTÁ EL CAMBIO CLAVE
        {
            name: "formFields",
            label: "Campos del Formulario",
            type: "custom", // O 'component' dependiendo de tu sistema de renderizado de admin
            component: FormBuilder, // Usamos el componente visual
            default: JSON.stringify([
                { id: '1', name: "nombre", label: "Nombre Completo", type: "text", width: 12, required: true },
                { id: '2', name: "telefono", label: "Teléfono de Contacto", type: "number", width: 12, required: true },
                { id: '3', name: "mensaje", label: "¿Cómo podemos ayudarte?", type: "textarea", width: 12, required: false }
            ])
        }
    ]
};