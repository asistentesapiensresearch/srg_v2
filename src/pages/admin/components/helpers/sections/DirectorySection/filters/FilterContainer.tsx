// src/view/sections/DirectorySection/filters/FilterContainer.tsx
import { CategoryFilter } from './CategoryFilter'; // Sub-componentes
import { StatusFilter } from './StatusFilter';

interface FilterState {
    category: string;
    status: string;
}

interface Props {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: string) => void;
}

export const FilterContainer = ({ filters, onFilterChange }: Props) => {
    console.log('rendered FilterContainer')
    return (
        // Flex container para alinearlos horizontalmente
        <div className="flex flex-wrap items-center gap-3 mb-8">

            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide mr-2">
                Filtrar:
            </span>

            {/* Componentes modulares dentro de filters/ */}
            <CategoryFilter
                selected={filters.category}
                onChange={(val) => onFilterChange('category', val)}
            />

            <StatusFilter
                selected={filters.status}
                onChange={(val) => onFilterChange('status', val)}
            />

            {/* Botón de limpiar (UX vital) */}
            {(filters.category || filters.status) && (
                <button
                    onClick={() => { /* lógica reset */ }}
                    className="text-sm text-red-500 hover:underline ml-auto"
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    );
};