import { Tooltip } from "@mui/material";
import { EditIcon, DeleteIcon } from "lucide-react";
import { InfoIcon } from "../../../../components/icons";
import { StorageImage } from "@aws-amplify/ui-react-storage";

export const SectionCard = ({
    isAdmin = false,
    section,
    handleClickEdit,
    handleClickDelete
}) => {

    return (
        <div className="flex gap-2 text-white font-medium p-1 px-4 rounded-lg text-md items-center" style={{ backgroundColor: section.color }}>
            {section.icon && (
                <div className="w-5 flex">
                    <StorageImage alt="sleepy-cat" path={section.icon} className="rounded-[50%!important]" />
                </div>
            )}
            <span>{section.name}</span>
            <div className="flex gap-2 items-center">
                <Tooltip title={section.description}>
                    <div>
                        <InfoIcon />
                    </div>
                </Tooltip>
                {
                    isAdmin && (
                        <>
                            <EditIcon className="cursor-pointer" onClick={() => handleClickEdit(section)} />
                            <DeleteIcon className="cursor-pointer" onClick={() => handleClickDelete(section)} />
                        </>
                    )
                }
            </div>
        </div>
    )
}