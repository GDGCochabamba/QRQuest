import { useNavigate } from "react-router-dom";


import {Confetti, ACCENT, BADGES, FACE_POINTS, Fox, Glyph, PALETTES } from "./assets/assets";
import { useEffect, useState } from "react";

const fredoka = { fontFamily: "'Fredoka', sans-serif" };
const resetButton = { border: 0, padding: 0, font: "inherit", cursor: "pointer" };

const STAR = "50,6 63,36 95,38 70,59 78,92 50,74 22,92 30,59 5,38 37,36";
const Unlocked = () => {
  const [scannedBadges, setScannedBadges] = useState("");
  const navigate = useNavigate();
  const badgeId = localStorage.getItem("scannedBadge");
  const badge = BADGES.find((b) => b.id === badgeId);
  
  // No valid badge stored: nothing to show, go back
  useEffect(() => {
    if (!badge) navigate("/home", { replace: true });
  }, [badge, navigate]);

  if (!badge) return null;

  const rawScannedBadges = localStorage.getItem("scannedBadges");
  if (rawScannedBadges) {
    setScannedBadges(JSON.parse(rawScannedBadges));
  }

  const palette = PALETTES[badge.palette];
  const ringColor = palette[1]; // the main color of the gem

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#130C26",
        color: "#F5EEFF",
        fontFamily: "'Nunito', sans-serif",
        minHeight: "100dvh",
      }}
    >
      <Confetti />

      <div
        style={{
          position: "relative",
          maxWidth: 430,
          margin: "0 auto",
          minHeight: "100dvh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* NEW BADGE pill */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FF5FA2",
            color: "#2A0B20",
            borderRadius: 999,
            padding: "8px 16px",
            ...fredoka,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points={STAR} fill="#2A0B20" />
          </svg>
          ¡NUEVA INSIGNIA!
        </div>

        {/* Badge */}
                    <svg
            width="260"
            height="260"
            viewBox="0 0 260 260"
            role="img"
            aria-label={`Insignia ${badge.title}`}
            style={{ marginTop: 20 }}
            >
            <polygon points="130,6 237.4,68 237.4,192 130,254 22.6,192 22.6,68" fill="none" stroke={ringColor} strokeWidth="2" opacity="0.18" />
            <polygon points="130,20 225.3,75 225.3,185 130,240 34.7,185 34.7,75" fill="none" stroke={ringColor} strokeWidth="2" opacity="0.32" />
            <g transform="translate(30,30) scale(2)">
                {FACE_POINTS.map((points, i) => (
                <polygon key={i} points={points} fill={palette[i]} />
                ))}
                <Glyph type={badge.glyph} />
            </g>
            </svg>

{/* Title */}
<div style={{ marginTop: 14, ...fredoka, fontSize: 32, fontWeight: 600, lineHeight: 1.2 }}>
  {badge.title}
</div>
<div style={{ marginTop: 6, padding: "0 24px", fontSize: 15, fontWeight: 600, color: "#C9BBEE" }}>
  {badge.description}
</div>

        {/* Title */}
        <div style={{ marginTop: 14, ...fredoka, fontSize: 32, fontWeight: 600, lineHeight: 1.2 }}>
          {badge.name}
        </div>
        <div style={{ marginTop: 6, padding: "0 24px", fontSize: 15, fontWeight: 600, color: "#C9BBEE" }}>
          Encontraste el código escondido junto a la sala de lectura.
        </div>

        {/* Points pill */}
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8, background: "#2A1D57", borderRadius: 999, padding: "10px 18px" }}>
          <svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points={STAR} fill="#FFB938" />
          </svg>
          <span style={{ ...fredoka, fontSize: 20, fontWeight: 600 }}>+50 pts</span>
        </div>

        {/* Progress card */}
        <div
          style={{
            margin: "20px 24px 0",
            alignSelf: "stretch",
            boxSizing: "border-box",
            background: "#2A1D57",
            borderRadius: 22,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            textAlign: "left",
          }}
        >
          <Fox width={60} height={66} happy />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...fredoka, fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>6 de 9 insignias</div>
            <div style={{ display: (scannedBadges.length == 9) ? "none" : "block", fontSize: 14, fontWeight: 600, color: "#DCCFFF", marginTop: 2 }}>
              Solo quedan { 9 - scannedBadges.length }. ¡Vas en racha!
            </div>
            <div style={{ display: (scannedBadges.length == 9) ? "block" : "none", fontSize: 14, fontWeight: 600, color: "#DCCFFF", marginTop: 2 }}>
              ¡Felicidades, los encontraste todos!
            </div>
            <div style={{ marginTop: 10, height: 10, borderRadius: 999, background: "#1A1033", overflow: "hidden" }}>
              <div style={{ width: "67%", height: "100%", borderRadius: 999, background: ACCENT }} />
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div style={{ marginTop: "auto", alignSelf: "stretch", padding: "24px 24px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => navigate("/scan")}
            style={{ ...resetButton, height: 56, borderRadius: 18, background: ACCENT, color: "#2A0B20", ...fredoka, fontSize: 18, fontWeight: 600 }}
          >
            Escanear el siguiente código
          </button>
          <button
            onClick={() => navigate("/home")}
            style={{ ...resetButton, height: 48, borderRadius: 16, border: "2px solid #3A2A70", background: "none", color: "#DCCFFF", fontSize: 15, fontWeight: 800, boxSizing: "border-box" }}
          >
            Ver mi colección
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unlocked;