"use client";
import { useState } from "react";

const C = {
  bg: "#0D0F14", surface: "#13161E", card: "#181C26", border: "#1E2433",
  accent: "#F5A623", accentDim: "#F5A62320", green: "#22C55E", greenDim: "#22C55E20",
  red: "#EF4444", redDim: "#EF444420", blue: "#3B82F6", blueDim: "#3B82F620",
  purple: "#A78BFA", purpleDim: "#A78BFA20",
  text: "#E8EAF0", muted: "#6B7280", mutedLight: "#9CA3AF",
};

const DAILY_DATA = [42, 38, 55, 61, 48, 53, 67, 72, 59, 64, 71, 58, 63, 75, 68];
const REVENUE_DATA = [18900, 17100, 24750, 27450, 21600, 23850, 30150, 32400, 26550, 28800, 31950, 26100, 28350, 33750, 30600];
const HOURS_DATA = [2, 1, 0, 0, 1, 3, 8, 14, 18, 22, 19, 16, 21, 24, 20, 17, 15, 18, 12, 9, 6, 4, 3, 2];

const TOP_COURIERS = [
  { name: "Selin T.", orders: 142, revenue: 63900, rating: 4.9, vehicle: "🛵" },
  { name: "Ahmet K.", orders: 138, revenue: 62100, rating: 4.9, vehicle: "🛵" },
  { name: "Mehmet A.", orders: 126, revenue: 56700, rating: 4.8, vehicle: "🛵" },
  { name: "Yusuf Y.", orders: 118, revenue: 53100, rating: 4.6, vehicle: "🛵" },
  { name: "Ali D.", orders: 94, revenue: 42300, rating: 4.7, vehicle: "🚲" },
];

const TOP_CUSTOMERS = [
  { name: "ABC Lojistik", orders: 142, revenue: 63900, type: "Kurumsal" },
  { name: "Ayşe Yıldız", orders: 38, revenue: 13300, type: "VIP" },
  { name: "+90 555 123 45 67", orders: 24, revenue: 8640, type: "VIP" },
  { name: "XYZ Şirketi", orders: 18, revenue: 7200, type: "Kurumsal" },
];

const DISTRICT_DATA = [
  { name: "Kadıköy", orders: 284, pct: 18 },
  { name: "Beşiktaş", orders: 231, pct: 15 },
  { name: "Şişli", orders: 198, pct: 13 },
  { name: "Ataşehir", orders: 176, pct: 11 },
  { name: "Üsküdar", orders: 154, pct: 10 },
  { name: "Diğer", orders: 487, pct: 33 },
];

function MiniBarChart({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, background: i === data.length - 1 ? color : color + "60", borderRadius: "2px 2px 0 0", height: `${(v / max) * 100}%`, minHeight: 2, transition: "height 0.4s" }} />
      ))}
    </div>
  );
}

