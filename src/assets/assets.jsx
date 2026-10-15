export const ACCENT = "#FF8CC0";
// eslint-disable-next-line react-refresh/only-export-components
export const BADGES = [
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

export const Fox = () => (
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

const PIECES = [
  { points: "40,70 58,100 22,100", fill: "#FF8CC0" },
  { points: "338,52 354,76 322,78", fill: "#FFD27A" },
  { points: "352,170 366,184 352,198 338,184", fill: "#B794FF" },
  { points: "28,210 44,222 30,238", fill: "#6EE7C8" },
  { points: "70,330 82,342 70,354 58,342", fill: "#FFB938" },
  { points: "326,320 346,332 328,348", fill: "#FF5FA2" },
  { points: "22,420 40,430 24,444", fill: "#7CC4FF" },
  { points: "360,410 372,424 358,436 348,422", fill: "#FF8CC0" },
  { points: "110,48 122,60 108,70", fill: "#6EE7C8" },
  { points: "282,128 296,140 280,150", fill: "#FF9A5C" },
  { points: "92,268 100,282 86,284", fill: "#B794FF" },
  { points: "300,270 314,278 302,292", fill: "#FFD27A" },
];

export const Confetti = () => (
  <svg
    viewBox="0 0 390 844"
    preserveAspectRatio="xMidYMin slice"
    aria-hidden="true"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    }}
  >
    {PIECES.map((p, i) => (
      <polygon key={i} points={p.points} fill={p.fill} />
    ))}
  </svg>
);

// eslint-disable-next-line react-refresh/only-export-components
export const PALETTES = {
  pink: ["#FF8CC0", "#FF5FA2", "#E8478F", "#C73A7A", "#FF74B1", "#FFA6CE"],
  amber: ["#FFD27A", "#FFB938", "#F29B1D", "#C97A0F", "#FFC55C", "#FFE0A3"],
  blue: ["#7CC4FF", "#4FA3F5", "#3482DB", "#2563B0", "#63B3FA", "#A5D6FF"],
  violet: ["#B794FF", "#9B6BFF", "#7C4DEB", "#5F36C4", "#A67FFF", "#C9ADFF"],
  mint: ["#6EE7C8", "#34D3AE", "#1FB892", "#138F72", "#4BDDBA", "#8FF0D8"],
};

// eslint-disable-next-line react-refresh/only-export-components
export const FACE_POINTS = [
  "46,44 50,6 88,28",
  "46,44 88,28 88,72",
  "46,44 88,72 50,94",
  "46,44 50,94 12,72",
  "46,44 12,72 12,28",
  "46,44 12,28 50,6",
];
export const Glyph = ({ type }) => {
  const p = { fill: "#FFFFFF", opacity: 0.94 };
  switch (type) {
    case "star":
      return <polygon points="50,35 53.82,44.74 64.27,45.36 56.18,52.01 58.82,62.14 50,56.5 41.18,62.14 43.82,52.01 35.73,45.36 46.18,44.74" {...p} />;
    case "circle":
      return <circle cx="50" cy="50" r="13" {...p} />;
    case "square":
      return <rect x="37" y="37" width="26" height="26" rx="4" {...p} />;
    case "diamond":
      return <polygon points="50,34 66,50 50,66 34,50" {...p} />;
    default:
      return <polygon points="50,34 66,64 34,64" {...p} />;
  }
};