"use client";
import { useState, useEffect } from "react";

const C = {
  bg: "#0D0F14", surface: "#13161E", card: "#181C26", border: "#1E2433",
  accent: "#F5A623", accentDim: "#F5A62320", green: "#22C55E", greenDim: "#22C55E20",
  red: "#EF4444", blue: "#3B82F6", blueDim: "#3B82F620", purple: "#A78BFA",
  text: "#E8EAF0", muted: "#6B7280", mutedLight: "#9CA3AF",
};

const COURIERS = [
  { id: 1, name: "Mehmet A.", vehicle: "🛵", status: "active", district: "Kadıköy", order: "#250517", orderFrom: "Kadıköy", orderTo: "Ümraniye", progress: 55, rating: 4.8, phone: "+90 532 111 22 33", todayOrders: 6, totalEarning: 2700 },
  { id: 2, name: "Ahmet K.", vehicle: "🛵", status: "active", district: "Şişli", order: "#250516", orderFrom: "Şişli", orderTo: "Taksim", progress: 72, rating: 4.9, phone: "+90 533 222 33 44", todayOrders: 8, totalEarning: 3600 },
  { id: 3, name: "Ali D.", vehicle: "🚲", status: "active", district: "Beşiktaş", order: "#250514", orderFrom: "Beşiktaş", orderTo: "Sarıyer", progress: 40, rating: 4.7, phone: "+90 534 333 44 55", todayOrders: 4, totalEarning: 1680 },
  { id: 4, name: "Yusuf Y.", vehicle: "🛵", status: "available", district: "Ataşehir", order: null, orderFrom: null, orderTo: null, progress: 0, rating: 4.6, phone: "+90 535 444 55 66", todayOrders: 5, totalEarning: 2250 },
  { id: 5, name: "Selin T.", vehicle: "🛵", status: "available", district: "Üsküdar", order: null, orderFrom: null, orderTo: null, progress: 0, rating: 4.9, phone: "+90 536 555 66 77", todayOrders: 7, totalEarning: 3150 },
  { id: 6, name: "Burak M.", vehicle: "🛵", status: "break", district: "Kadıköy", order: null, orderFrom: null, orderTo: null, progress: 0, rating: 4.5, phone: "+90 537 666 77 88", todayOrders: 3, totalEarning: 1350 },
  { id: 7, name: "Deniz K.", vehicle: "🚲", status: "offline", district: "—", order: null, orderFrom: null, orderTo: null, progress: 0, rating: 4.3, phone: "+90 538 777 88 99", todayOrders: 0, totalEarning: 0 },
];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  active:    { label: "Teslimat Yapıyor", color: C.green },
  available: { label: "Müsait",           color: C.blue },
  break:     { label: "Mola",             color: C.accent },
  offline:   { label: "Çevrimdışı",       color: C.muted },
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2 }} />
    </div>
  );
}

