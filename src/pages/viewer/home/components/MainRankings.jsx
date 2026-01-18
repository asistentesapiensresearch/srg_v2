// components/MainRankings.jsx
const RankingCard = ({ title, subtitle, tag, color, icon, rankingName }) => (
    <div className={`rounded-xl overflow-hidden shadow-md flex-1 bg-white border-t-8 ${color}`}>
        <div className="p-4 bg-gray-50/50">
            <h3 className="font-bold text-lg uppercase flex items-center gap-2">
                {title} <span className="text-xs font-normal normal-case opacity-70">({tag})</span>
            </h3>
        </div>
        <div className="p-8 text-center space-y-4">
            <div className="flex justify-center">{icon}</div>
            <h4 className="text-2xl font-bold">{rankingName}</h4>
            <p className="text-sm text-gray-500">(Ranking General)</p>
            <p className="text-xs text-gray-400 px-4">Un ansa jente naula seaid padlam duhente de les osamupsidis.</p>
            <div className="flex gap-2 justify-center pt-4">
                <button className={`px-6 py-2 rounded text-white text-sm font-bold ${color.replace('border-', 'bg-')}`}>
                    Ver Ranking 2024
                </button>
                <button className="px-6 py-2 rounded border border-gray-200 text-blue-600 text-sm font-medium">
                    Metodología
                </button>
            </div>
        </div>
    </div>
);

export default function MainRankings() {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <RankingCard
                title="UNIVERSIDADES"
                tag="El Ecosistema U-Sapiens"
                color="border-blue-700"
                rankingName="U-Sapiens"
                icon={<div className="text-5xl text-yellow-500">🏆</div>}
            />
            <RankingCard
                title="COLEGIOS"
                tag="Educación Básica"
                color="border-orange-500"
                rankingName="Col-Sapiens"
                icon={<div className="text-5xl text-blue-900">🎓</div>}
            />
        </div>
    );
}