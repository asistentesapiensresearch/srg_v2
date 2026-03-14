import DataSourceManager from "@src/core/data/DataSourceManager";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import DynamicIcon from "../../../builder/helpers/DynamicIcon";


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
    dataSourceMode,
    modelName,
    searchField,
    searchValue,
    selectValue,
    // css
    sizeIcon,
    colorIcon,
    colorTitle,
    paddingItem,
    spacingItem,
    spacingIconTitle
}) => {

    const [fetchedRecord, setFetchedRecord] = useState(null);

    useEffect(() => {
        if ((dataSourceMode !== 'custom' && mode != "database") || !modelName || !searchField || !searchValue) {
            return;
        }
        const fetchDataModel = async () => {
            try {
            const { data }  = await DataSourceManager.findByField(modelName, searchField, searchValue, 1);
            if(data && data.length > 0) {
                setFetchedRecord(data[0]);
            } else {
                setFetchedRecord(null);
            }
            } catch (error) {
                console.error("Error buscando en BD:", error);
                setFetchedRecord(null);
            } 

        }
        fetchDataModel();
    }, [mode, dataSourceMode, modelName, searchField, searchValue]);

    const items = useMemo(() => {

        if(mode === "database") {
            if (!selectValue || !fetchedRecord) {
                return [];
            }
            const rawField = fetchedRecord[selectValue];
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


    }, [mode, fetchedRecord, selectValue]);


    return (
        <InfoItemWrapper spacingItem={spacingItem}>
            {
                items && items.map( el => {
                    return <Box
                        sx={{
                        }}
                    > 
                        <Box
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
                    </Box>
                })
            }
        </InfoItemWrapper>
    )
}

export default InfoItem
