import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

export default function GoogleAd({
  slotId,
  adUnitPath,
  responsive = true,
}) {
  const adRef = useRef(null);

  useEffect(() => {
    if (!window.googletag || !window.googletag.cmd) return;

    const { googletag } = window;
    let adSlot;

    googletag.cmd.push(() => {
      const sizes = responsive
        ? ["fluid", [270, 240], [300, 250], [728, 90], [320, 50], [970, 90], [300, 600]]
        : [[270, 240]];

      const divElement = document.getElementById(slotId);
      if (!divElement) return;

      const existingSlots = googletag.pubads().getSlots();
      const existing = existingSlots.find(
        (s) => s.getSlotElementId() === slotId
      );

      if (existing) {
        googletag.destroySlots([existing]);
      }

      adSlot = googletag.defineSlot(adUnitPath, sizes, slotId);

      if (adSlot) {
        adSlot.addService(googletag.pubads());
        googletag.display(slotId);
      }
    });

    return () => {
      if (window.googletag?.cmd && adSlot) {
        window.googletag.cmd.push(() => {
          window.googletag.destroySlots([adSlot]);
        });
      }
    };
  }, [slotId, adUnitPath, responsive]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        id={slotId}
        ref={adRef}
        style={{
          minWidth: "270px",
          minHeight: "240px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </Box>
  );
}

GoogleAd.propTypes = {
  slotId: PropTypes.string.isRequired,
  adUnitPath: PropTypes.string.isRequired,
  responsive: PropTypes.bool,
};