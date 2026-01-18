// src/view/templates/ContactPage/schema.js
import { v4 as uuidv4 } from 'uuid';

export default {
    label: "Página de Contacto",
    description: "Cabecera, mapa y formulario",
    getSections: () => [
        {
            id: uuidv4(),
            type: 'TextSection',
            props: { content: '<h1>Contáctanos</h1>', align: 'center', color: '#1a1a1a' }
        },
        {
            id: uuidv4(),
            type: 'WysiwygSection',
            props: { content: '<p>Estamos ubicados en...</p>', paddingY: 2 }
        }
    ]
};