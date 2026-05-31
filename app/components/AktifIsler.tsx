"use client";
import { useState } from "react";

const C = {
  bg: "#0D0F14", surface: "#13161E", card: "#181C26", border: "#1E2433",
  accent: "#F5A623", accentDim: "#F5A62320", green: "#22C55E", greenDim: "#22C55E20",
  red: "#EF4444", redDim: "#EF444420", blue: "#3B82F6", blueDim: "#3B82F620",
  purple: "#A78BFA", purpleDim: "#A78BFA20",
  text: "#E8EAF0", muted: "#6B7280", mutedLight: "#9CA3AF",
};

const ORDERS = [
  { id: "#250518", status: "pending", from: "Acıbadem", to: "Levent", type: "Evrak", price: 350, courier: null, customer: "+90 555 123 45 67", eta: "25-30 dk", progress: 10, time: "10:41" },
  { id: "#250517", status: "on_way", from: "Kadıköy", to: "Ümraniye", type: "Paket", price: 450, courier: "Mehmet A.", customer: "+90 532 987 65 43", eta: "20 dk", progress: 55, time: "10:20" },
  { id: "#250516", status: "on_way", from: "Şişli", to: "Taksim", type: "Evrak", price: 300, courier: "Ahmet K.", customer: "+90 555 765 43 21", eta: "15 dk", progress: 72, time: "10:05" },
  { id: "#250515", status: "delivered", from: "Bostancı", to: "Ataşehir", type: "Paket", price: 500, courier: "Yusuf Y.", customer: "+90 554 111 22 33", eta: "Teslim", progress: 100, time: "09:45" },
  { id: "#250514", status: "on_way", from: "Beşiktaş", to: "Sarıyer", type: "Paket", price: 420, courier: "Ali D.", customer: "+90 542 333 11 22", eta: "35 dk", progress: 40, time: "09:30" },
  { id: "#250513", status: "approved", from: "Maslak", to: "Ataşehir", type: "Paket", price: 450, courier: "Selin T.", customer: "ABC Lojistik", eta: "40 dk", progress: 20, time: "09:15" },
  { id: "#250512", status: "delivered", from: "Fatih", to: "Beyoğlu", type: "Evrak", price: 280, courier: "Burak M.", customer: "+90 533 444 55 66", eta: "Teslim", progress: 100, time: "08:55" },
  { id: "#250511", status: "cancelled", from: "Üsküdar", to: "Kadıköy", type: "Paket", price: 320, courier: null, customer: "+90 544 111 33 22", eta: "İptal", progress: 0, time: "08:30" },
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: "Fiyat Bekleniyor", color: C.muted },
  approved:  { label: "Onaylandı",        color: C.accent },
  assigned:  { label: "Kurye Atandı",     color: C.blue },
  on_way:    { label: "Yolda",            color: C.purple },
  delivered: { label: "Teslim Edildi",    color: C.green },
  cancelled: { label: "İptal",            color: C.red },
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2, transition: "width 0.6s" }} />
    </div>
  );
}

