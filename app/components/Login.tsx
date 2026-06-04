"use client";
import { useState } from "react";

const C = {
  bg: "#0D0F14",
  surface: "#13161E",
  card: "#181C26",
  border: "#1E2433",
  accent: "#F5A623",
  accentDim: "#F5A62320",
  green: "#22C55E",
  red: "#EF4444",
  blue: "#3B82F6",
  text: "#E8EAF0",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
};

const USERS = [
  { email: "admin@kurye.com", password: "admin123", role: "Süper Admin", name: "Admin" },
  { email: "mehmet@kurye.com", password: "mehmet123", role: "Operatör", name: "Mehmet Yılmaz" },
  { email: "ahmet@kurye.com", password: "ahmet123", role: "Op. Yöneticisi", name: "Ahmet Kaya" },
];

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("kurye_user", JSON.stringify(user));
        onLogin(user);
      } else {
        setError("E-posta veya şifre hatalı.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, background: C.accent, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>🏍️</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>KURYE</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4, letterSpacing: "1px" }}>OPERASYON PANELİ</div>
        </div>

        {/* Card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "28px 24px" }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Giriş Yap</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Hesabınıza giriş yapın</div>

          {error && (
            <div style={{ background: C.red + "15", border: `1px solid ${C.red}40`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.red, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6, fontWeight: 500 }}>E-posta</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="ornek@kurye.com"
              type="email"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6, fontWeight: 500 }}>Şifre</label>
            <div style={{ position: "relative" }}>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                type={showPass ? "text" : "password"}
                style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 40px 11px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }}
              />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{ width: "100%", background: email && password ? C.accent : C.border, border: "none", borderRadius: 9, padding: "13px", color: email && password ? "#000" : C.muted, fontWeight: 600, fontSize: 15, cursor: email && password ? "pointer" : "default", fontFamily: "inherit", transition: "all 0.2s" }}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </div>

        {/* Demo accounts */}
        <div style={{ marginTop: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, fontWeight: 500 }}>DEMO HESAPLAR</div>
          {USERS.map((u, i) => (
            <div key={i} onClick={() => { setEmail(u.email); setPassword(u.password); }} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < USERS.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 12, color: C.mutedLight }}>{u.name}</span>
              <span style={{ fontSize: 11, background: C.accentDim, color: C.accent, padding: "1px 8px", borderRadius: 4 }}>{u.role}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: C.muted }}>
          © 2024 Kurye Operasyon Paneli
        </div>
      </div>
    </div>
  );
}