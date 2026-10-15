import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { APP_BG, FACE_POINTS, Fox, Glyph, PALETTES } from "./assets/assets";


import { ACCENT } from "./assets/assets";

// The 6 triangular faces of a gem, in the same order as the colors below




// "id" must match the text stored in each QR code (and saved in the Badges array)

const BADGES = [
  { id: "first_scan", name: "Primer escaneo", palette: "pink", glyph: "star" },
  { id: "early_bird", name: "Madrugador", palette: "amber", glyph: "circle" },
  { id: "cafeteria", name: "Cafetería", palette: "blue", glyph: "square" },
  { id: "night_owl", name: "Búho nocturno", palette: "violet", glyph: "diamond" },
  { id: "campus_run", name: "Carrera del campus", palette: "mint", glyph: "triangle" },
  { id: "library", name: "Biblioteca", palette: "pink", glyph: "square" },
  { id: "garden", name: "Jardín", palette: "mint", glyph: "circle" },
  { id: "rooftop", name: "Azotea", palette: "blue", glyph: "diamond" },
  { id: "secret", name: "Secreto", palette: "amber", glyph: "star" },
];

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
  const [earned, setEarned] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!username) {
      navigate("/login", { replace: true });
      return;
    }
    const load = async () => {
      try {
        const rawBadges = localStorage.getItem("badges");
        const cachePoints = localStorage.getItem("points");
        if (rawBadges != undefined && rawBadges.trim != "") {
          setEarned(JSON.parse(rawBadges));
        } else {
          const snap = await getDoc(doc(db, "Users", username));
          const data = snap.data();
          setEarned(data?.Badges ?? []);
          setPoints(data?.Points ?? 0);
          localStorage.setItem("badges", JSON.stringify(data.Badges));
          localStorage.setItem("points", cachePoints);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("badges");
    localStorage.removeItem("points");
    navigate("/login", { replace: true });
  };

  const total = BADGES.length;
  const count = BADGES.filter((b) => earned.includes(b.id)).length;
  const remaining = total - count;
  const percent = Math.round((count / total) * 100);

  return (
    <div style={{ ...APP_BG, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif", minHeight: "100vh" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 120 }}>

        {/* Header */}
        <div style={{ padding: "28px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-dim)" }}>Bienvenido de nuevo</div>
            <div style={{ ...fredoka, fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>¡Hola, {username}!</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-surface)", borderRadius: 999, padding: "8px 14px" }}>
            <svg width="18" height="18" viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="50,6 63,36 95,38 70,59 78,92 50,74 22,92 30,59 5,38 37,36" fill="var(--color-gold)" />
            </svg>
            <span style={{ ...fredoka, fontSize: 16, fontWeight: 600 }}>{earned.length * 10} pts</span>
          </div>
        </div>

        {/* Progress card */}
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

        {/* Badges title */}
        <div style={{ margin: "22px 20px 12px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ ...fredoka, fontSize: 20, fontWeight: 600 }}>Tus insignias</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-dim)" }}>Toca una insignia para ver detalles</div>
        </div>

        {/* Badge grid */}
        <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px 12px" }}>
          {BADGES.map((badge) => {
            const unlocked = earned.includes(badge.id);
            return (
              <div key={badge.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                {unlocked ? <Gem palette={badge.palette} glyph={badge.glyph} /> : <LockedGem />}
                <div style={{ fontSize: 13, fontWeight: unlocked ? 800 : 700, color: unlocked ? "inherit" : "var(--color-text-dim)" }}>
                  {badge.name}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={handleLogout} style={{ ...resetButton, color: "var(--color-text-dim)", fontSize: 13, fontWeight: 700 }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "var(--color-surface-deep)", borderTop: "1px solid var(--color-surface)" }}>
        <div style={{ maxWidth: 430, margin: "0 auto", height: 88, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 24px" }}>
          <button style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 64, minHeight: 44, color: ACCENT }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12,2.5 20,7 20,17 12,21.5 4,17 4,7" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 800 }}>Insignias</span>
          </button>

          <button
            onClick={() => navigate("/scan")}
            aria-label="Escanear un código QR"
            style={{ ...resetButton, width: 68, height: 68, marginTop: -34, borderRadius: 24, background: ACCENT, border: "5px solid var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-on-accent)", boxSizing: "border-box" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <path d="M14 14h3v3h-3zM19 19h2v2h-2zM19 14h2v2h-2z" />
            </svg>
          </button>

          <button onClick={() => navigate("/rewards")} style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 64, minHeight: 44, color: "var(--color-text-dim)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9h16v11H4zM2 5h20v4H2zM12 5v15" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 800 }}>Recompensas</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;