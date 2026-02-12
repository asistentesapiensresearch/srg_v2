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
            label: "Texto de instrucciones",
            type: "textarea",
            default: "Completa el formulario y nos pondremos en contacto contigo."
        },
        {
            name: "submitAction",
            label: "Método de Envío",
            type: "select",
            default: "whatsapp",
            options: [
                { label: "WhatsApp", value: "whatsapp" },
                { label: "Email (Mailto)", value: "email" }
            ]
        },
        {
            name: "destination",
            label: "Destino (Teléfono o Email)",
            type: "text",
            help: "Para WhatsApp: número con código país (57300...). Para Email: correo@ejemplo.com",
            default: ""
        },
        {
            name: "submitButtonText",
            label: "Texto del Botón",
            type: "text",
            default: "Enviar Ahora"
        },
        {
            name: "formFields",
            label: "Configuración de Campos (JSON)",
            type: "jsonCode",
            help: "Define los inputs. Propiedad 'width': 6 es mitad, 12 es completo.",
            default: JSON.stringify([
                { "name": "nombre", "label": "Nombre Completo", "type": "text", "width": 6, "required": true },
                { "name": "telefono", "label": "Teléfono", "type": "number", "width": 6, "required": true },
                { "name": "email", "label": "Correo Electrónico", "type": "email", "width": 12, "required": true },
                { "name": "servicio", "label": "Tipo de Servicio", "type": "select", "options": "Asesoría,Soporte,Ventas", "width": 12 },
                { "name": "mensaje", "label": "¿En qué podemos ayudarte?", "type": "textarea", "width": 12 }
            ], null, 4)
        }
    ]
};