import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCENT, APP_BG, BADGES, REWARDS } from "./assets/assets";
import { getRedeemed, redeemReward } from "./firebaseFunctions";

const fredoka = { fontFamily: "'Fredoka', sans-serif" };
const resetButton = { background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer" };

// Badge ids earned, from the local cache (same source as Home). Bad data counts as none.
const getEarnedBadges = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("badges"));
    return Array.isArray(parsed) ? [...new Set(parsed)].filter((id) => BADGES.some((b) => b.id === id)) : [];
  } catch {
    return [];
  }
};

const LockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2.5" fill="var(--color-lock)" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="var(--color-lock)" strokeWidth="2.4" />
  </svg>
);

const NavButton = ({ label, color, onClick, children }) => (
  <button
    onClick={onClick}
    style={{ ...resetButton, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 64, minHeight: 44, color }}
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
    <span style={{ fontSize: 12, fontWeight: 800 }}>{label}</span>
  </button>
);

const Rewards = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const earned = getEarnedBadges();
  const count = earned.length;
  const total = BADGES.length;

  const [redeemed, setRedeemed] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // "loading" | "ready" | "error"
  const [confirming, setConfirming] = useState(null); // reward being confirmed
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const triggerRef = useRef(null); // "Canjear" button to return focus to

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!username) {
      navigate("/login", { replace: true });
      return;
    }
    let cancelled = false;
    getRedeemed(username)
      .then((ids) => {
        if (cancelled) return;
        setRedeemed(ids);
        setLoadState("ready");
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [username, navigate, reloadKey]);

  const handleRedeem = async () => {
    if (busy || !confirming) return;
    setBusy(true);
    setActionError("");
    try {
      // Re-read first: it may have been redeemed from another device
      const current = await getRedeemed(username);
      if (current.includes(confirming.id)) {
        // Do not look like a fresh redeem: the prize was already handed out
        setRedeemed(current);
        setActionError("Este premio ya fue canjeado.");
        return;
      }
      await redeemReward(username, confirming.id);
      setRedeemed([...current, confirming.id]);
      closeDialog();
    } catch (err) {
      console.error(err);
      setActionError("No se pudo canjear. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const closeDialog = () => {
    setConfirming(null);
    setActionError("");
    triggerRef.current?.focus();
  };

  const closeConfirm = () => {
    if (busy) return;
    closeDialog();
  };

  useEffect(() => {
    if (!confirming) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) closeDialog();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div style={{ ...APP_BG, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif", minHeight: "100dvh" }}>
      <div inert={confirming ? "" : undefined} style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 120 }}>
        <div style={{ padding: "28px 20px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-dim)" }}>Tus premios</div>
          <div style={{ ...fredoka, fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>Recompensas</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-soft)", marginTop: 6 }}>
            {count} de {total} insignias
          </div>
        </div>

        {loadState === "loading" && (
          <div style={{ padding: "24px 20px", fontSize: 15, fontWeight: 700, color: "var(--color-text-soft)" }}>Cargando…</div>
        )}

        {loadState === "error" && (
          <div role="alert" style={{ margin: "24px 20px 0", padding: 16, borderRadius: 18, background: "var(--color-surface)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-error)" }}>No se pudieron cargar tus recompensas.</div>
            <button
              onClick={() => {
                setLoadState("loading");
                setReloadKey((k) => k + 1);
              }}
              style={{ ...resetButton, marginTop: 12, height: 44, padding: "0 18px", borderRadius: 14, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 16, fontWeight: 600 }}
            >
              Reintentar
            </button>
          </div>
        )}

        {loadState === "ready" && (
          <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
            {REWARDS.map((reward) => {
              const isRedeemed = redeemed.includes(reward.id);
              const unlocked = count >= reward.required;
              const missing = reward.required - count;
              return (
                <div
                  key={reward.id}
                  style={{ background: "var(--color-surface)", borderRadius: 22, padding: "16px 18px", opacity: unlocked || isRedeemed ? 1 : 0.85 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ ...fredoka, fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>{reward.title}</div>
                    {!unlocked && !isRedeemed && <LockIcon />}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 4, lineHeight: 1.35 }}>
                    {reward.description}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    {isRedeemed ? (
                      <span style={{ fontSize: 14, fontWeight: 800, color: "var(--color-gold)" }}>Canjeada ✓</span>
                    ) : unlocked ? (
                      <button
                        onClick={(e) => {
                          triggerRef.current = e.currentTarget;
                          setConfirming(reward);
                        }}
                        style={{ ...resetButton, height: 44, padding: "0 20px", borderRadius: 14, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 16, fontWeight: 600 }}
                      >
                        Canjear
                      </button>
                    ) : (
                      <span style={{ fontSize: 14, fontWeight: 800, color: "var(--color-text-dim)" }}>
                        Te {missing === 1 ? "falta 1 insignia" : `faltan ${missing} insignias`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      {confirming && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar canje"
          style={{ position: "fixed", inset: 0, background: "var(--color-bg-overlay)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 100 }}
        >
          <div style={{ width: "100%", maxWidth: 360, background: "var(--color-surface)", borderRadius: 24, padding: 22 }}>
            <div style={{ ...fredoka, fontSize: 22, fontWeight: 600 }}>¿Canjear {confirming.title}?</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 8, lineHeight: 1.4 }}>
              Hazlo frente a quien entrega el premio. No se puede deshacer.
            </div>
            {actionError && (
              <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: "var(--color-error)", marginTop: 10 }}>{actionError}</div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
              <button
                onClick={handleRedeem}
                autoFocus
                disabled={busy}
                style={{ ...resetButton, height: 52, borderRadius: 16, background: ACCENT, color: "var(--color-on-accent)", ...fredoka, fontSize: 18, fontWeight: 600, opacity: busy ? 0.6 : 1 }}
              >
                {busy ? "Canjeando…" : "Confirmar"}
              </button>
              <button
                onClick={closeConfirm}
                disabled={busy}
                style={{ ...resetButton, height: 44, borderRadius: 14, border: "2px solid var(--color-border)", color: "var(--color-text-soft)", fontSize: 15, fontWeight: 800, boxSizing: "border-box" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "var(--color-surface-deep)", borderTop: "1px solid var(--color-surface)" }}>
        <div style={{ maxWidth: 430, margin: "0 auto", height: 88, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 24px" }}>
          <NavButton label="Insignias" color="var(--color-text-dim)" onClick={() => navigate("/home")}>
            <polygon points="12,2.5 20,7 20,17 12,21.5 4,17 4,7" />
          </NavButton>

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

          <NavButton label="Recompensas" color={ACCENT}>
            <path d="M4 9h16v11H4zM2 5h20v4H2zM12 5v15" />
          </NavButton>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
