"use client";
import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0D0F14",
  surface: "#13161E",
  card: "#181C26",
  border: "#1E2433",
  borderLight: "#252B3D",
  accent: "#F5A623",
  accentDim: "#F5A62320",
  green: "#22C55E",
  greenDim: "#22C55E20",
  red: "#EF4444",
  redDim: "#EF444420",
  blue: "#3B82F6",
  blueDim: "#3B82F620",
  purple: "#A78BFA",
  purpleDim: "#A78BFA20",
  text: "#E8EAF0",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
};

const STAT_CARDS = [
  { label: "Aktif İşler", value: 18, icon: "📦", color: COLORS.accent, bg: COLORS.accentDim, delta: "+3", trend: "up" },
  { label: "Bekleyen Teklifler", value: 7, icon: "💰", color: COLORS.purple, bg: COLORS.purpleDim, delta: "+2", trend: "up" },
  { label: "Atama Bekleyen", value: 5, icon: "🛵", color: COLORS.blue, bg: COLORS.blueDim, delta: "-1", trend: "down" },
  { label: "Cevapsız Çağrılar", value: 2, icon: "📞", color: COLORS.red, bg: COLORS.redDim, delta: "+2", trend: "up" },
  { label: "Online Kuryeler", value: 12, icon: "✅", color: COLORS.green, bg: COLORS.greenDim, delta: "+1", trend: "up" },
  { label: "Bugün Teslim", value: 41, icon: "🎯", color: COLORS.accent, bg: COLORS.accentDim, delta: "+8", trend: "up" },
];

const ACTIVE_ORDERS = [
  { id: "#250518", status: "Onaylandı", statusColor: COLORS.accent, from: "Acıbadem", to: "Levent", type: "Evrak", price: "350 TL", courier: "Atanacak", eta: "25-30 dk", customer: "+90 555 123 45 67", progress: 15 },
  { id: "#250517", status: "Kuryede", statusColor: COLORS.blue, from: "Kadıköy", to: "Ümraniye", type: "Paket", price: "450 TL", courier: "Mehmet A.", eta: "20 dk", customer: "+90 532 987 65 43", progress: 55 },
  { id: "#250516", status: "Yolda", statusColor: COLORS.purple, from: "Şişli", to: "Taksim", type: "Evrak", price: "300 TL", courier: "Ahmet K.", eta: "15 dk", customer: "+90 555 765 43 21", progress: 72 },
  { id: "#250515", status: "Teslim Edildi", statusColor: COLORS.green, from: "Bostancı", to: "Ataşehir", type: "Paket", price: "500 TL", courier: "Yusuf Y.", eta: "09:45", customer: "+90 554 111 22 33", progress: 100 },
  { id: "#250514", status: "Kuryede", statusColor: COLORS.blue, from: "Beşiktaş", to: "Sarıyer", type: "Paket", price: "420 TL", courier: "Ali D.", eta: "35 dk", customer: "+90 542 333 11 22", progress: 40 },
];

const MESSAGES = [
  { id: 1, channel: "whatsapp", name: "+90 555 123 45 67", preview: "Evrak göndereceğim, acil motor...", time: "10:42", unread: 2, vip: true },
  { id: 2, channel: "whatsapp", name: "+90 532 987 65 43", preview: "Kuryeniz yola çıktı mı?", time: "10:35", unread: 1, vip: false },
  { id: 3, channel: "call", name: "Mehmet Demir", preview: "Gelen Arama", time: "10:28", unread: 1, vip: false },
  { id: 4, channel: "whatsapp", name: "+90 555 765 43 21", preview: "Fiyat alabilir miyim?", time: "10:15", unread: 0, vip: false },
  { id: 5, channel: "sms", name: "+90 534 111 22 33", preview: "Teslimat kodu: 5487", time: "09:58", unread: 0, vip: false },
];

