import { useEffect, useRef, useState } from "react";
import "./scanner.css";
import QrScanner from "qr-scanner";
const qrBorder = "/qrBorder.svg";
import { addBadge, addMeal, getBadges, getMeals } from "./storage";
import { ACCENT, APP_BG, BADGES, MEALS, Fox } from "./assets/assets";
import { useNavigate } from "react-router-dom";

const QrReader = () => {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState([true, true]);

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [manualError, setManualError] = useState("");

  const tutorialSteps = [
    {
      title: "1. Ubica el código QR",
      desc: "Busca los códigos de misión o almuerzo impresos en las zonas clave del campus.",
      graphic: (
        <div style={{ position: "relative", width: 110, height: 110, background: "var(--color-surface)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${ACCENT}` }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h3v3h-3zM19 19h2v2h-2z" />
          </svg>
          <div style={{ position: "absolute", inset: -6, borderRadius: 24, border: `2px solid ${ACCENT}`, animation: "pulseRing 1.5s infinite" }} />
        </div>
      )
    },
    {
      title: "2. Centra en el marco",
      desc: "Apunta con la cámara y mantén el código QR dentro del recuadro iluminado sin moverte demasiado.",
      graphic: (
        <div style={{ position: "relative", width: 110, height: 110, background: "var(--color-surface)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 64, height: 64, border: `3px solid ${ACCENT}`, borderRadius: 12, position: "relative", animation: "bounceFrame 1.2s ease-in-out infinite" }}>
            <div style={{ position: "absolute", top: "50%", left: 4, right: 4, height: 2, background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
          </div>
        </div>
      )
    },
    {
      title: "3. ¡Código desbloqueado!",
      desc: "El zorro olfateará el código al instante y registrará tu insignia o almuerzo con éxito.",
      graphic: (
        <div style={{ position: "relative", width: 110, height: 110, background: "var(--color-surface)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", transform: "scale(1.1)", transition: "transform 0.3s" }}>
          <Fox width={65} height={70} />
        </div>
      )
    }
  ];

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const processScannedCode = (rawCode) => {
    const code = rawCode?.trim().toLowerCase();

    const meal = MEALS.find((m) => m.id === code || m.name.toLowerCase() === code);
    if (meal) {
      const localMeals = username ? getMeals(username) : [];
      if (localMeals.includes(meal.id)) {
        setManualError("¡Este turno de almuerzo ya fue registrado!");
        return false;
      }

      if (scanner.current) {
        scanner.current.stop();
      }

      try {
        addMeal(username, meal.id);
        localStorage.setItem("scannedMeal", meal.id);
        navigate("/almuerzo-registrado");
        return true;
      } catch (err) {
        console.error(err);
        setManualError("No se pudo registrar el almuerzo. Inténtalo de nuevo.");
        return false;
      }
    }

    const badge = BADGES.find((b) => b.id === code || b.name.toLowerCase() === code);
    if (badge) {
      const localBadges = username ? getBadges(username) : [];
      if (localBadges.includes(badge.id)) {
        setManualError("¡Ya tienes esta insignia en tu colección!");
        return false;
      }

      if (scanner.current) {
        scanner.current.stop();
      }

      try {
        addBadge(username, badge.id);
        localStorage.setItem("scannedBadge", badge.id);
        navigate("/unlocked");
        return true;
      } catch (err) {
        console.error(err);
        setManualError("No se pudo guardar la insignia. Inténtalo de nuevo.");
        return false;
      }
    }

    setManualError("Código inválido. Prueba con un ID de insignia o almuerzo válido.");
    return false;
  };

  const onScanSuccess = async (result) => {
    processScannedCode(result?.data);
  };

  const onScanFail = (err) => {
    console.log(err);
  };

  useEffect(() => {
    if (!videoEl.current) return;

    const qrScanner = new QrScanner(videoEl.current, onScanSuccess, {
      onDecodeError: onScanFail,
      preferredCamera: "environment",
      maxScansPerSecond: 2,
      highlightScanRegion: true,
      highlightCodeOutline: true,
      overlay: qrBoxEl.current || undefined,
    });
    scanner.current = qrScanner;

    qrScanner
      .start()
      .then(() => setQrOn(true))
      .catch(() => setQrOn(false));

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
      scanner.current = null;
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "La cámara está bloqueada o no es accesible. Permite la cámara en los permisos del navegador y recarga la página."
      );
  }, [qrOn]);

  const earnedBadges = username ? getBadges(username) : [];
  const total = BADGES.length;
  const count = earnedBadges.filter((id) => BADGES.some((b) => b.id === id)).length;
  const percent = Math.round((count / total) * 100);

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

  return (
    <div style={{ ...APP_BG, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif", minHeight: "100dvh", position: "relative" }}>
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.06); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        @keyframes bounceFrame {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100dvh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <div style={{ padding: "28px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/home")} aria-label="Cerrar escáner" style={iconButton}>
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

        <div style={{ padding: "20px 24px 0", textAlign: "center" }}>
          <div style={{ ...fredoka, fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>
            Encuentra un código de misión
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 6 }}>
            Escanea códigos de insignias o almuerzos.
          </div>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: 430, height: "45dvh", margin: "0 auto", overflow: "hidden", borderRadius: 24, background: "var(--color-surface-deep)" }}>
          <video ref={videoEl} muted playsInline style={{ position: "absolute", objectFit: "cover", inset: 0, width: "100%", height: "100%" }} />
          <div ref={qrBoxEl} className="qr-box">
            <img src={qrBorder} alt="" style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

        <div style={{ margin: "26px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ transform: "scale(0.74)", transformOrigin: "left center", width: 68, flexShrink: 0 }}>
            <Fox />
          </div>
          <div style={{ flex: 1, background: "var(--color-surface)", borderRadius: "18px 18px 18px 4px", padding: "12px 14px", fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>
            Mantén firme y centra el código en el marco. ¡Yo olfatearé tu recompensa!
          </div>
        </div>

        <div style={{ margin: "22px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, whiteSpace: "nowrap" }}>{count} / {total} insignias</div>
          <div style={{ flex: 1, height: 10, borderRadius: 999, background: "var(--color-surface-deep)", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", borderRadius: 999, background: ACCENT }} />
          </div>
        </div>

        <div style={{ marginTop: "auto", padding: "24px 24px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => {
              setTutorialStep(0);
              setShowTutorial(true);
            }}
            style={{ ...resetButton, height: 56, borderRadius: 18, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 18, fontWeight: 600 }}
          >
            Simular un escaneo
          </button>
          <button
            type="button"
            onClick={() => {
              setManualError("");
              setManualCode("");
              setShowManualInput(true);
            }}
            style={{ ...resetButton, height: 48, borderRadius: 16, border: "2px solid var(--color-border)", background: "none", color: "var(--color-text-soft)", fontSize: 15, fontWeight: 800, boxSizing: "border-box" }}
          >
            Ingresar código manualmente
          </button>
        </div>
      </div>

      {showTutorial && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.78)", backdropFilter: "blur(5px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 380, width: "100%", background: "var(--color-surface-deep)", border: "2px solid var(--color-border)", borderRadius: 24, padding: "28px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxShadow: "0 25px 30px -10px rgba(0, 0, 0, 0.6)", animation: "fadeInSlide 0.3s ease-out" }}>
            <div style={{ marginBottom: 18 }}>{tutorialSteps[tutorialStep].graphic}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {tutorialSteps.map((_, idx) => (
                <div key={idx} style={{ width: tutorialStep === idx ? 20 : 6, height: 6, borderRadius: 3, background: tutorialStep === idx ? ACCENT : "var(--color-border)", transition: "all 0.3s" }} />
              ))}
            </div>
            <div style={{ ...fredoka, fontSize: 22, fontWeight: 600, color: "var(--color-text)" }}>{tutorialSteps[tutorialStep].title}</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 8, lineHeight: 1.4, minHeight: 42 }}>{tutorialSteps[tutorialStep].desc}</p>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              {tutorialStep < tutorialSteps.length - 1 ? (
                <button onClick={() => setTutorialStep((prev) => prev + 1)} style={{ ...resetButton, height: 48, borderRadius: 16, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 16, fontWeight: 600 }}>Siguiente</button>
              ) : (
                <button onClick={() => setTutorialStep(0)} style={{ ...resetButton, height: 48, borderRadius: 16, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 16, fontWeight: 600 }}>Repetir tutorial</button>
              )}
              <button onClick={() => setShowTutorial(false)} style={{ ...resetButton, height: 44, borderRadius: 14, background: "none", border: "2px solid var(--color-border)", color: "var(--color-text-soft)", fontSize: 14, fontWeight: 700 }}>Volver al escáner de QR</button>
            </div>
          </div>
        </div>
      )}

      {showManualInput && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.78)", backdropFilter: "blur(5px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 380, width: "100%", background: "var(--color-surface-deep)", border: "2px solid var(--color-border)", borderRadius: 24, padding: "28px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxShadow: "0 25px 30px -10px rgba(0, 0, 0, 0.6)", animation: "fadeInSlide 0.3s ease-out" }}>
            <div style={{ width: 70, marginBottom: 12 }}><Fox /></div>
            <div style={{ ...fredoka, fontSize: 22, fontWeight: 600, color: "var(--color-text)" }}>Ingreso Manual</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 6, lineHeight: 1.4 }}>
              Escribe el código de tu insignia o almuerzo (ej. <code style={{ fontSize: 13 }}>first_scan</code>, <code style={{ fontSize: 13 }}>viernes_merienda</code>).
            </p>
            <input
              type="text"
              placeholder="Ej: first_scan o viernes_merienda"
              value={manualCode}
              onChange={(e) => {
                setManualCode(e.target.value);
                setManualError("");
              }}
              style={{ marginTop: 16, width: "100%", height: 48, borderRadius: 14, border: "2px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)", padding: "0 16px", fontSize: 15, fontWeight: 700, boxSizing: "border-box", outline: "none" }}
            />
            {manualError && (
              <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: "var(--color-error)", lineHeight: 1.3 }}>{manualError}</div>
            )}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <button onClick={() => processScannedCode(manualCode)} style={{ ...resetButton, height: 48, borderRadius: 16, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 16, fontWeight: 600 }}>Canjear código</button>
              <button onClick={() => setShowManualInput(false)} style={{ ...resetButton, height: 44, borderRadius: 14, background: "none", border: "2px solid var(--color-border)", color: "var(--color-text-soft)", fontSize: 14, fontWeight: 700 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrReader;