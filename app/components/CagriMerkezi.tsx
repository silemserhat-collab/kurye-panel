"use client";
import { useState, useEffect } from "react";

const C = {
  bg: "#0D0F14", surface: "#13161E", card: "#181C26", border: "#1E2433",
  accent: "#F5A623", accentDim: "#F5A62320", green: "#22C55E", greenDim: "#22C55E20",
  red: "#EF4444", redDim: "#EF444420", blue: "#3B82F6", blueDim: "#3B82F620",
  text: "#E8EAF0", muted: "#6B7280", mutedLight: "#9CA3AF",
};

const CALL_LOG = [
  { id: 1, name: "Mehmet Demir", phone: "+90 532 111 22 33", type: "inbound", status: "answered", duration: "2:34", time: "10:28", note: "Sipariş sorgulama" },
  { id: 2, name: "+90 551 223 45 67", phone: "+90 551 223 45 67", type: "inbound", status: "missed", duration: "—", time: "09:22", note: "" },
  { id: 3, name: "ABC Lojistik", phone: "+90 212 555 00 11", type: "outbound", status: "answered", duration: "4:12", time: "09:10", note: "Toplu sipariş görüşmesi" },
  { id: 4, name: "Ayşe Yıldız", phone: "+90 532 987 65 43", type: "inbound", status: "answered", duration: "1:05", time: "08:55", note: "Adres değişikliği" },
  { id: 5, name: "+90 544 333 22 11", phone: "+90 544 333 22 11", type: "inbound", status: "missed", duration: "—", time: "08:40", note: "" },
];

export default function CagriMerkezi() {
  const [activeCall, setActiveCall] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [selected, setSelected] = useState<typeof CALL_LOG[0] | null>(null);
  const [note, setNote] = useState("");
  const [dialNumber, setDialNumber] = useState("");

  useEffect(() => {
    if (!activeCall) return;
    const t = setInterval(() => setCallTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [activeCall]);

  const fmtTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 16 }}>📞</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Çağrı Merkezi</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 11, background: C.redDim, color: C.red, padding: "3px 10px", borderRadius: 6 }}>2 Cevapsız</span>
          <span style={{ fontSize: 11, background: C.greenDim, color: C.green, padding: "3px 10px", borderRadius: 6 }}>● Hat Aktif</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: Active call + dial */}
        <div style={{ width: 300, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "16px", gap: 14, flexShrink: 0 }}>

          {/* Active call widget */}
          {activeCall ? (
            <div style={{ background: C.greenDim, border: `1px solid ${C.green}40`, borderRadius: 12, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.green, marginBottom: 8 }}>● AKTİF GÖRÜŞME</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>+90 555 123 45 67</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 24, color: C.green, marginBottom: 16 }}>{fmtTimer(callTimer)}</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button style={{ background: C.border, border: "none", borderRadius: 8, padding: "8px 14px", color: C.mutedLight, fontSize: 12, cursor: "pointer" }}>🔇 Sessiz</button>
                <button style={{ background: C.border, border: "none", borderRadius: 8, padding: "8px 14px", color: C.mutedLight, fontSize: 12, cursor: "pointer" }}>⏸ Beklet</button>
                <button onClick={() => { setActiveCall(false); setCallTimer(0); }} style={{ background: C.red, border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, cursor: "pointer" }}>✕ Kapat</button>
              </div>
            </div>
          ) : (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, color: C.muted }}>NUMARA ÇEVİR</div>
              <input value={dialNumber} onChange={e => setDialNumber(e.target.value)} placeholder="+90 5XX XXX XX XX" style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" as const, textAlign: "center", letterSpacing: "1px" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, margin: "12px 0" }}>
                {["1","2","3","4","5","6","7","8","9","*","0","#"].map(d => (
                  <button key={d} onClick={() => setDialNumber(p => p + d)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px", color: C.text, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>{d}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setDialNumber(p => p.slice(0, -1))} style={{ flex: 1, background: C.border, border: "none", borderRadius: 8, padding: "10px", color: C.mutedLight, fontSize: 13, cursor: "pointer" }}>⌫</button>
                <button onClick={() => { if (dialNumber) { setActiveCall(true); setCallTimer(0); } }} style={{ flex: 2, background: C.green, border: "none", borderRadius: 8, padding: "10px", color: "#000", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>📞 Ara</button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px" }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginBottom: 10 }}>BUGÜN</div>
            {[
              { label: "Toplam Çağrı", value: "24", color: C.text },
              { label: "Cevaplanan", value: "21", color: C.green },
              { label: "Cevapsız", value: "2", color: C.red },
              { label: "Ort. Süre", value: "2:48", color: C.accent },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 12, color: C.muted }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Call log */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, fontSize: 13, fontWeight: 500 }}>Çağrı Geçmişi</div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {CALL_LOG.map((call, i) => (
              <div key={i} onClick={() => { setSelected(call); setNote(call.note); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: selected?.id === call.id ? C.accentDim : "transparent", borderLeft: selected?.id === call.id ? `3px solid ${C.accent}` : "3px solid transparent", transition: "all 0.15s" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: call.status === "missed" ? C.redDim : call.type === "outbound" ? C.blueDim : C.greenDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {call.status === "missed" ? "📵" : call.type === "outbound" ? "📤" : "📥"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{call.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    {call.type === "inbound" ? "Gelen" : "Giden"} · {call.duration}
                    {call.note && ` · ${call.note}`}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: C.muted }}>{call.time}</div>
                  <span style={{ fontSize: 10, color: call.status === "missed" ? C.red : C.green }}>{call.status === "missed" ? "Cevapsız" : "Cevaplandı"}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); setActiveCall(true); setCallTimer(0); setDialNumber(call.phone); }} style={{ background: C.greenDim, border: `1px solid ${C.green}40`, borderRadius: 6, padding: "5px 10px", color: C.green, fontSize: 11, cursor: "pointer" }}>Geri Ara</button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Call detail */}
        {selected && (
          <div style={{ width: 280, background: C.surface, borderLeft: `1px solid ${C.border}`, padding: "16px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 8px" }}>
                {selected.status === "missed" ? "📵" : "📞"}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{selected.phone}</div>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, background: C.green, border: "none", borderRadius: 7, padding: "8px 0", fontSize: 11, color: "#000", fontWeight: 600, cursor: "pointer" }}>📞 Ara</button>
              <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 0", fontSize: 11, color: C.mutedLight, cursor: "pointer" }}>💬 WA</button>
              <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 0", fontSize: 11, color: C.mutedLight, cursor: "pointer" }}>✉️ SMS</button>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px" }}>
              {[
                { label: "Tür", value: selected.type === "inbound" ? "Gelen Çağrı" : "Giden Çağrı" },
                { label: "Durum", value: selected.status === "missed" ? "Cevapsız" : "Cevaplandı" },
                { label: "Süre", value: selected.duration },
                { label: "Saat", value: selected.time },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{r.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginBottom: 6 }}>GÖRÜŞME NOTU</div>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Not ekle..." rows={4} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 12, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" as const }} />
              <button style={{ width: "100%", marginTop: 6, background: C.accent, border: "none", borderRadius: 7, padding: "8px", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Notu Kaydet</button>
            </div>

            <button style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: 8, padding: "10px", color: C.accent, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              📦 Sipariş Oluştur
            </button>
          </div>
        )}
      </div>
    </div>
  );
}