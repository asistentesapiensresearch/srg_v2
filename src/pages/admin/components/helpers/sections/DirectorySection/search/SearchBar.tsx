// src/view/sections/DirectorySection/search/SearchBar.tsx
interface Props {
    value: string;
    onChange: (val: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => {
    return (
        <div className="relative w-full mb-6">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar en el directorio..."
                // Estilos para UX clara y grande
                className="w-full p-4 pl-12 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-lg"
            />
            {/* Icono decorativo... */}
        </div>
    );
};