export default function KuryeTakip() {
  const [selected, setSelected] = useState<typeof COURIERS[0] | null>(COURIERS[0]);
  const [filter, setFilter] = useState("all");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(t);
  }, []);

  const filtered = COURIERS.filter(c => filter === "all" || c.status === filter);

  const stats = {
    active: COURIERS.filter(c => c.status === "active").length,
    available: COURIERS.filter(c => c.status === "available").length,
    break: COURIERS.filter(c => c.status === "break").length,
    offline: COURIERS.filter(c => c.status === "offline").length,
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 16 }}>🛵</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Kurye Takip</div>
        <div style={{ display: "flex", gap: 16, marginLeft: 8 }}>
          {[
            { label: `${stats.active} Aktif`, color: C.green },
            { label: `${stats.available} Müsait`, color: C.blue },
            { label: `${stats.break} Mola`, color: C.accent },
            { label: `${stats.offline} Çevrimdışı`, color: C.muted },
          ].map((s, i) => (
            <span key={i} style={{ fontSize: 12, color: s.color, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block", opacity: s.color === C.green ? (pulse ? 1 : 0.4) : 1, transition: "opacity 0.5s" }} />
              {s.label}
            </span>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button style={{ background: C.accent, border: "none", borderRadius: 7, padding: "7px 14px", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Kurye Ekle</button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: Courier list */}
        <div style={{ width: 280, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 6 }}>
            {["all", "active", "available", "break", "offline"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ flex: 1, padding: "4px 0", borderRadius: 5, border: "none", cursor: "pointer", background: filter === f ? C.accent : C.border, color: filter === f ? "#000" : C.muted, fontSize: 9, fontWeight: 500 }}>
                {f === "all" ? "Tümü" : f === "active" ? "Aktif" : f === "available" ? "Müsait" : f === "break" ? "Mola" : "Offline"}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map(c => {
              const st = STATUS_LABEL[c.status];
              return (
                <div key={c.id} onClick={() => setSelected(c)} style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: selected?.id === c.id ? C.accentDim : "transparent", borderLeft: selected?.id === c.id ? `3px solid ${C.accent}` : "3px solid transparent", opacity: c.status === "offline" ? 0.5 : 1, transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, position: "relative", flexShrink: 0 }}>
                      {c.vehicle}
                      <span style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: st.color, border: `2px solid ${C.surface}` }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: st.color, marginTop: 1 }}>{st.label}</div>
                      {c.order && (
                        <div style={{ marginTop: 4 }}>
                          <div style={{ fontSize: 10, color: C.muted }}>{c.orderFrom} → {c.orderTo}</div>
                          <ProgressBar value={c.progress} color={st.color} />
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: C.muted }}>{c.district}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle: Map placeholder */}
        <div style={{ flex: 1, position: "relative", background: "#0A0D12", overflow: "hidden" }}>
          {/* Map grid lines */}
          <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.06 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke={C.green} strokeWidth="0.5" />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke={C.green} strokeWidth="0.5" />
            ))}
          </svg>

          {/* Courier dots on map */}
          {[
            { name: "Mehmet A.", x: 45, y: 55, status: "active" },
            { name: "Ahmet K.", x: 38, y: 35, status: "active" },
            { name: "Ali D.", x: 32, y: 42, status: "active" },
            { name: "Yusuf Y.", x: 60, y: 65, status: "available" },
            { name: "Selin T.", x: 55, y: 48, status: "available" },
            { name: "Burak M.", x: 44, y: 60, status: "break" },
          ].map((dot, i) => {
            const color = STATUS_LABEL[dot.status].color;
            return (
              <div key={i} style={{ position: "absolute", left: `${dot.x}%`, top: `${dot.y}%`, transform: "translate(-50%,-50%)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: color + "20", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", boxShadow: dot.status === "active" ? `0 0 ${pulse ? 12 : 6}px ${color}60` : "none", transition: "box-shadow 0.5s" }}>
                  🛵
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 6px", fontSize: 9, color: C.text, whiteSpace: "nowrap" as const, marginTop: 2, textAlign: "center" as const }}>{dot.name}</div>
              </div>
            );
          })}

          {/* Map label */}
          <div style={{ position: "absolute", bottom: 16, left: 16, background: C.card + "CC", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.muted }}>
            📍 İstanbul — Canlı Konum
          </div>

          <div style={{ position: "absolute", top: 16, right: 16, background: C.card + "CC", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block", opacity: pulse ? 1 : 0.3, transition: "opacity 0.5s" }} />
            Gerçek Zamanlı
          </div>
        </div>

        {/* Right: Courier detail */}
        {selected && (
          <div style={{ width: 260, background: C.surface, borderLeft: `1px solid ${C.border}`, padding: "16px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 8px" }}>{selected.vehicle}</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: STATUS_LABEL[selected.status].color, marginTop: 2 }}>● {STATUS_LABEL[selected.status].label}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>⭐ {selected.rating} · {selected.phone}</div>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 0", fontSize: 11, color: C.mutedLight, cursor: "pointer" }}>📞 Ara</button>
              <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 0", fontSize: 11, color: C.mutedLight, cursor: "pointer" }}>💬 Mesaj</button>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px" }}>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginBottom: 10 }}>BUGÜN</div>
              {[
                { label: "Tamamlanan", value: `${selected.todayOrders} sipariş`, color: C.accent },
                { label: "Kazanç", value: `${selected.totalEarning} TL`, color: C.green },
                { label: "Bölge", value: selected.district, color: C.text },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            {selected.order && (
              <div style={{ background: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: 10, padding: "12px" }}>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 500, marginBottom: 8 }}>AKTİF TESLİMAT</div>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{selected.orderFrom} → {selected.orderTo}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.muted, marginBottom: 8 }}>{selected.order}</div>
                <ProgressBar value={selected.progress} color={C.green} />
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4, textAlign: "right" as const }}>{selected.progress}%</div>
              </div>
            )}

            {selected.status === "available" && (
              <button style={{ background: C.accent, border: "none", borderRadius: 8, padding: "10px", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>📦 Sipariş Ata</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}