export default function AktifIsler() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof ORDERS[0] | null>(null);

  const filtered = ORDERS.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = o.id.includes(search) || o.from.toLowerCase().includes(search.toLowerCase()) || o.to.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: ORDERS.length,
    pending: ORDERS.filter(o => o.status === "pending").length,
    on_way: ORDERS.filter(o => o.status === "on_way").length,
    delivered: ORDERS.filter(o => o.status === "delivered").length,
    cancelled: ORDERS.filter(o => o.status === "cancelled").length,
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 16 }}>📦</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Aktif İşler</div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sipariş no, adres veya müşteri ara..." style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 12px", color: C.text, fontSize: 12, outline: "none", width: 260 }} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={{ background: C.accent, border: "none", borderRadius: 7, padding: "7px 14px", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Yeni Sipariş</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 20px", display: "flex", gap: 0, flexShrink: 0 }}>
        {[
          { key: "all", label: "Tümü" },
          { key: "pending", label: "Bekleyen" },
          { key: "on_way", label: "Yolda" },
          { key: "delivered", label: "Teslim" },
          { key: "cancelled", label: "İptal" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "12px 16px", background: "none", border: "none", borderBottom: filter === f.key ? `2px solid ${C.accent}` : "2px solid transparent", color: filter === f.key ? C.accent : C.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: filter === f.key ? 500 : 400, display: "flex", alignItems: "center", gap: 6, marginBottom: -1 }}>
            {f.label}
            <span style={{ background: filter === f.key ? C.accent : C.border, color: filter === f.key ? "#000" : C.muted, fontSize: 10, fontWeight: 600, borderRadius: 10, padding: "1px 6px" }}>
              {counts[f.key as keyof typeof counts] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Orders list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(o => {
            const st = STATUS_MAP[o.status];
            return (
              <div key={o.id} onClick={() => setSelected(o)} style={{ background: C.card, border: `1px solid ${selected?.id === o.id ? C.accent + "40" : C.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ minWidth: 80 }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.muted }}>{o.id}</div>
                    <span style={{ fontSize: 10, background: st.color + "20", color: st.color, borderRadius: 4, padding: "2px 7px", fontWeight: 500, whiteSpace: "nowrap" as const }}>{st.label}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{o.from}</span>
                      <span style={{ color: C.muted, fontSize: 11 }}>→</span>
                      <span>{o.to}</span>
                      <span style={{ fontSize: 10, background: C.border, color: C.muted, borderRadius: 4, padding: "1px 6px" }}>{o.type}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                      <ProgressBar value={o.progress} color={st.color} />
                      <span style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap" as const }}>{o.eta}</span>
                    </div>
                  </div>
                  <div style={{ minWidth: 100, textAlign: "right" as const }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{o.price} TL</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{o.courier || "Kurye yok"}</div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, minWidth: 40, textAlign: "right" as const }}>{o.time}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ fontSize: 11, padding: "5px 10px", background: C.border, border: "none", borderRadius: 6, color: C.mutedLight, cursor: "pointer" }}>Detay</button>
                    {o.status === "pending" && <button style={{ fontSize: 11, padding: "5px 10px", background: C.accent, border: "none", borderRadius: 6, color: "#000", fontWeight: 600, cursor: "pointer" }}>Onayla</button>}
                    {o.status === "approved" && <button style={{ fontSize: 11, padding: "5px 10px", background: C.blue, border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Kurye Ata</button>}
                    {o.status === "on_way" && <button style={{ fontSize: 11, padding: "5px 10px", background: C.purple, border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Takip Et</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order detail panel */}
        {selected && (
          <div style={{ width: 280, background: C.surface, borderLeft: `1px solid ${C.border}`, padding: "16px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: C.accent }}>{selected.id}</div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px" }}>
              {[
                { label: "Durum", value: STATUS_MAP[selected.status].label, color: STATUS_MAP[selected.status].color },
                { label: "Müşteri", value: selected.customer },
                { label: "Alım", value: selected.from },
                { label: "Teslimat", value: selected.to },
                { label: "Paket", value: selected.type },
                { label: "Kurye", value: selected.courier || "Atanmadı" },
                { label: "Tutar", value: `${selected.price} TL` },
                { label: "Saat", value: selected.time },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 7 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{r.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: (r as any).color || C.text }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selected.status === "pending" && <button style={{ background: C.accent, border: "none", borderRadius: 8, padding: "10px", color: "#000", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>✓ Fiyatı Onayla</button>}
              {selected.status === "approved" && <button style={{ background: C.blue, border: "none", borderRadius: 8, padding: "10px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>🛵 Kurye Ata</button>}
              {selected.status === "on_way" && <button style={{ background: C.green, border: "none", borderRadius: 8, padding: "10px", color: "#000", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>✓ Teslim Edildi</button>}
              <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px", color: C.mutedLight, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>💬 Müşteriye Mesaj</button>
              {selected.status !== "delivered" && selected.status !== "cancelled" && (
                <button style={{ background: C.redDim, border: `1px solid ${C.red}40`, borderRadius: 8, padding: "10px", color: C.red, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>✕ İptal Et</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}