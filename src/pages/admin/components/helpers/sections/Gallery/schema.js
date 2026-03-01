import { generateClient } from 'aws-amplify/data';
const client = generateClient();

// Helper para cargar galerías en el select del builder
const getGalleriesOptions = async () => {
    try {
        const { data } = await client.models.Gallery.list();
        return data.map(g => ({ label: g.name, value: g.id }));
    } catch (e) {
        return [];
    }
};

export default {
    label: "Galería de Imágenes",
    icon: "Images", // Asegúrate de tener este icono o usa 'Image'
    fields: [
        {
            name: "sourceType",
            label: "Origen de las Imágenes",
            type: "select",
            default: "custom",
            options: [
                { label: "Galería Personalizada (Elegir)", value: "custom" },
                { label: "Galería de la Entidad (Automático)", value: "entity" }
            ],
            help: "'Automático' buscará una galería asociada a la Institución/Investigación actual."
        },
        {
            name: "galleryId",
            label: "Seleccionar Galería",
            type: "asyncSelect", // Necesitarás un componente que soporte carga asíncrona o usar un select normal cargado al inicio
            loadOptions: getGalleriesOptions,
            condition: "sourceType === 'custom'",
            help: "Crea galerías en el menú Admin > Galerías"
        },
        // Opciones visuales
        { name: "playInterval", label: "Show Interval", type: "number", default: 2000 },
        { name: "slideDuration", label: "Slide Duration", type: "number", default: 550 },
        { name: "maxBullets", label: "Max Bullets", type: "number", default: 0 },
        {
            name: "thumbnailBarPosition",
            label: "Posición barra miniaturas",
            type: "select",
            default: "bottom",
            options: [
                { label: "Inferior", value: "bottom" },
                { label: "Superior", value: "top" },
                { label: "Izquierda", value: "left" },
                { label: "Derecha", value: "right" }
            ],
            help: "Posición en la que se verán las imágenes miniaturas."
        },
        { name: "showArrows", label: "Mostrar flechas de navegación", type: "checkbox", default: true },
        { name: "showThumbnails", label: "Mostrar miniaturas", type: "checkbox", default: true },
        { name: "showBulletIndicators", label: "Mostrar indicadores (puntos)", type: "checkbox", default: true },
        { name: "showSliderCounter", label: "Mostrar contador del slider", type: "checkbox", default: false },
        { name: "showAutoplayButton", label: "Mostrar botón de reproducción automática", type: "checkbox", default: true },
        { name: "showFullscreenButton", label: "Mostrar botón de pantalla completa", type: "checkbox", default: true },
        { name: "InfiniteLoop", label: "Activar bucle infinito", type: "checkbox", default: true },
        { name: "SlideOnThumbnailHover", label: "Cambiar slide al pasar el mouse sobre la miniatura", type: "checkbox", default: false },
        { name: "KeyboardNavigation", label: "Permitir navegación con el teclado", type: "checkbox", default: true },
        { name: "LazyLoadImages", label: "Cargar imágenes de forma diferida (lazy load)", type: "checkbox", default: false },
        { name: "VerticalSliding", label: "Deslizamiento vertical", type: "checkbox", default: false },
        { name: "RightToLeft", label: "Modo de derecha a izquierda (RTL)", type: "checkbox", default: false },
    ]
};