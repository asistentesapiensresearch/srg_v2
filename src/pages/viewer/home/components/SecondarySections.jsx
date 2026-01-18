// components/SecondarySections.jsx
import { FlaskConical, Globe, Database, Users, BarChart3, Microscope, FileText, BookOpen } from 'lucide-react';

const IndicatorButton = ({ icon: Icon, label }) => (
    <button className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition w-full">
        <div className="text-gray-400">
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
    </button>
);

export default function SecondarySections() {
    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Indicadores Específicos */}
            <div className="space-y-4">
                <h3 className="text-gray-500 font-bold text-sm mb-4">Indicadores Específicos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <IndicatorButton icon={FlaskConical} label="ART-Sapiens" />
                    <IndicatorButton icon={Globe} label="ART-Sapiens" />
                    <IndicatorButton icon={Database} label="DTI-Sapiens" />
                    <IndicatorButton icon={BarChart3} label="GNC-Sapiens" />
                    <IndicatorButton icon={Users} label="GNC-Sapiens" />
                    <IndicatorButton icon={Microscope} label="FRH-Sapiens" />
                </div>
            </div>

            {/* 100 Mejores por Materia */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                    <h3 className="font-bold text-slate-800">100 Mejores por Materia</h3>
                </div>
                <div className="p-6 bg-gray-50/30 flex items-start gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <BookOpen className="text-slate-700" size={32} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-slate-800">100 Mejores por Materia</h4>
                                <p className="text-xs text-gray-400">per Materia</p>
                            </div>
                            <FileText className="text-gray-300" size={20} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Oupitata Poinises</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider text-right italic">Cotiottrts Pesisda</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}