import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBadges } from "./storage";
import { APP_BG, BADGES, FACE_POINTS, Fox, Glyph, PALETTES } from "./assets/assets";
import { ACCENT } from "./assets/assets";

const fredoka = { fontFamily: "'Fredoka', sans-serif" };

const resetButton = {
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  cursor: "pointer",
};

const Gem = ({ palette, glyph }) => (
  <svg width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
    {FACE_POINTS.map((points, i) => (
      <polygon key={i} points={points} fill={PALETTES[palette][i]} />
    ))}
    <Glyph type={glyph} />
  </svg>
);

const LockedGem = () => (
  <svg width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
    <polygon
      points="50,6 88,28 88,72 50,94 12,72 12,28"
      fill="var(--color-lock-fill)"
      stroke="var(--color-lock-border)"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <rect x="39" y="48" width="22" height="17" rx="3" fill="var(--color-lock)" />
    <path d="M43 48 v-6 a7 7 0 0 1 14 0 v6" stroke="var(--color-lock)" strokeWidth="3.5" fill="none" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const earned = username ? getBadges(username) : [];

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!username) {
      navigate("/login", { replace: true });
      return;
    }
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
  };

  const mainBadges = BADGES.filter((b) => !b.secret);
  const secretBadges = BADGES.filter((b) => b.secret);

  const discoveredSecretCount = secretBadges.filter((b) => earned.includes(b.id)).length;
  const showSecretSection = discoveredSecretCount > 0;

  const total = showSecretSection ? BADGES.length : mainBadges.length;
  const count = BADGES.filter((b) => earned.includes(b.id)).length;
  const remaining = total - count;
  const percent = Math.round((count / total) * 100);

  return (
    <div style={{ ...APP_BG, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif", minHeight: "100vh" }}>
      <div inert={showLogoutModal ? "" : undefined} style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 130 }}>
        <div style={{ padding: "28px 20px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-dim)" }}>Bienvenido de nuevo</div>
            <div style={{ ...fredoka, fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>¡Hola, {username}!</div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-surface)", borderRadius: 999, padding: "8px 12px" }}>
              <svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true">
                <polygon points="50,6 63,36 95,38 70,59 78,92 50,74 22,92 30,59 5,38 37,36" fill="var(--color-gold)" />
              </svg>
              <span style={{ ...fredoka, fontSize: 15, fontWeight: 600 }}>{earned.length * 10} pts</span>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              aria-label="Cerrar sesión"
              style={{
                ...resetButton,
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--color-surface)",
                border: "2px solid var(--color-border)",
                color: "#ff3b5c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        <div style={{ margin: "18px 20px 0", position: "relative", overflow: "hidden", background: "var(--color-card)", borderRadius: 24, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="150" height="140" viewBox="0 0 150 140" aria-hidden="true" style={{ position: "absolute", right: 0, top: 0 }}>
            <polygon points="150,0 60,0 150,70" fill="var(--color-card-facet-1)" />
            <polygon points="150,70 60,0 110,110" fill="var(--color-card-facet-2)" opacity="0.8" />
            <polygon points="150,70 110,110 150,140" fill="var(--color-card-facet-3)" />
          </svg>
          <Fox />
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <div style={{ ...fredoka, fontSize: 22, fontWeight: 600, lineHeight: 1.2 }}>
              {count} de {total} insignias
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-soft)", marginTop: 4, lineHeight: 1.35 }}>
              {remaining > 0
                ? `${remaining} ${remaining === 1 ? "código QR más está escondido" : "códigos QR más están escondidos"} por el campus.`
                : "¡Los encontraste todos!"}
            </div>
            <div style={{ marginTop: 12, height: 10, borderRadius: 999, background: "var(--color-surface-deep)", overflow: "hidden" }}>
              <div style={{ width: `${percent}%`, height: "100%", borderRadius: 999, background: ACCENT, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>

        <div style={{ margin: "22px 20px 12px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ ...fredoka, fontSize: 20, fontWeight: 600 }}>Tus insignias</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-dim)" }}>Toca una insignia para ver detalles</div>
        </div>

        <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px 8px" }}>
          {mainBadges.map((badge) => {
            const unlocked = earned.includes(badge.id);
            return (
              <div key={badge.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                {unlocked ? <Gem palette={badge.palette} glyph={badge.glyph} /> : <LockedGem />}
                <div style={{ fontSize: 12, fontWeight: unlocked ? 800 : 700, color: unlocked ? "inherit" : "var(--color-text-dim)", lineHeight: 1.25, maxWidth: 100, wordBreak: "break-word" }}>
                  {badge.name}
                </div>
              </div>
            );
          })}
        </div>

        {showSecretSection && (
          <>
            <div style={{ margin: "28px 20px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
              <div style={{ ...fredoka, fontSize: 14, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.2 }}>
                Insignias Secretas
              </div>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            </div>

            <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px 8px" }}>
              {secretBadges.map((badge) => {
                const unlocked = earned.includes(badge.id);
                return (
                  <div key={badge.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                    {unlocked ? <Gem palette={badge.palette} glyph={badge.glyph} /> : <LockedGem />}
                    <div style={{ fontSize: 12, fontWeight: unlocked ? 800 : 700, color: unlocked ? "inherit" : "var(--color-text-dim)", lineHeight: 1.25, maxWidth: 100, wordBreak: "break-word" }}>
                      {badge.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {showLogoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar cierre de sesión"
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--color-bg-overlay)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            zIndex: 100,
          }}
        >
          <div style={{ width: "100%", maxWidth: 360, background: "var(--color-surface)", borderRadius: 24, padding: 22, textAlign: "left" }}>
            <div style={{ ...fredoka, fontSize: 22, fontWeight: 600 }}>¿Cerrar sesión?</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 8, lineHeight: 1.4 }}>
              ¿Estás seguro de que deseas salir de tu cuenta actual?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <button
                onClick={handleLogout}
                autoFocus
                style={{
                  ...resetButton,
                  height: 52,
                  borderRadius: 16,
                  background: "#dc2626",
                  color: "#ffffff",
                  ...fredoka,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Sí, cerrar sesión
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  ...resetButton,
                  height: 44,
                  borderRadius: 14,
                  border: "2px solid var(--color-border)",
                  color: "var(--color-text-soft)",
                  fontSize: 15,
                  fontWeight: 800,
                  boxSizing: "border-box",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "var(--color-surface-deep)", borderTop: "1px solid var(--color-surface)", zIndex: 50 }}>
        <div style={{ maxWidth: 430, margin: "0 auto", height: 76, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 16px" }}>
          <button onClick={() => navigate("/almuerzos")} style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 70, color: "var(--color-text-dim)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 800 }}>Almuerzos</span>
          </button>

          <button style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 70, color: ACCENT }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12,2.5 20,7 20,17 12,21.5 4,17 4,7" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 800 }}>Insignias</span>
          </button>

          <button onClick={() => navigate("/rewards")} style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 70, color: "var(--color-text-dim)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9h16v11H4zM2 5h20v4H2zM12 5v15" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 800 }}>Premios</span>
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate("/scan")}
        aria-label="Escanear un código QR"
        style={{
          position: "fixed",
          right: 20,
          bottom: 92,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: ACCENT,
          border: "4px solid var(--color-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-on-accent)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 60,
          transition: "transform 0.2s ease"
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <path d="M14 14h3v3h-3zM19 19h2v2h-2zM19 14h2v2h-2z" />
        </svg>
      </button>
    </div>
  );
};

export default Home;