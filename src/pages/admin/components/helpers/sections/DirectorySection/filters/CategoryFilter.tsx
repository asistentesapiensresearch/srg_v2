// src/view/sections/DirectorySection/filters/CategoryFilter.tsx
import { useState, useRef, useEffect } from 'react';

// Datos de ejemplo (idealmente vendrían de props o una API)
const CATEGORIES = [
    { id: 'dev', name: 'Desarrollo' },
    { id: 'design', name: 'Diseño' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Ventas' },
];

interface Props {
    selected: string;
    onChange: (value: string) => void;
}

export const CategoryFilter = ({ selected, onChange }: Props) => {
    console.log('rendered categoryFilter')
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Encontrar el nombre de la categoría seleccionada para mostrarlo en el botón
    const selectedLabel = CATEGORIES.find(c => c.id === selected)?.name || 'Todas las categorías';

    // Cerrar el menú si hacemos clic fuera (Esencial para buena UX)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all duration-200
          ${isOpen
                        ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }
        `}
            >
                <span className={`text-sm font-medium ${selected ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedLabel}
                </span>

                {/* Icono Chevron animado */}
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Menú Desplegable */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animation-fade-in-down">

                    {/* Opción para limpiar selección */}
                    <div
                        onClick={() => handleSelect('')}
                        className="px-4 py-3 text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 cursor-pointer border-b border-gray-50"
                    >
                        Ver todas
                    </div>

                    {/* Lista de categorías */}
                    <div className="max-h-60 overflow-y-auto">
                        {CATEGORIES.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => handleSelect(cat.id)}
                                className={`
                  px-4 py-3 text-sm cursor-pointer flex items-center justify-between
                  ${selected === cat.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
                `}
                            >
                                <span>{cat.name}</span>
                                {/* Check icon si está seleccionado */}
                                {selected === cat.id && (
                                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};