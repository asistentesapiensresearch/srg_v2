// src/view/templates/HeroFeature/schema.js
import { v4 as uuidv4 } from 'uuid';
export default {
        label: "Lanzamiento de Producto",
        description: "Texto llamativo con editor enriquecido",
        getSections: () => [
        {
                id: uuidv4(),
                type: 'WysiwygSection',
                props: { 
                    content: '<h1>Increíble Título</h1><p>Descripción detallada aquí.</p>',
                    maxWidth: 'md'
            }
        }
    ]
}