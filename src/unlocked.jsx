import { useNavigate } from "react-router-dom";
import { Confetti, ACCENT, APP_BG, BADGES, FACE_POINTS, Fox, Glyph, PALETTES } from "./assets/assets";
import { useEffect } from "react";
import { getBadges } from "./storage";

const fredoka = { fontFamily: "'Fredoka', sans-serif" };
const resetButton = { border: 0, padding: 0, font: "inherit", cursor: "pointer" };

const STAR = "50,6 63,36 95,38 70,59 78,92 50,74 22,92 30,59 5,38 37,36";

const Unlocked = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const badgeId = localStorage.getItem("scannedBadge");
  const badge = BADGES.find((b) => b.id === badgeId);

  const earnedBadges = username ? getBadges(username) : [];

  const mainBadges = BADGES.filter((b) => !b.secret);
  const secretBadges = BADGES.filter((b) => b.secret);

  const discoveredSecretCount = secretBadges.filter((b) => earnedBadges.includes(b.id)).length;
  const showSecretSection = discoveredSecretCount > 0;

  const total = showSecretSection ? BADGES.length : mainBadges.length;
  const count = earnedBadges.filter((id) => BADGES.some((b) => b.id === id)).length;
  const remaining = total - count;
  const percent = Math.round((count / total) * 100);

  const isSecretBadge = badge?.secret;

  useEffect(() => {
    if (!username) {
      navigate("/login", { replace: true });
      return;
    }
    if (!badge) {
      navigate("/home", { replace: true });
    }
  }, [badge, username, navigate]);

  if (!badge) return null;

  const palette = PALETTES[badge.palette];
  const ringColor = palette[1];

  return (
    <div style={{ position: "relative", overflow: "hidden", ...APP_BG, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif", minHeight: "100dvh" }}>
      <Confetti />

      <div style={{ position: "relative", maxWidth: 430, margin: "0 auto", minHeight: "100dvh", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 8, background: isSecretBadge ? "var(--color-gold)" : "var(--color-accent-strong)", color: isSecretBadge ? "#000000" : "var(--color-on-accent)", borderRadius: 999, padding: "8px 16px", ...fredoka, fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>
          <svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points={STAR} fill={isSecretBadge ? "#000000" : "var(--color-on-accent)"} />
          </svg>
          {isSecretBadge ? "¡NUEVA INSIGNIA SECRETA!" : "¡NUEVA INSIGNIA!"}
        </div>

        <svg width="260" height="260" viewBox="0 0 260 260" role="img" aria-label={`Insignia ${badge.name}`} style={{ marginTop: 20 }}>
          <polygon points="130,6 237.4,68 237.4,192 130,254 22.6,192 22.6,68" fill="none" stroke={ringColor} strokeWidth="2" opacity="0.18" />
          <polygon points="130,20 225.3,75 225.3,185 130,240 34.7,185 34.7,75" fill="none" stroke={ringColor} strokeWidth="2" opacity="0.32" />
          <g transform="translate(30,30) scale(2)">
            {FACE_POINTS.map((points, i) => (
              <polygon key={i} points={points} fill={palette[i]} />
            ))}
            <Glyph type={badge.glyph} />
          </g>
        </svg>

        <div style={{ marginTop: 14, ...fredoka, fontSize: 32, fontWeight: 600, lineHeight: 1.2 }}>
          {badge.name}
        </div>
        
        <div style={{ marginTop: 6, padding: "0 24px", fontSize: 15, fontWeight: 600, color: "var(--color-text-muted)" }}>
          {isSecretBadge
            ? "¡Encontraste una insignia secreta! Tu total de insignias se actualizó."
            : "Encontraste el código escondido junto a la sala de lectura."}
        </div>

        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8, background: "var(--color-surface)", borderRadius: 999, padding: "10px 18px" }}>
          <svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points={STAR} fill="var(--color-gold)" />
          </svg>
          <span style={{ ...fredoka, fontSize: 20, fontWeight: 600 }}>+50 pts</span>
        </div>

        <div style={{ margin: "20px 24px 0", alignSelf: "stretch", boxSizing: "border-box", background: "var(--color-surface)", borderRadius: 22, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
          <Fox width={60} height={66} happy />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...fredoka, fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>
              {count} de {total} insignias
            </div>
            
            <div style={{ display: remaining > 0 ? "block" : "none", fontSize: 14, fontWeight: 600, color: "var(--color-text-soft)", marginTop: 2 }}>
              Solo quedan {remaining}. ¡Vas en racha!
            </div>
            
            <div style={{ display: remaining === 0 ? "block" : "none", fontSize: 14, fontWeight: 600, color: "var(--color-text-soft)", marginTop: 2 }}>
              ¡Felicidades, los encontraste todos!
            </div>

            <div style={{ marginTop: 10, height: 10, borderRadius: 999, background: "var(--color-surface-deep)", overflow: "hidden" }}>
              <div style={{ width: `${percent}%`, height: "100%", borderRadius: 999, background: ACCENT, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "auto", alignSelf: "stretch", padding: "24px 24px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => navigate("/scan")}
            style={{ ...resetButton, height: 56, borderRadius: 18, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 18, fontWeight: 600 }}
          >
            Escanear el siguiente código
          </button>
          <button
            onClick={() => navigate("/home")}
            style={{ ...resetButton, height: 48, borderRadius: 16, border: "2px solid var(--color-border)", background: "none", color: "var(--color-text-soft)", fontSize: 15, fontWeight: 800, boxSizing: "border-box" }}
          >
            Ver mi colección
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unlocked;