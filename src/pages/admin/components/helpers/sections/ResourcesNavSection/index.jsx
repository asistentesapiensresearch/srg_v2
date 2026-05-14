import { Box } from "@mui/material";
import DynamicIcon from "../../../builder/helpers/DynamicIcon";

const quoteTextStyle = {
    textAlign: "center",
    m: 0,
    fontSize: { xs: "13px", md: "14px" },
    lineHeight: 1.45,
    fontWeight: 500,
    opacity: 0.95,
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
};

const ResourcesNavSection = ({
    resources,
    sizeIcon,
    colorIcon
}) => {
    console.log({resources, sizeIcon, colorIcon});
    /* <DynamicIcon name={el.icon} color={colorIcon} size={sizeIcon} /> */
  return (
    <Box sx={{
        px: 2,
        py: 6,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 6,
    }}>
      {
        resources?.map( (el,index) => (<a href={el.url_resource} target="_blank" style={{ textDecoration: "none" }} key={`link_resource_${index}`}>
            <Box 
                sx={{
                    position: "relative",
                    backgroundColor: "#c00007",
                    color: "#fff",
                    px: 2,
                    pt: 6,
                    pb: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "12px",
                    gap: 1,
                    '&:hover': {
                        scale: 1.1,
                    }
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: -35,
                        borderRadius: "50%",
                        p: 1,
                        overflow: "hidden",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            padding: "4px",
                            background:
                                "conic-gradient(from 0deg, transparent 0deg, transparent 220deg, #f4a3a3 260deg, #ffd1d1 300deg, #f4a3a3 340deg, transparent 360deg)",
                            animation: "spinBorder 3s linear infinite",

                            WebkitMask:
                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                        },

                        "@keyframes spinBorder": {
                            "0%": {
                                transform: "rotate(0deg)",
                            },
                            "100%": {
                                transform: "rotate(360deg)",
                            },
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            backgroundColor: "#c00007",
                            borderRadius: "50%",
                            p: 1,
                        }}
                    >
                        <DynamicIcon name={el.icon} color={"#fff"} size={50} /> 
                    </Box>
                </Box>
                <h5 style={{color: "#fff"}}>{el.label}</h5>
                <Box component="p" sx={quoteTextStyle}>
                    {el.description}
                </Box>
            </Box>
        </a>
        ))
      }
    </Box>
  )
}

export default ResourcesNavSection
