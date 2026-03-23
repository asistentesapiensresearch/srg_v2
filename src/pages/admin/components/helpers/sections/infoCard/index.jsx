import { Box } from '@mui/material';
import React, { useMemo } from 'react'

const InfoCard = ({
    itemsCustom,
    gap,
    paddingVertical,
    bgCard = "#FCF3F4",
    bgBorde = "#C8102E",

}) => {

    const items = useMemo(() => { return (itemsCustom) ? itemsCustom : []}, [itemsCustom])

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap,
                padding: `0px ${paddingVertical}px`
            }}
        >
        {
            items && items.map( (el, idx) => {
                return <Box
                    key={`infoCard-${idx}`}
                    className="
                        flex items-center gap-4
                        p-4
                        shadow-sm
                        rounded-r-xl
                        hover:shadow-md
                        transition-all duration-200
                        hover:scale-105
                        "
                    style={{
                        borderLeft: `5px solid ${bgBorde}`,
                        backgroundColor: bgCard,
                    }}
                    >
                    {/* Contenido */}
                    <div>
                        <h5 className="font-semibold">
                            {el.label}
                        </h5>
                        <p className="text-sm">
                            {el.value}
                        </p>
                    </div>
                </Box>
            })
        }
        </Box>
    )
}

export default InfoCard;
