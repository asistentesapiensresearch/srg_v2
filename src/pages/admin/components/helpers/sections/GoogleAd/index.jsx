import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

/**
 * GoogleAd Component
 * Renderea un bloque de anuncios de Google Ad Manager (GPT) de forma segura.
 */
export default function GoogleAd({
  client = "div-gpt-ad-1662608593804-0",
  slot = "/52413523/2122",
  format = "auto",
  responsive = true,
  padding = 16,
  background = "transparent",
}) {
  const adRef = useRef(null);

  useEffect(() => {
    let adSlot;
    const { googletag } = window;

    if (googletag && googletag.cmd) {
      googletag.cmd.push(() => {
        const sizes = responsive 
          ? ['fluid', [270, 240], [300, 250], [728, 90], [320, 50], [970, 90], [300, 600]] 
          : [[270, 240]];

        const divElement = document.getElementById(client);

        if (divElement) {
          const slots = googletag.pubads().getSlots();
          const existingSlot = slots.find(s => s.getSlotElementId() === client);
          if (existingSlot) {
            googletag.destroySlots([existingSlot]);
          }

          adSlot = googletag.defineSlot(slot, sizes, client);

          if (adSlot) {
            adSlot.addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
            googletag.display(client);
          }
        }
      });
    }

    return () => {
      if (googletag && googletag.cmd && adSlot) {
        googletag.cmd.push(() => {
          googletag.destroySlots([adSlot]);
        });
      }
    };
  }, [client, slot, responsive]);

  return (
    <Box sx={{ padding: `${padding}px`, background, width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <div 
        id={client} 
        ref={adRef} 
        style={{ 
          minWidth: "270px", 
          minHeight: "240px", 
          display: "flex", 
          justifyContent: "center",
          alignItems: "center"
        }} 
      >
      </div>
    </Box>
  );
}

GoogleAd.propTypes = {
  client: PropTypes.string,
  slot: PropTypes.string,
  format: PropTypes.string,
  responsive: PropTypes.bool,
  padding: PropTypes.number,
  background: PropTypes.string,
};
