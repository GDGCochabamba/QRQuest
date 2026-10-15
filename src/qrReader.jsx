import { useNavigate } from "react-router-dom";
import { ACCENT, APP_BG, BADGES, Fox } from "./assets/assets";

const fredoka = { fontFamily: "'Fredoka', sans-serif" };

const resetButton = { border: 0, padding: 0, font: "inherit", cursor: "pointer" };

const iconButton = {
  ...resetButton,
  width: 44,
  height: 44,
  borderRadius: 14,
  background: "var(--color-surface)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-text)",
};

const cornerBase = { position: "absolute", width: 46, height: 46, boxSizing: "border-box" };
const edge = `6px solid ${ACCENT}`;
const corners = [
  { left: 10, top: 10, borderTop: edge, borderLeft: edge, borderRadius: "22px 0 0 0" },
  { right: 10, top: 10, borderTop: edge, borderRight: edge, borderRadius: "0 22px 0 0" },
  { left: 10, bottom: 10, borderBottom: edge, borderLeft: edge, borderRadius: "0 0 0 22px" },
  { right: 10, bottom: 10, borderBottom: edge, borderRight: edge, borderRadius: "0 0 22px 0" },
];

const QrReader = () => {
  const navigate = useNavigate();

  let earned = [];
  try {
    const parsed = JSON.parse(localStorage.getItem("badges"));
    if (Array.isArray(parsed)) earned = parsed;
  } catch { /* no cached badges */ }
  const total = BADGES.length;
  const count = earned.filter((id) => BADGES.some((b) => b.id === id)).length;
  const percent = Math.round((count / total) * 100);

  return (
    <div style={{ ...APP_BG, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100dvh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>

        {/* Top bar */}
        <div style={{ padding: "28px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/")} aria-label="Cerrar escáner" style={iconButton}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div style={{ ...fredoka, fontSize: 18, fontWeight: 600 }}>Escáner</div>
          <button type="button" aria-label="Activar linterna" style={iconButton}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
              <polygon points="13,2 5,13.5 11,13.5 10,22 19,10 13,10" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div style={{ padding: "20px 24px 0", textAlign: "center" }}>
          <div style={{ ...fredoka, fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>Encuentra un código de misión</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 6 }}>Cada código QR desbloquea una insignia.</div>
        </div>

        {/* Scan frame (sample QR for now) */}
        <div style={{ margin: "24px auto 0", width: 300, height: 300, position: "relative", background: "var(--color-surface-deep)", borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 192, height: 192, boxSizing: "border-box", padding: 14, background: "var(--color-text)", borderRadius: 18, transform: "rotate(-4deg)" }}>
            <svg width="164" height="164" viewBox="0 0 21 21" shapeRendering="crispEdges" role="img" aria-label="Código QR de ejemplo">
              <path fillRule="evenodd" fill="var(--color-qr-ink)" d="M0 0h7v7H0zM1 1h5v5H1zM2 2h3v3H2zM14 0h7v7h-7zM15 1h5v5h-5zM16 2h3v3h-3zM0 14h7v7H0zM1 15h5v5H1zM2 16h3v3H2z" />
              <path fill="var(--color-qr-ink)" d="M8 0h2v1H8zM11 0h1v2h-1zM8 2h1v2H8zM10 3h2v1h-2zM13 1h1v3h-1zM9 5h3v1H9zM12 6h1v1h-1zM8 7h1v1H8zM10 8h2v1h-2zM0 8h1v1H0zM2 8h2v1H2zM5 8h1v2H5zM7 9h1v1H7zM1 10h2v1H1zM4 11h1v1H4zM0 12h1v1H0zM6 12h2v1H6zM9 10h1v2H9zM11 11h2v1h-2zM14 8h2v1h-2zM17 8h1v2h-1zM19 9h2v1h-2zM15 10h1v1h-1zM18 11h2v1h-2zM13 13h1v2h-1zM15 14h2v1h-2zM18 14h1v2h-1zM20 13h1v1h-1zM9 14h2v1H9zM8 16h1v2H8zM10 17h2v1h-2zM12 16h1v1h-1zM14 17h1v3h-1zM16 18h2v1h-2zM19 17h2v1h-2zM9 19h1v2H9zM11 20h2v1h-2zM16 20h1v1h-1zM19 19h1v2h-1z" />
            </svg>
          </div>

          {corners.map((c, i) => (
            <div key={i} style={{ ...cornerBase, ...c }} />
          ))}

          <div style={{ position: "absolute", left: 22, right: 22, top: "48%", height: 4, borderRadius: 999, background: ACCENT, boxShadow: `0 0 18px ${ACCENT}` }} />
        </div>

        {/* Fox + message */}
        <div style={{ margin: "26px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ transform: "scale(0.74)", transformOrigin: "left center", width: 68, flexShrink: 0 }}>
            <Fox />
          </div>
          <div style={{ flex: 1, background: "var(--color-surface)", borderRadius: "18px 18px 18px 4px", padding: "12px 14px", fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>
            Mantén firme y centra el código en el marco. ¡Yo olfatearé la insignia!
          </div>
        </div>

        {/* Progress */}
        <div style={{ margin: "22px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, whiteSpace: "nowrap" }}>{count} / {total} insignias</div>
          <div style={{ flex: 1, height: 10, borderRadius: 999, background: "var(--color-surface-deep)", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", borderRadius: 999, background: ACCENT }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrReader;