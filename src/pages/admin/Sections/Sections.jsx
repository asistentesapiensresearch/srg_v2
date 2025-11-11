import { useState } from "react";
import { useSections } from "@src/hooks/useSections";

import { Button, Typography } from "@mui/material";
import { PlusIcon } from "lucide-react";

import { SectionForm } from "./SectionForm";
import { SectionCard } from "./SectionCard";
import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

const Sections = () => {

    const { sections, setSections } = useSections();
    const [openForm, setOpenForm] = useState(false);
    const [selectedSection, setSelectedSection] = useState(false);

    const handleClose = (section) => {
        setOpenForm(false);
        console.log(section)
        if(section)
            setSections((values) => {
                return [
                    ...values.filter(v => v.id !== section.id),
                    section
                ]
            });
    };

    const handleClickOpen = () => {
        setOpenForm(true);
    };

    const handleClickEdit = (section) => {
        setSelectedSection(section);
        setOpenForm(true);
    }

    const handleClickDelete = async(section) => {
        if(confirm(`Estas seguro de eliminar la sección ${section.name}?`)){
            const researchs = await section.Researchs();
            if(researchs.length > 0){
                alert('La sección tiene investigaciones asociadas, para eliminar debe cambiarlas o eliminarlas.')
            } else {
                await apiSyncService.delete('Section', section.id);
                setSections(values => values.filter(v => v.id !== section.id));
            }
        }
    }

    return (
        <>
            <SectionForm
                section={selectedSection}
                open={openForm}
                onClose={handleClose}
            />
            <div className="flex items-center">
                <div className="me-2">
                    <Typography component="div" variant="h5">
                        Secciones
                    </Typography>
                </div>
                <Button variant="contained" onClick={handleClickOpen}>
                    <PlusIcon size={20} />
                </Button>
            </div>
            <div className="flex gap-3 mt-5">
                {sections.map(section => (
                    <div key={section.id}>
                        <SectionCard
                            isAdmin={true}
                            section={section}
                            handleClickEdit={handleClickEdit}
                            handleClickDelete={handleClickDelete}/>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Sections;
