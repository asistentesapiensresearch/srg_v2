// components/SecondarySections.jsx
import { Box, Divider } from '@mui/material';
import { FlaskConical, Globe, Database, Users, BarChart3, Microscope, FileText, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndicatorButton = ({ icon: Icon, label }) => (
    <button className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition w-full">
        <div className="text-gray-400">
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
    </button>
);

export default function SecondarySections({
    indicators = [],
    groups = []
}) {
    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Indicadores Específicos */}
            {indicators.length > 0 && <div className="space-y-4">
                <h3 className="text-gray-500 font-bold text-sm mb-4">Indicadores Específicos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {indicators.map(item => (
                        <Link to={item.path}>
                            <IndicatorButton icon={Microscope} label={item.title} />
                        </Link>
                    ))}
                </div>
            </div>}

            {/* 100 Mejores por Materia */}
            {groups.length > 0 && <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                    <h3 className="font-bold text-slate-800">Mejores Grupos</h3>
                </div>
                {groups.map((m, idx) => (
                <Link className="my-2" to={m.path} key={idx}>
                    <Divider />
                    <div className="p-4 md:p-6 bg-gray-50/30 flex items-start gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <BookOpen className="text-slate-700" size={32} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-800">{m.title}</h4>
                                    <p className="text-xs text-gray-400">{m.subCategory}</p>
                                </div>
                                <FileText className="text-gray-300" size={20} />
                            </div>
                            {m.description && <div dangerouslySetInnerHTML={{ __html: m.description }} />}
                        </div>
                    </div>
                    <Divider />
                </Link>
                ))}
            </div>}
        </div>
    );
}