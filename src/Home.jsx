import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { FACE_POINTS, Glyph, PALETTES } from "./assets/assets";


const ACCENT = "#FF8CC0";

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
      fill="#1E1442"
      stroke="#4A3790"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <rect x="39" y="48" width="22" height="17" rx="3" fill="#6F5FA0" />
    <path d="M43 48 v-6 a7 7 0 0 1 14 0 v6" stroke="#6F5FA0" strokeWidth="3.5" fill="none" />
  </svg>
);

const Fox = () => (
  <svg width="92" height="100" viewBox="0 0 120 130" aria-hidden="true" style={{ position: "relative", flexShrink: 0 }}>
    <polygon points="20,10 46,36 16,50" fill="#E8602C" />
    <polygon points="100,10 74,36 104,50" fill="#E8602C" />
    <polygon points="24,22 40,36 22,44" fill="#FF8FB8" />
    <polygon points="96,22 80,36 98,44" fill="#FF8FB8" />
    <polygon points="60,68 16,50 46,36" fill="#FF8A4C" />
    <polygon points="60,68 46,36 74,36" fill="#FF9F63" />
    <polygon points="60,68 74,36 104,50" fill="#FF7A3D" />
    <polygon points="60,68 104,50 100,84" fill="#F0672F" />
    <polygon points="60,68 100,84 60,110" fill="#FFE6D2" />
    <polygon points="60,68 60,110 20,84" fill="#FFD4B8" />
    <polygon points="60,68 20,84 16,50" fill="#F26F36" />
    <ellipse cx="42" cy="66" rx="6" ry="7.5" fill="#2A1550" />
    <ellipse cx="78" cy="66" rx="6" ry="7.5" fill="#2A1550" />
    <circle cx="44" cy="63" r="2" fill="#FFFFFF" />
    <circle cx="80" cy="63" r="2" fill="#FFFFFF" />
    <ellipse cx="30" cy="84" rx="5" ry="3" fill="#FF8FB8" opacity="0.7" />
    <ellipse cx="90" cy="84" rx="5" ry="3" fill="#FF8FB8" opacity="0.7" />
    <polygon points="53,86 67,86 60,95" fill="#2A1550" />
    <path d="M52 98 Q60 104 68 98" stroke="#2A1550" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <polygon points="34,108 86,108 60,128" fill="#FF5FA2" />
    <polygon points="60,108 86,108 60,128" fill="#E8478F" />
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
    navigate("/login", { replace: true });
  };

  const total = BADGES.length;
  const count = BADGES.filter((b) => earned.includes(b.id)).length;
  const remaining = total - count;
  const percent = Math.round((count / total) * 100);

  return (
    <div style={{ background: "#130C26", color: "#F5EEFF", fontFamily: "'Nunito', sans-serif", minHeight: "100vh" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 120 }}>

        {/* Header */}
        <div style={{ padding: "28px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#A99BD0" }}>Bienvenido de nuevo</div>
            <div style={{ ...fredoka, fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>¡Hola, {username}!</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#2A1D57", borderRadius: 999, padding: "8px 14px" }}>
            <svg width="18" height="18" viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="50,6 63,36 95,38 70,59 78,92 50,74 22,92 30,59 5,38 37,36" fill="#FFB938" />
            </svg>
            <span style={{ ...fredoka, fontSize: 16, fontWeight: 600 }}>{ earned.length * 10 } pts</span>
          </div>
        </div>

        {/* Progress card */}
        <div style={{ margin: "18px 20px 0", position: "relative", overflow: "hidden", background: "#3A2478", borderRadius: 24, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="150" height="140" viewBox="0 0 150 140" aria-hidden="true" style={{ position: "absolute", right: 0, top: 0 }}>
            <polygon points="150,0 60,0 150,70" fill="#4B2E9A" />
            <polygon points="150,70 60,0 110,110" fill="#432A8C" opacity="0.8" />
            <polygon points="150,70 110,110 150,140" fill="#553AA8" />
          </svg>
          <Fox />
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <div style={{ ...fredoka, fontSize: 22, fontWeight: 600, lineHeight: 1.2 }}>
              {count} de {total} insignias
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#DCCFFF", marginTop: 4, lineHeight: 1.35 }}>
              {remaining > 0
                ? `${remaining} ${remaining === 1 ? "código QR más está escondido" : "códigos QR más están escondidos"} por el campus.`
                : "¡Los encontraste todos!"}
            </div>
            <div style={{ marginTop: 12, height: 10, borderRadius: 999, background: "#1A1033", overflow: "hidden" }}>
              <div style={{ width: `${percent}%`, height: "100%", borderRadius: 999, background: ACCENT, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>

        {/* Badges title */}
        <div style={{ margin: "22px 20px 12px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ ...fredoka, fontSize: 20, fontWeight: 600 }}>Tus insignias</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#A99BD0" }}>Toca una insignia para ver detalles</div>
        </div>

        {/* Badge grid */}
        <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px 12px" }}>
          {BADGES.map((badge) => {
            const unlocked = earned.includes(badge.id);
            return (
              <div key={badge.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                {unlocked ? <Gem palette={badge.palette} glyph={badge.glyph} /> : <LockedGem />}
                <div style={{ fontSize: 13, fontWeight: unlocked ? 800 : 700, color: unlocked ? "inherit" : "#A99BD0" }}>
                  {badge.name}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={handleLogout} style={{ ...resetButton, color: "#A99BD0", fontSize: 13, fontWeight: 700 }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#1A1033", borderTop: "1px solid #2A1D57" }}>
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
            style={{ ...resetButton, width: 68, height: 68, marginTop: -34, borderRadius: 24, background: ACCENT, border: "5px solid #130C26", display: "flex", alignItems: "center", justifyContent: "center", color: "#2A0B20", boxSizing: "border-box" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <path d="M14 14h3v3h-3zM19 19h2v2h-2zM19 14h2v2h-2z" />
            </svg>
          </button>

          <button style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 64, minHeight: 44, color: "#A99BD0" }}>
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