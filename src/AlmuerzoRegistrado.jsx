import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Confetti, ACCENT, APP_BG, MEALS, Fox } from "./assets/assets";
import { getMeals } from "./storage";

const fredoka = { fontFamily: "'Fredoka', sans-serif" };
const resetButton = { border: 0, padding: 0, font: "inherit", cursor: "pointer" };

const AlmuerzoRegistrado = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const mealId = localStorage.getItem("scannedMeal");
  const meal = MEALS.find((m) => m.id === mealId);

  const earnedMeals = username ? getMeals(username) : [];
  const count = MEALS.filter((m) => earnedMeals.includes(m.id)).length;
  const total = MEALS.length;
  const percent = Math.round((count / total) * 100);

  useEffect(() => {
    if (!username) {
      navigate("/login", { replace: true });
      return;
    }
    if (!meal) {
      navigate("/almuerzos", { replace: true });
    }
  }, [meal, username, navigate]);

  if (!meal) return null;

  return (
    <div style={{ position: "relative", overflow: "hidden", ...APP_BG, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif", minHeight: "100dvh" }}>
      <Confetti />

      <div style={{ position: "relative", maxWidth: 430, margin: "0 auto", minHeight: "100dvh", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "24px" }}>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 8, background: "var(--color-gold)", color: "#000000", borderRadius: 999, padding: "8px 16px", ...fredoka, fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>
          ¡ALMUERZO REGISTRADO!
        </div>

        <div style={{ marginTop: 30 }}>
          <Fox width={120} height={130} />
        </div>

        <div style={{ marginTop: 20, ...fredoka, fontSize: 30, fontWeight: 600, lineHeight: 1.2 }}>
          {meal.name}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT, marginTop: 4 }}>
          {meal.day}
        </div>
        
        <div style={{ marginTop: 10, padding: "0 24px", fontSize: 15, fontWeight: 600, color: "var(--color-text-muted)" }}>
          ¡Buen provecho! Tu turno de alimentación ha sido registrado exitosamente.
        </div>

        <div style={{ margin: "30px 0 0", alignSelf: "stretch", boxSizing: "border-box", background: "var(--color-surface)", borderRadius: 22, padding: "16px 20px", textAlign: "left" }}>
          <div style={{ ...fredoka, fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>
            {count} de {total} canjeados
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-soft)", marginTop: 4 }}>
            {count === total ? "¡Completaste todos los turnos!" : "Continúa disfrutando del evento."}
          </div>
          <div style={{ marginTop: 12, height: 10, borderRadius: 999, background: "var(--color-surface-deep)", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", borderRadius: 999, background: ACCENT, transition: "width 0.4s" }} />
          </div>
        </div>

        <div style={{ marginTop: "auto", alignSelf: "stretch", paddingBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => navigate("/almuerzos")}
            style={{ ...resetButton, height: 56, borderRadius: 18, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 18, fontWeight: 600 }}
          >
            Ver mis almuerzos
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlmuerzoRegistrado;