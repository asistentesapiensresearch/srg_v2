import React from 'react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, size = 24, color = "currentColor", className = "" }) => {
    // 1. Buscamos el componente en la librería usando el nombre
    const IconComponent = LucideIcons[name];

    // 2. Si no existe, devolvemos un ícono por defecto (ej: LayoutTemplate)
    if (!IconComponent) {
        // Fallback icon
        const Fallback = LucideIcons.LayoutTemplate;
        return <Fallback size={size} color={color} className={className} />;
    }

    // 3. Renderizamos el ícono encontrado
    return <IconComponent size={size} color={color} className={className} />;
};

export default DynamicIcon;