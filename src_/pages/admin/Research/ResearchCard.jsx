import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Collapse, IconButton, Menu, MenuItem, Skeleton, Tooltip, Typography } from "@mui/material";
import { EditIcon, DeleteIcon, MoreVerticalIcon } from "lucide-react";
import { apiSyncService } from '@core/infrastructure/api/apiSync.service'
import { InfoIcon } from "../../../components/icons";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";

export const ResearchCard = ({
    isAdmin = false,
    loading,
    research = {},
    handleClickEdit,
    handleClickDelete
}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Card>
            <CardHeader
                avatar={
                    <div className="w-20 h-20">
                        {
                            loading ?
                                <Skeleton variant="circular" className="w-[100%!important] h-[100%!important]" /> :
                                <Avatar aria-label="recipe" className="w-[100%!important] h-[100%!important] p-3">
                                    <StorageImage alt="sleepy-cat" path={research.icon} className="h-[100%!important]" />
                                </Avatar>
                        }
                    </div>
                }
                action={
                    !loading && (
                        <>
                            <IconButton aria-label="settings" onClick={handleOpenMenu}>
                                <MoreVerticalIcon />
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseMenu}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                            >
                                <Link to={`/admin/research/${research.id}`}>
                                    <MenuItem>
                                        Personalizar
                                    </MenuItem>
                                </Link>

                                <MenuItem onClick={() => { handleCloseMenu(); handleClickEdit(research); }}>
                                    Editar
                                </MenuItem>

                                <MenuItem onClick={() => { handleCloseMenu(); handleClickDelete(research); }}>
                                    Eliminar
                                </MenuItem>
                            </Menu>
                        </>
                    )
                }
                title={!loading ? research?.title : <Skeleton variant="rectangular" width={100} height={20} />}
                subheader={!loading ? `Versión: ${research?.version ?? 1}` : <Skeleton variant="rectangular" height={20} className="w-full mt-1" />}
            />

            <CardContent className="pt-[0!important]">
                {loading ? (
                    <Skeleton variant="rounded" height={100} className="w-full mt-1" />
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: research?.shortDescription || "" }} />
                )}
            </CardContent>
        </Card>
    );
};