export default function Raporlar() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");
  const [tab, setTab] = useState<"genel" | "kuryeler" | "musteriler" | "bolgeler">("genel");

  const periodData = {
    today: { orders: 67, revenue: 30150, avgOrder: 450, delivered: 64, cancelled: 3 },
    week: { orders: 486, revenue: 218700, avgOrder: 450, delivered: 461, cancelled: 25 },
    month: { orders: 1842, revenue: 828900, avgOrder: 450, delivered: 1748, cancelled: 94 },
  };
  const d = periodData[period];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 16 }}>📊</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Raporlar</div>
        <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
          {(["today", "week", "month"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: period === p ? C.accent : C.border, color: period === p ? "#000" : C.mutedLight, fontSize: 12, fontWeight: period === p ? 600 : 400 }}>
              {p === "today" ? "Bugün" : p === "week" ? "Bu Hafta" : "Bu Ay"}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 14px", color: C.mutedLight, fontSize: 12, cursor: "pointer" }}>📥 Dışa Aktar</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 20px", display: "flex", flexShrink: 0 }}>
        {(["genel", "kuryeler", "musteriler", "bolgeler"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "12px 16px", background: "none", border: "none", borderBottom: tab === t ? `2px solid ${C.accent}` : "2px solid transparent", color: tab === t ? C.accent : C.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: tab === t ? 500 : 400, marginBottom: -1 }}>
            {t === "genel" ? "Genel" : t === "kuryeler" ? "Kuryeler" : t === "musteriler" ? "Müşteriler" : "Bölgeler"}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

        {/* Genel */}
        {tab === "genel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { label: "Toplam Sipariş", value: d.orders, suffix: "", color: C.accent, icon: "📦" },
                { label: "Toplam Gelir", value: d.revenue.toLocaleString(), suffix: " TL", color: C.green, icon: "💰" },
                { label: "Teslim Oranı", value: Math.round(d.delivered / d.orders * 100), suffix: "%", color: C.blue, icon: "✅" },
                { label: "İptal Oranı", value: Math.round(d.cancelled / d.orders * 100), suffix: "%", color: C.red, icon: "❌" },
              ].map((k, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{k.icon}</span>
                    <span style={{ fontSize: 10, color: C.green, background: C.greenDim, padding: "2px 6px", borderRadius: 4 }}>+12%</span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 600, color: k.color, letterSpacing: "-1px" }}>{k.value}{k.suffix}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Günlük Sipariş Trendi</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Son 15 gün</div>
                </div>
                <MiniBarChart data={DAILY_DATA} color={C.accent} height={80} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 9, color: C.muted }}>15 gün önce</span>
                  <span style={{ fontSize: 9, color: C.muted }}>Bugün</span>
                </div>
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px" }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Saatlik Yoğunluk</div>
                <MiniBarChart data={HOURS_DATA} color={C.blue} height={80} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 9, color: C.muted }}>00:00</span>
                  <span style={{ fontSize: 9, color: C.muted }}>23:00</span>
                </div>
              </div>
            </div>

            {/* Revenue chart */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Günlük Gelir (TL)</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.green }}>{d.revenue.toLocaleString()} TL toplam</div>
              </div>
              <MiniBarChart data={REVENUE_DATA} color={C.green} height={80} />
            </div>

            {/* Package types */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Paket Türü Dağılımı</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Evrak", pct: 42, count: 204, color: C.accent },
                  { label: "Küçük Paket", pct: 31, count: 151, color: C.blue },
                  { label: "Orta Paket", pct: 18, count: 87, color: C.purple },
                  { label: "Büyük Paket", pct: 9, count: 44, color: C.green },
                ].map((p, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12 }}>{p.label}</span>
                      <span style={{ fontSize: 12, color: C.muted }}>{p.count} sipariş · {p.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.pct}%`, background: p.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Kuryeler */}
        {tab === "kuryeler" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.muted, fontWeight: 500 }}>En İyi Kuryeler</div>
            {TOP_COURIERS.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < TOP_COURIERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? C.accentDim : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: i === 0 ? C.accent : C.muted, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 18 }}>{c.vehicle}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>⭐ {c.rating}</div>
                </div>
                <div style={{ textAlign: "center" as const }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>{c.orders}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>sipariş</div>
                </div>
                <div style={{ textAlign: "right" as const }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.green }}>{c.revenue.toLocaleString()} TL</div>
                  <div style={{ fontSize: 10, color: C.muted }}>kazanç</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Müşteriler */}
        {tab === "musteriler" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.muted, fontWeight: 500 }}>En Çok Sipariş Veren Müşteriler</div>
            {TOP_CUSTOMERS.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < TOP_CUSTOMERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? C.accentDim : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: i === 0 ? C.accent : C.muted }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <span style={{ fontSize: 10, background: C.accentDim, color: C.accent, padding: "1px 6px", borderRadius: 3 }}>{c.type}</span>
                </div>
                <div style={{ textAlign: "center" as const }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>{c.orders}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>sipariş</div>
                </div>
                <div style={{ textAlign: "right" as const }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.green }}>{c.revenue.toLocaleString()} TL</div>
                  <div style={{ fontSize: 10, color: C.muted }}>harcama</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bölgeler */}
        {tab === "bolgeler" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>İlçe Bazlı Sipariş Dağılımı</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {DISTRICT_DATA.map((d, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</span>
                      <span style={{ fontSize: 12, color: C.muted }}>{d.orders} sipariş · {d.pct}%</span>
                    </div>
                    <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${d.pct}%`, background: i === 0 ? C.accent : i === 1 ? C.blue : i === 2 ? C.purple : i === 3 ? C.green : i === 4 ? C.red : C.muted, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}