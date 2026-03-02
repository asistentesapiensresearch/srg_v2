import { routes } from '@src/router/routes';
import { useEffect } from 'react';
import { useLocation, matchRoutes } from 'react-router-dom';

export const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        // matchRoutes compara la URL actual con tu arreglo de configuración
        const matches = matchRoutes(routes, location);

        if (matches) {
            // Buscamos de la ruta más específica a la más general la que tenga un 'title'
            const leafRoute = [...matches].reverse().find(m => m.route.title);

            if (leafRoute) {
                document.title = `${leafRoute.route.title} | SRG`;
            } else {
                document.title = 'Los mejores colegios y las mejores universidades de Colombia por Sapiens Research'; // Título por defecto si no hay uno en la ruta
            }
        }
    }, [location]);

    return null;
};