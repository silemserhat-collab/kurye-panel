"use client";
import { useState } from "react";

const C = {
  bg: "#0D0F14", surface: "#13161E", card: "#181C26", border: "#1E2433",
  accent: "#F5A623", accentDim: "#F5A62320", green: "#22C55E", greenDim: "#22C55E20",
  red: "#EF4444", blue: "#3B82F6", blueDim: "#3B82F620", purple: "#A78BFA",
  text: "#E8EAF0", muted: "#6B7280", mutedLight: "#9CA3AF",
};

const SMS_LOGS = [
  { id: 1, to: "+90 555 123 45 67", message: "Kuryeniz yola çıktı. Tahmini 25 dk.", time: "10:43", status: "delivered", type: "auto" },
  { id: 2, to: "+90 532 987 65 43", message: "Siparişiniz teslim edildi. Teşekkürler!", time: "10:35", status: "delivered", type: "auto" },
  { id: 3, to: "+90 555 765 43 21", message: "Fiyat teklifiniz: 350 TL. Onaylamak için 1 yazın.", time: "10:15", status: "delivered", type: "manual" },
  { id: 4, to: "+90 534 111 22 33", message: "Teslimat kodunuz: 5487", time: "09:58", status: "failed", type: "auto" },
  { id: 5, to: "ABC Lojistik", message: "Toplu bilgilendirme: 3 kurye atandı.", time: "09:30", status: "delivered", type: "bulk" },
];

const TEMPLATES = [
  { id: 1, label: "Kurye Yola Çıktı", text: "Kuryeniz yola çıktı. Tahmini teslim süresi {süre} dakikadır." },
  { id: 2, label: "Teslim Edildi", text: "Siparişiniz başarıyla teslim edildi. Bizi tercih ettiğiniz için teşekkürler!" },
  { id: 3, label: "Fiyat Teklifi", text: "Fiyat teklifiniz: {fiyat} TL. Onaylamak için 1, iptal için 2 yazınız." },
  { id: 4, label: "Teslimat Kodu", text: "Teslimat kodunuz: {kod}. Lütfen kuryeye gösteriniz." },
  { id: 5, label: "Sipariş Alındı", text: "Siparişiniz alındı. Sipariş no: {sipariş_no}" },
];

export default function SmsMerkezi() {
  const [tab, setTab] = useState<"log" | "send" | "bulk" | "templates">("log");
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState("");
  const [bulkMsg, setBulkMsg] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 16 }}>✉️</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>SMS Merkezi</div>
        <div style={{ display: "flex", gap: 6, marginLeft: 16 }}>
          {(["log", "send", "bulk", "templates"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: tab === t ? C.accent : C.border, color: tab === t ? "#000" : C.mutedLight, fontSize: 12, fontWeight: tab === t ? 600 : 400 }}>
              {t === "log" ? "Gönderim Geçmişi" : t === "send" ? "SMS Gönder" : t === "bulk" ? "Toplu SMS" : "Şablonlar"}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: C.green }}>● Bugün 47 SMS gönderildi</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

        {/* Log */}
        {tab === "log" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.muted, fontWeight: 500 }}>Son Gönderimler</div>
            {SMS_LOGS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: i < SMS_LOGS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: s.type === "auto" ? C.blueDim : s.type === "bulk" ? C.accentDim : C.greenDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {s.type === "auto" ? "🤖" : s.type === "bulk" ? "📢" : "✍️"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.to}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.message}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: C.muted }}>{s.time}</div>
                  <span style={{ fontSize: 10, background: s.status === "delivered" ? C.greenDim : C.red + "20", color: s.status === "delivered" ? C.green : C.red, padding: "2px 7px", borderRadius: 4, marginTop: 3, display: "inline-block" }}>
                    {s.status === "delivered" ? "✓ İletildi" : "✗ Başarısız"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Send */}
        {tab === "send" && (
          <div style={{ maxWidth: 500 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>SMS Gönderildi!</div>
                <button onClick={() => { setSent(false); setTo(""); setMsg(""); }} style={{ background: C.accent, border: "none", borderRadius: 8, padding: "10px 24px", color: "#000", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginTop: 16 }}>Yeni SMS Gönder</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 500 }}>Alıcı</label>
                  <input value={to} onChange={e => setTo(e.target.value)} placeholder="+90 5XX XXX XX XX veya müşteri adı" style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 500 }}>Mesaj</label>
                  <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Mesajınızı yazın..." rows={4} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" as const }} />
                  <div style={{ fontSize: 11, color: C.muted, textAlign: "right", marginTop: 4 }}>{msg.length}/160 karakter</div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 8, fontWeight: 500 }}>Hızlı Şablonlar</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {TEMPLATES.map(t => (
                      <button key={t.id} onClick={() => setMsg(t.text)} style={{ padding: "5px 12px", background: C.border, border: "none", borderRadius: 6, color: C.mutedLight, fontSize: 11, cursor: "pointer" }}>{t.label}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setSent(true)} disabled={!to || !msg} style={{ background: to && msg ? C.accent : C.border, border: "none", borderRadius: 8, padding: "11px", color: to && msg ? "#000" : C.muted, fontWeight: 600, fontSize: 13, cursor: to && msg ? "pointer" : "default", fontFamily: "inherit" }}>
                  ➤ SMS Gönder
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bulk */}
        {tab === "bulk" && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Alıcı Grubu</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Tüm Müşteriler (142)", "VIP Müşteriler (18)", "Bu Hafta Sipariş Verenler (34)", "Pasif Müşteriler (28)"].map((g, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" style={{ accentColor: C.accent }} />
                      <span style={{ fontSize: 13 }}>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 500 }}>Mesaj</label>
                <textarea value={bulkMsg} onChange={e => setBulkMsg(e.target.value)} placeholder="Toplu SMS mesajınızı yazın..." rows={4} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" as const }} />
              </div>
              <button style={{ background: C.accent, border: "none", borderRadius: 8, padding: "11px", color: "#000", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                📢 Toplu SMS Gönder
              </button>
            </div>
          </div>
        )}

        {/* Templates */}
        {tab === "templates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 600 }}>
            {TEMPLATES.map((t, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</span>
                  <button style={{ background: C.accent, border: "none", borderRadius: 6, padding: "4px 12px", color: "#000", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Kullan</button>
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{t.text}</div>
              </div>
            ))}
            <button style={{ background: C.border, border: `1px dashed ${C.borderLight}`, borderRadius: 10, padding: "12px", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>+ Yeni Şablon Ekle</button>
          </div>
        )}
      </div>
    </div>
  );
}