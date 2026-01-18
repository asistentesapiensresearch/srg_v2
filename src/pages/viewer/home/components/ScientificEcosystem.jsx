// components/ScientificEcosystem.jsx
import { Microscope, BookOpen, Building2 } from 'lucide-react';

const EcosystemCard = ({ icon: Icon, title, description, links }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-3">
        <div className="text-slate-800 bg-gray-50 p-3 rounded-full">
            <Icon size={28} strokeWidth={1.5} />
        </div>
        <h4 className="font-bold text-xs uppercase text-slate-900 tracking-tight leading-tight h-8 flex items-center">
            {title}
        </h4>
        {description && <p className="text-[11px] text-gray-400 leading-relaxed">{description}</p>}
        {links && (
            <div className="flex items-center gap-2 text-slate-600 font-medium text-xs mt-2">
                <BookOpen size={14} />
                <span>{links}</span>
            </div>
        )}
    </div>
);

export default function ScientificEcosystem() {
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Ecosistema Científico</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <EcosystemCard
                    icon={Microscope}
                    title="Mejores Grupos de Investigación"
                    description="Inaliciores is neesiostcatontis mosenrio prota. Indidibone ist a polas e plastes."
                />
                <EcosystemCard
                    icon={BookOpen}
                    title="Publicaciones y Revistas"
                    links="Revistas-Sapiens"
                />
                <EcosystemCard
                    icon={Building2}
                    title="Organizaciones"
                    links="Org-Sapiens"
                />
            </div>
        </section>
    );
}