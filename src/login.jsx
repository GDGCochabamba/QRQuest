import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { ACCENT, APP_BG, Fox } from "./assets/assets";


const fredoka = { fontFamily: "'Fredoka', sans-serif" };
const resetButton = { border: 0, padding: 0, font: "inherit", cursor: "pointer" };

const DEFAULT_MSG = "¡Hola! Dime tu nombre y encontraré tus insignias.";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setError("");
    const name = username.trim();
    if (!name) return setError("Ingresa un nombre de usuario");

    setBusy(true);
    try {
      const snap = await getDoc(doc(db, "Users", name));
      if (!snap.exists()) return setError("Usuario no encontrado");
  
      localStorage.setItem("username", name);
      navigate("/home");
    } catch (err) {
      setError(err.code || "Algo salió mal");
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAccount = async () => {
    setError("");
    const name = username.trim();
    if (!name) return setError("Ingresa un nombre de usuario");
    if (name.includes("/")) return setError("El nombre de usuario no puede contener /");

    setBusy(true);
    try {
      const ref = doc(db, "Users", name);
      const snap = await getDoc(ref);
      if (snap.exists()) return setError("El nombre de usuario ya está en uso");

      await setDoc(ref, { Badges: [], Points: 0, Redeemed: [] });

      localStorage.setItem("username", name);
      navigate("/home");
    } catch (err) {
      setError(err.code || "Algo salió mal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        ...APP_BG,
        color: "var(--color-text)",
        fontFamily: "'Nunito', sans-serif",
        minHeight: "100dvh",
      }}
    >
      <style>{`.login-input:focus { border-color: ${ACCENT}; outline: none; }
.login-input::placeholder { color: var(--color-lock); }`}</style>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        style={{
          maxWidth: 430,
          margin: "0 auto",
          minHeight: "100dvh",
          boxSizing: "border-box",
          padding: "0 24px 28px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Fox + speech bubble */}
        <div style={{ marginTop: 72, display: "flex", alignItems: "center", gap: 12 }}>
          <Fox width={92} height={100} />
          <div
            role={error ? "alert" : undefined}
            style={{
              flex: 1,
              background: "var(--color-surface)",
              borderRadius: "18px 18px 18px 4px",
              padding: "12px 14px",
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.35,
              color: error ? "var(--color-error)" : "var(--color-text)",
            }}
          >
            {error || DEFAULT_MSG}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-dim)" }}>Bienvenido</div>
          <div style={{ ...fredoka, fontSize: 32, fontWeight: 600, lineHeight: 1.2 }}>
            ¿Listo para explorar?
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 6 }}>
            Inicia sesión para coleccionar insignias por el campus.
          </div>
        </div>

        {/* Username */}
        <label
          htmlFor="username"
          style={{ marginTop: 28, fontSize: 13, fontWeight: 800, color: "var(--color-text-dim)" }}
        >
          Nombre de usuario
        </label>
        <input
          id="username"
          className="login-input"
          placeholder="Tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="username"
          style={{
            marginTop: 8,
            height: 52,
            borderRadius: 16,
            border: "2px solid var(--color-border)",
            background: "var(--color-surface-deep)",
            color: "var(--color-text)",
            padding: "0 16px",
            fontFamily: "inherit",
            fontSize: 16,
            fontWeight: 700,
            boxSizing: "border-box",
            width: "100%",
          }}
        />

        {/* Buttons */}
        <div style={{ marginTop: "auto", paddingTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="submit"
            disabled={busy}
            style={{
              ...resetButton,
              height: 56,
              borderRadius: 18,
              background: ACCENT,
              color: "var(--color-on-accent)",
              ...fredoka,
              fontSize: 18,
              fontWeight: 600,
              opacity: busy ? 0.6 : 1,
            }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={busy}
            style={{
              ...resetButton,
              height: 48,
              borderRadius: 16,
              border: "2px solid var(--color-border)",
              background: "none",
              color: "var(--color-text-soft)",
              fontSize: 15,
              fontWeight: 800,
              boxSizing: "border-box",
              opacity: busy ? 0.6 : 1,
            }}
          >
            Crear cuenta
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;