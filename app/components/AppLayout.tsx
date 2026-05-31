"use client";
import { useState } from "react";
import Dashboard from "./Dashboard";
import WhatsAppMerkezi from "./whatsApp";
import YeniSiparis from "./YeniSiparis";
import MusteriCRM from "./MusteriCRM";
import SmsMerkezi from "./SmsMerkezi";
import CagriMerkezi from "./CagriMerkezi";
import AktifIsler from "./AktifIsler";
import KuryeTakip from "./KuryeTakip";
import Raporlar from "./Raporlar";

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

const NAV = [
  { id: "dashboard", icon: "⚡", label: "Ana Panel", section: null },
  { section: "İLETİŞİM" },
  { id: "whatsapp", icon: "💬", label: "WhatsApp", badge: 5, badgeColor: C.accent },
  { id: "sms", icon: "✉️", label: "SMS", badge: 3, badgeColor: C.accent },
  { id: "calls", icon: "📞", label: "Çağrılar", badge: 2, badgeColor: C.red },
  { section: "OPERASYON" },
  { id: "active-orders", icon: "📦", label: "Aktif İşler" },
  { id: "new-order", icon: "➕", label: "Yeni Sipariş" },
  { id: "couriers", icon: "🛵", label: "Kuryeler" },
  { section: "MÜŞTERİLER" },
  { id: "crm", icon: "👥", label: "Müşteriler" },
  { id: "addresses", icon: "📍", label: "Adres Defteri" },
  { section: "RAPORLAR" },
  { id: "daily-report", icon: "📊", label: "Günlük Rapor" },
  { id: "performance", icon: "📈", label: "Performans" },
];

const COMING_SOON = ["addresses"];

function ComingSoon({ label }: { label: string }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, background: C.bg }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: C.text }}>{label}</div>
      <div style={{ fontSize: 13, color: C.muted }}>Bu ekran yakında eklenecek.</div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [showNewOrder, setShowNewOrder] = useState(false);

  const renderPage = () => {
    if (showNewOrder) return <YeniSiparis />;
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "whatsapp": return <WhatsAppMerkezi />;
      case "new-order": return <YeniSiparis />;
      case "crm": return <MusteriCRM />;
      case "sms": return <SmsMerkezi />;
      case "calls": return <CagriMerkezi />;
      case "active-orders": return <AktifIsler />;
      case "couriers": return <KuryeTakip />;
      case "daily-report": return <Raporlar />;
      case "performance": return <Raporlar />;
      default: return <ComingSoon label={NAV.find((n: any) => n.id === activePage)?.label || activePage} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, zIndex: 10 }}>
        {/* Logo */}
        <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏍️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.3px" }}>KURYE</div>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.5px" }}>OPERASYON PANELİ</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
          {NAV.map((item: any, i) => {
            if (item.section) return (
              <div key={i} style={{ fontSize: 10, color: C.muted, letterSpacing: "0.8px", padding: "14px 10px 4px", fontWeight: 500 }}>{item.section}</div>
            );
            const isActive = activePage === item.id && !showNewOrder;
            return (
              <div key={i} onClick={() => { setActivePage(item.id); setShowNewOrder(false); }}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 7, background: isActive ? C.accentDim : "transparent", cursor: "pointer", marginBottom: 1, transition: "background 0.15s" }}>
                <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, color: isActive ? C.accent : C.mutedLight, flex: 1 }}>{item.label}</span>
                {item.badge && <span style={{ background: item.badgeColor || C.accent, color: "#000", fontSize: 10, fontWeight: 600, borderRadius: 10, padding: "1px 6px" }}>{item.badge}</span>}
                {COMING_SOON.includes(item.id) && !["sms","calls"].includes(item.id) && <span style={{ fontSize: 9, color: C.muted, background: C.border, padding: "1px 4px", borderRadius: 3 }}>YK</span>}
              </div>
            );
          })}
        </nav>

        {/* New order button */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => { setActivePage("new-order"); setShowNewOrder(false); }}
            style={{ width: "100%", background: C.accent, border: "none", borderRadius: 8, padding: "10px", color: "#000", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}>
            <span>+</span> Yeni Sipariş
          </button>
        </div>

        {/* User */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>AY</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>Ahmet Yılmaz</div>
              <div style={{ fontSize: 11, color: C.green }}>● Operatör</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {renderPage()}
      </div>
    </div>
  );
}