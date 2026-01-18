// src/view/sections/DirectorySection/filters/StatusFilter.tsx
const STATUS_OPTIONS = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'pending', label: 'Pendientes' },
];

interface Props {
    selected: string;
    onChange: (value: string) => void;
}

export const StatusFilter = ({ selected, onChange }: Props) => {
    console.log('rendered StatusFilter')
    return (
        <div className="flex bg-gray-100 p-1 rounded-lg">
            {STATUS_OPTIONS.map((option) => {
                const isActive = selected === option.value || (selected === '' && option.value === 'all');

                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${isActive
                                ? 'bg-white text-blue-600 shadow-sm' // Estado Activo: Elevado y brillante
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200' // Inactivo: Sutil
                            }
            `}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};