import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

function formatTime(time) {
  if (!time || Number.isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function AdmissionsAudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progress = duration ? `${(currentTime / duration) * 100}%` : "0%";

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error("Error reproduciendo audio:", error);
    }
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;

    if (!audio || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1);

    audio.currentTime = percentage * duration;
    setCurrentTime(audio.currentTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  if (!audioUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <Box
        sx={{
          border: "1px solid #d9d9d9",
          borderRadius: "18px",
          backgroundColor: "#f7f7f7",
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          component="button"
          onClick={togglePlay}
          sx={{
            width: 42,
            height: 42,
            minWidth: 42,
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#d90000",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(217,0,0,0.25)",
            transition: "transform 0.2s ease",
            fontSize: "1rem",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          {isPlaying ? "❚❚" : "▶"}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#1f2937",
              lineHeight: 1.2,
              mb: 0.75,
            }}
          >
            Mensaje del Director de Admisiones
          </Typography>

          <Box
            ref={progressBarRef}
            onClick={handleSeek}
            sx={{
              height: 6,
              borderRadius: 999,
              backgroundColor: "#dddddd",
              overflow: "hidden",
              mb: 0.5,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: progress,
                height: "100%",
                backgroundColor: "#d90000",
                borderRadius: 999,
                transition: "width 0.1s linear",
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "0.78rem",
              color: "#9ca3af",
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
        </Box>

        <Box
          sx={{
            color: "#bdbdbd",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 20,
          }}
        >
          🔊
        </Box>
      </Box>
    </>
  );
}