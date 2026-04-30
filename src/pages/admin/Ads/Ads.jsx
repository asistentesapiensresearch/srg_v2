import { useCallback, useState } from "react";
import { useAds } from "./hooks/useAds";
import { Button, Typography } from "@mui/material";
import { PlusIcon } from "lucide-react";
import GoogleAdForm from "./components/GoogleAdForm";
import GoogleAdCard from "./components/GoogleAdCard";

const Ads = () => {
  const {
    loading,
    error,
    googleAds,
    createGoogleAd,
    deleteGoogleAd,
    updateGoogleAd,
  } = useAds();

  const [openForm, setOpenForm] = useState(false);
  const [selectedGoogleAd, setSelectedGoogleAd] = useState(null);

  const handleClose = () => {
    setSelectedGoogleAd(null);
    setOpenForm(false);
  };

  const handleClickOpen = () => {
    setSelectedGoogleAd(null);
    setOpenForm(true);
  };

  const handleClickEdit = useCallback((googleAd) => {
    setSelectedGoogleAd(googleAd);
    setOpenForm(true);
  }, []);

  const handleClickDelete = useCallback(
    async (googleAd) => {
      if (!confirm(`¿Eliminar el anuncio "${googleAd.slotId}"?`)) return;
      await deleteGoogleAd(googleAd.id);
    },
    [deleteGoogleAd]
  );

  return (
    <>
      {openForm && (
        <GoogleAdForm
          googleAd={selectedGoogleAd}
          onClose={handleClose}
          create={createGoogleAd}
          update={updateGoogleAd}
        />
      )}

      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <Typography variant="h5" fontWeight="bold" className="text-gray-800">
            Anuncios de Google Ad
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Gestiona los anuncios de Google
          </Typography>
        </div>

        <Button
          variant="contained"
          onClick={handleClickOpen}
          sx={{ borderRadius: 2, textTransform: "none" }}
          startIcon={<PlusIcon size={18} />}
        >
          Nuevo Anuncio
        </Button>
      </div>

      {error && <p className="text-red-500 px-2">{error}</p>}

      <div className="grid gap-4 grid-cols-4">
        {googleAds.map((ad) => (
            <GoogleAdCard
                key={ad.id}
                ad={ad}
                onEdit={handleClickEdit}
                onDelete={handleClickDelete}
            />
        ))}
      </div>
    </>
  );
};

export default Ads;