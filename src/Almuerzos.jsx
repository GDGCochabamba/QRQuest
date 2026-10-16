import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMeals } from "./storage";
import { APP_BG, MEALS, ACCENT, Fox } from "./assets/assets";

const fredoka = { fontFamily: "'Fredoka', sans-serif" };
const resetButton = { background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer" };

const Almuerzos = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const earnedMeals = username ? getMeals(username) : [];

  useEffect(() => {
    if (!username) {
      navigate("/login", { replace: true });
    }
  }, [username, navigate]);

  const daysGrouped = MEALS.reduce((acc, meal) => {
    if (!acc[meal.day]) acc[meal.day] = [];
    acc[meal.day].push(meal);
    return acc;
  }, {});

  const total = MEALS.length;
  const count = MEALS.filter((m) => earnedMeals.includes(m.id)).length;
  const percent = Math.round((count / total) * 100);

  const nextMealIndex = MEALS.findIndex((m) => !earnedMeals.includes(m.id));
  const nextMeal = nextMealIndex !== -1 ? MEALS[nextMealIndex] : null;

  return (
    <div style={{ ...APP_BG, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 120 }}>
        <div style={{ padding: "28px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-dim)" }}>Control de alimentación</div>
            <div style={{ ...fredoka, fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>Mis Almuerzos</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-surface)", borderRadius: 999, padding: "8px 14px" }}>
            <span style={{ ...fredoka, fontSize: 15, fontWeight: 600, color: "var(--color-gold)" }}>{count} / {total} canjeados</span>
          </div>
        </div>

        <div style={{ margin: "18px 20px 0", background: "var(--color-card)", borderRadius: 24, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <Fox width={56} height={60} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...fredoka, fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>
              {nextMeal ? `Siguiente: ${nextMeal.day} - ${nextMeal.name}` : "¡Completaste todos los turnos!"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-soft)", marginTop: 4 }}>
              {nextMeal ? "Escanea el QR del evento para registrar tu comida." : "Buen provecho, disfrutaste de todo el menú."}
            </div>
            <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: "var(--color-surface-deep)", overflow: "hidden" }}>
              <div style={{ width: `${percent}%`, height: "100%", borderRadius: 999, background: ACCENT, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>

        <div style={{ padding: "0 20px", marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(daysGrouped).map(([dayName, meals]) => (
            <div key={dayName} style={{ background: "var(--color-surface)", borderRadius: 20, padding: "16px 18px" }}>
              <div style={{ ...fredoka, fontSize: 18, fontWeight: 600, marginBottom: 12, color: ACCENT }}>
                {dayName}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {meals.map((meal) => {
                  const isClaimed = earnedMeals.includes(meal.id);
                  const isCurrentNext = nextMeal?.id === meal.id;

                  return (
                    <div
                      key={meal.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: 14,
                        background: isClaimed ? "var(--color-surface-deep)" : isCurrentNext ? "var(--color-card)" : "rgba(255,255,255,0.03)",
                        border: isCurrentNext ? `2px solid ${ACCENT}` : "1px solid var(--color-border)"
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: isCurrentNext ? 800 : 600 }}>
                        {meal.name}
                      </div>
                      <div>
                        {isClaimed ? (
                          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-gold)" }}>Registrado ✓</span>
                        ) : isCurrentNext ? (
                          <button
                            onClick={() => navigate("/scan")}
                            style={{ ...resetButton, padding: "6px 12px", borderRadius: 10, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 13, fontWeight: 600 }}
                          >
                            Escanear QR
                          </button>
                        ) : (
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-dim)" }}>Pendiente</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "var(--color-surface-deep)", borderTop: "1px solid var(--color-surface)", zIndex: 50 }}>
        <div style={{ maxWidth: 430, margin: "0 auto", height: 76, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 16px" }}>
          <button onClick={() => navigate("/almuerzos")} style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 70, color: ACCENT }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 800 }}>Almuerzos</span>
          </button>

          <button onClick={() => navigate("/home")} style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 70, color: "var(--color-text-dim)" }}>
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

export default Almuerzos;