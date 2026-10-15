import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { ACCENT, Fox } from "./assets/assets";


const fredoka = { fontFamily: "'Fredoka', sans-serif" };
const resetButton = { border: 0, padding: 0, font: "inherit", cursor: "pointer" };

const DEFAULT_MSG = "Hi! Tell me your name and I will find your badges.";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setError("");
    const name = username.trim();
    if (!name) return setError("Enter a username");

    setBusy(true);
    try {
      const snap = await getDoc(doc(db, "Users", name));
      if (!snap.exists()) return setError("User not found");
  
      localStorage.setItem("username", name);
      navigate("/home");
    } catch (err) {
      setError(err.code || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAccount = async () => {
    setError("");
    const name = username.trim();
    if (!name) return setError("Enter a username");
    if (name.includes("/")) return setError("Usernames can't contain /");

    setBusy(true);
    try {
      const ref = doc(db, "Users", name);
      const snap = await getDoc(ref);
      if (snap.exists()) return setError("Username already taken");

      await setDoc(ref, { Badges: [], Points: 0 });

      localStorage.setItem("username", name);
      navigate("/home");
    } catch (err) {
      setError(err.code || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        background: "#130C26",
        color: "#F5EEFF",
        fontFamily: "'Nunito', sans-serif",
        minHeight: "100dvh",
      }}
    >
      <style>{`.login-input:focus { border-color: ${ACCENT}; outline: none; }
.login-input::placeholder { color: #6F5FA0; }`}</style>

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
              background: "#2A1D57",
              borderRadius: "18px 18px 18px 4px",
              padding: "12px 14px",
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.35,
              color: error ? "#FFB3C9" : "#F5EEFF",
            }}
          >
            {error || DEFAULT_MSG}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#A99BD0" }}>Welcome</div>
          <div style={{ ...fredoka, fontSize: 32, fontWeight: 600, lineHeight: 1.2 }}>
            Ready to explore?
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#C9BBEE", marginTop: 6 }}>
            Log in to collect badges around campus.
          </div>
        </div>

        {/* Username */}
        <label
          htmlFor="username"
          style={{ marginTop: 28, fontSize: 13, fontWeight: 800, color: "#A99BD0" }}
        >
          Username
        </label>
        <input
          id="username"
          className="login-input"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="username"
          style={{
            marginTop: 8,
            height: 52,
            borderRadius: 16,
            border: "2px solid #3A2A70",
            background: "#1A1033",
            color: "#F5EEFF",
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
              color: "#2A0B20",
              ...fredoka,
              fontSize: 18,
              fontWeight: 600,
              opacity: busy ? 0.6 : 1,
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={busy}
            style={{
              ...resetButton,
              height: 48,
              borderRadius: 16,
              border: "2px solid #3A2A70",
              background: "none",
              color: "#DCCFFF",
              fontSize: 15,
              fontWeight: 800,
              boxSizing: "border-box",
              opacity: busy ? 0.6 : 1,
            }}
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;