const COURIERS = [
  { name: "Mehmet A.", status: "active", order: "#250517", district: "Kadıköy", vehicle: "Motorsiklet" },
  { name: "Ahmet K.", status: "active", order: "#250516", district: "Şişli", vehicle: "Motorsiklet" },
  { name: "Ali D.", status: "active", order: "#250514", district: "Beşiktaş", vehicle: "Bisiklet" },
  { name: "Yusuf Y.", status: "available", order: null, district: "Ataşehir", vehicle: "Motorsiklet" },
  { name: "Selin T.", status: "available", order: null, district: "Üsküdar", vehicle: "Motorsiklet" },
  { name: "Burak M.", status: "break", order: null, district: "Kadıköy", vehicle: "Motorsiklet" },
  { name: "Deniz K.", status: "offline", order: null, district: "—", vehicle: "Bisiklet" },
];

const hourlyData = [12,8,15,22,31,28,19,24,38,42,36,29,41,33,27,44,38,30,22,18,14,9,6,4];

function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 120, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.08" stroke="none" />
    </svg>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div style={{ height: 4, background: "#1E2433", borderRadius: 2, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
    </div>
  );
}

function ChannelIcon({ ch }) {
  if (ch === "whatsapp") return <span style={{ fontSize: 13 }}>💬</span>;
  if (ch === "call") return <span style={{ fontSize: 13 }}>📞</span>;
  return <span style={{ fontSize: 13 }}>✉️</span>;
}

function CourierDot({ status }) {
  const c = status === "active" ? COLORS.green : status === "available" ? COLORS.blue : status === "break" ? COLORS.accent : COLORS.muted;
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: c, marginRight: 6, flexShrink: 0 }} />;
}

