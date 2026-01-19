import { Box, Card, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// components/MainRankings.jsx
const RankingCard = ({ title, lists = [], tag, color, icon, rankingName }) => (
    <div className={`rounded-xl overflow-hidden shadow-md flex-1 bg-white border-t-8 ${color}`}>
        <div className="p-4 bg-gray-50/50">
            <h3 className="font-bold text-lg uppercase flex items-center gap-2">
                {title} <span className="text-xs font-normal normal-case opacity-70">({tag})</span>
            </h3>
        </div>
        <div className="p-5 space-y-4">
            <div className="flex justify-center">{icon}</div>
            {lists.map((item, idx) => (
                <Link to={item.path} className="curosr-pointer" key={idx}>
                    <Card className="p-5">
                        <Box>
                            <Box className="flex items-center">
                                <h4 className="text-2xl font-bold">{rankingName}</h4>
                                <Box className="p-2 px-4 bg-gray-50 rounded-lg ms-2 mt-2 md:mt-0">
                                    <Typography variant="caption" className="text-gray-600">
                                        {item.dateRange}
                                    </Typography>
                                </Box>
                            </Box>
                            {item.description && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
                        </Box>
                        {(idx + 1) !== lists.length && <Divider />}
                    </Card>
                </Link>
            ))}
        </div>
    </div>
);

export default function MainRankings({
    rankings = []
}) {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            {Object.keys(rankings).map((ranking, idx) => (
                <RankingCard
                    key={idx}
                    title={ranking}
                    lists={rankings[ranking]}
                    tag="Ranking general"
                    color="text-red-700"
                    rankingName="U-Sapiens"
                    icon={<div className="text-5xl text-red-700">🏆</div>}
                />
            ))}
        </div>
    );
}