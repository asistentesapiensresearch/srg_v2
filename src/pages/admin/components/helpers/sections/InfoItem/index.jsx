import { Box } from "@mui/material";
import { useMemo } from "react";
import DynamicIcon from "../../../builder/helpers/DynamicIcon";
import { useSelector } from "react-redux";


const propertiesAdmitted = {
    admisiones: {
        fieldAdmit: ["email","location","phone"],
        fields: {
            email: {
                label: "Correo",
                icon: "Mail"
            },
            location: {
                label: "Dirección",
                icon: "MapPin"
            },
            phone: {
                label: "Teléfono",
                icon: "Phone"
            }
        }
    }
}


const InfoItemWrapper = ({
    children,
    spacingItem,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",    
                gap: spacingItem,
            }}
        >
            {children}
        </Box>
    )
}


const InfoItem = ({
    mode,
    selectValue,
    itemsCustom,
    // css
    sizeIcon,
    colorIcon,
    colorTitle,
    paddingItem,
    spacingItem,
    spacingIconTitle
}) => {

    const { data } = useSelector((state) => state.sections.fetchData.databaseDownload);


    const items = useMemo(() => {

        if ( mode=== "custom") {
            return itemsCustom;
        }

        if(mode === "database") {
            if (!selectValue || !data) {
                return [];
            }
            const rawField = data[selectValue];
            if (!rawField) return [];
    
            try {
                const parsed =
                    typeof rawField === "string"
                        ? JSON.parse(rawField)
                        : rawField;
    
                const config  = propertiesAdmitted[selectValue] || [];
    
                return Object.entries(parsed)
                .filter(([key]) => config.fieldAdmit.includes(key))
                .map(([key, value]) => ({
                    icon: config.fields[key].icon,
                    label: config.fields[key].label || key,
                    value
                }));
    
            } catch (error) {
                console.error("Error parseando campo:", error);
                return [];
            }
        }


    }, [mode, data, selectValue, itemsCustom]);


    return (
        <InfoItemWrapper spacingItem={spacingItem}>
            {
                items && items.map( (el,idx) => {
                    return <Box
                            key={`infoItem-${idx}`}
                            sx={{
                                display: "flex",
                                gap: spacingIconTitle,
                                padding: paddingItem,
                            }}
                        >
                            <DynamicIcon name={el.icon} color={colorIcon} size={sizeIcon} />
                            <div>
                                <h4 style={{
                                    fontWeight: "bold",
                                    color: {colorTitle}
                                }} >{el.label}</h4>
                                <p>{el.value}</p>
                            </div>
                        </Box>
                })
            }
        </InfoItemWrapper>
    )
}

export default InfoItem