function MiniChart() {
  const bars = hourlyData.slice(6, 22);
  const max = Math.max(...bars);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48 }}>
      {bars.map((v, i) => (
        <div key={i} style={{ flex: 1, background: i === 10 ? COLORS.accent : COLORS.borderLight, borderRadius: "2px 2px 0 0", height: `${(v / max) * 100}%`, transition: "height 0.3s", minWidth: 4 }} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) => d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const fmtDate = (d) => d.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <main style={{ flex: 1, overflow: "auto", padding: "24px 28px", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.5px" }}>Ana Panel</h1>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{fmtDate(time)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 14px", fontFamily: "'DM Mono', monospace", fontSize: 16, color: COLORS.accent, letterSpacing: "1px" }}>
              {fmt(time)}
            </div>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 16 }}>🔔</div>
            <div style={{ background: COLORS.accentDim, border: `1px solid ${COLORS.accent}40`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: COLORS.accent, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, display: "inline-block", opacity: pulse ? 1 : 0.3, transition: "opacity 0.5s" }} />
              Canlı
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}>
          {STAT_CARDS.map((s, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "16px 14px", cursor: "pointer", transition: "border-color 0.2s", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, background: s.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.icon}</div>
                <span style={{ fontSize: 11, color: s.trend === "up" ? COLORS.green : COLORS.red, fontWeight: 500 }}>{s.delta}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 600, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>

          {/* Left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Active orders */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Aktif İşler</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {["all","pending","active","done"].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: activeTab === t ? COLORS.accent : COLORS.border, color: activeTab === t ? "#000" : COLORS.muted, fontWeight: activeTab === t ? 600 : 400, transition: "all 0.15s" }}>
                      {t === "all" ? "Tümü" : t === "pending" ? "Bekleyen" : t === "active" ? "Aktif" : "Teslim"}
                    </button>
                  ))}
                  <span style={{ fontSize: 12, color: COLORS.accent, cursor: "pointer" }}>Tümünü Gör →</span>
                </div>
              </div>
              <div style={{ padding: "0 0 8px" }}>
                {ACTIVE_ORDERS.map((o, i) => (
                  <div key={i} style={{ padding: "12px 18px", borderBottom: i < ACTIVE_ORDERS.length - 1 ? `1px solid ${COLORS.border}` : "none", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "background 0.15s" }}>
                    <div style={{ minWidth: 72 }}>
                      <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'DM Mono', monospace" }}>{o.id}</div>
                      <span style={{ fontSize: 10, background: `${o.statusColor}20`, color: o.statusColor, borderRadius: 4, padding: "2px 6px", fontWeight: 500, whiteSpace: "nowrap" }}>{o.status}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{o.from}</span>
                        <span style={{ color: COLORS.muted, fontSize: 11 }}>→</span>
                        <span>{o.to}</span>
                        <span style={{ fontSize: 10, background: COLORS.border, color: COLORS.muted, borderRadius: 4, padding: "1px 5px" }}>{o.type}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                        <ProgressBar value={o.progress} color={o.statusColor} />
                        <span style={{ fontSize: 10, color: COLORS.muted, whiteSpace: "nowrap" }}>{o.eta}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 90 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent }}>{o.price}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{o.courier}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ fontSize: 11, padding: "4px 10px", background: COLORS.border, border: "none", borderRadius: 6, color: COLORS.mutedLight, cursor: "pointer" }}>Detay</button>
                      {o.status !== "Teslim Edildi" && (
                        <button style={{ fontSize: 11, padding: "4px 10px", background: o.status === "Onaylandı" ? COLORS.accent : COLORS.blue, border: "none", borderRadius: 6, color: "#000", fontWeight: 600, cursor: "pointer" }}>
                          {o.status === "Onaylandı" ? "Kurye Ata" : "Takip Et"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly chart */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Saatlik İş Yoğunluğu</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>Bugün — 06:00–22:00</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 64 }}>
                {hourlyData.slice(6, 22).map((v, i) => {
                  const max = Math.max(...hourlyData.slice(6,22));
                  const isCurrent = i === 10;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <div style={{ width: "100%", background: isCurrent ? COLORS.accent : i < 10 ? COLORS.blue + "60" : COLORS.borderLight, borderRadius: "3px 3px 0 0", height: `${(v / max) * 52}px`, transition: "height 0.4s", minHeight: 3 }} />
                      {i % 3 === 0 && <div style={{ fontSize: 9, color: COLORS.muted }}>{i + 6}s</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Messages */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Son Mesajlar</div>
                <span style={{ fontSize: 12, color: COLORS.accent, cursor: "pointer" }}>Tümü →</span>
              </div>
              {MESSAGES.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: i < MESSAGES.length - 1 ? `1px solid ${COLORS.border}` : "none", cursor: "pointer" }}>
                  <div style={{ width: 32, height: 32, background: COLORS.border, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                    <ChannelIcon ch={m.channel} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
                      {m.vip && <span style={{ fontSize: 9, background: "#F5A62330", color: COLORS.accent, padding: "1px 4px", borderRadius: 3, fontWeight: 600, flexShrink: 0 }}>VIP</span>}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{m.preview}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: COLORS.muted }}>{m.time}</div>
                    {m.unread > 0 && <div style={{ background: m.channel === "call" ? COLORS.red : COLORS.accent, color: "#000", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px", marginTop: 3, textAlign: "center" }}>{m.unread}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Couriers */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Kuryeler</div>
                <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
                  <span style={{ color: COLORS.green }}>● {COURIERS.filter(c => c.status === "active").length} aktif</span>
                  <span style={{ color: COLORS.blue }}>● {COURIERS.filter(c => c.status === "available").length} müsait</span>
                </div>
              </div>
              <div style={{ padding: "4px 0 8px" }}>
                {COURIERS.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", opacity: c.status === "offline" ? 0.45 : 1 }}>
                    <CourierDot status={c.status} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: COLORS.muted }}>{c.order ? c.order + " · " + c.district : c.status === "break" ? "Mola" : c.status === "offline" ? "Çevrimdışı" : c.district}</div>
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.muted }}>{c.vehicle === "Motorsiklet" ? "🛵" : "🚲"}</div>
                    {c.status === "available" && (
                      <button style={{ fontSize: 10, padding: "3px 8px", background: COLORS.blueDim, border: `1px solid ${COLORS.blue}40`, color: COLORS.blue, borderRadius: 5, cursor: "pointer" }}>Ata</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action */}
            <button style={{ background: COLORS.accent, border: "none", borderRadius: 10, padding: "12px", color: "#000", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", letterSpacing: "-0.2px" }}>
              <span style={{ fontSize: 16 }}>+</span> Yeni Sipariş Oluştur
            </button>
          </div>
        </div>
    </main>
  );
}