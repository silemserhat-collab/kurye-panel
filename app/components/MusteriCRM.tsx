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

const CUSTOMERS = [
  {
    id: 1, name: "+90 555 123 45 67", shortName: "A.Y.", vip: true, type: "Bireysel",
    phone: "+90 555 123 45 67", email: "ayilmaz@email.com",
    totalOrders: 8, totalRevenue: 2850, avgOrder: 356, lastOrder: "18.05.2025",
    status: "active", joinDate: "12.01.2024",
    tags: ["VIP", "Acil", "Evrak"],
    addresses: [
      { id: 1, label: "Ev", district: "Kadıköy", full: "Acıbadem Mh. Çeşme Sk. No:12 D:4" },
      { id: 2, label: "İş", district: "Beşiktaş", full: "Levent Mh. Büyükdere Cad. No:45" },
      { id: 3, label: "Diğer", district: "Şişli", full: "Şişli Merkez Mh. Halaskargazi Cad." },
    ],
    orders: [
      { id: "#250518", date: "18.05.2025", from: "Acıbadem", to: "Levent", status: "Onaylandı", price: 350, type: "Evrak" },
      { id: "#250410", date: "16.05.2025", from: "Kadıköy", to: "Ümraniye", status: "Teslim", price: 420, type: "Paket" },
      { id: "#250312", date: "14.05.2025", from: "Şişli", to: "Taksim", status: "Teslim", price: 300, type: "Evrak" },
      { id: "#250201", date: "10.05.2025", from: "Levent", to: "Maslak", status: "Teslim", price: 280, type: "Evrak" },
      { id: "#250108", date: "05.05.2025", from: "Beşiktaş", to: "Sarıyer", status: "Teslim", price: 380, type: "Paket" },
    ],
    notes: [
      { id: 1, text: "VIP müşteri – hızlı dönüş bekliyor. Fiyat hassasiyeti var.", author: "Ahmet Y.", date: "10.05.2025" },
      { id: 2, text: "Genellikle sabah 09:00-12:00 arası sipariş veriyor.", author: "Mehmet K.", date: "02.04.2025" },
    ],
    conversations: [
      { id: 1, channel: "whatsapp", preview: "Evrak göndereceğim, acil motor...", time: "10:42", date: "Bugün" },
      { id: 2, channel: "whatsapp", preview: "Fiyatı onayladım teşekkürler", time: "14:20", date: "Dün" },
    ],
  },
  {
    id: 2, name: "Ayşe Yıldız", shortName: "AY", vip: true, type: "Bireysel",
    phone: "+90 532 987 65 43", email: "ayseyildiz@gmail.com",
    totalOrders: 15, totalRevenue: 5200, avgOrder: 347, lastOrder: "17.05.2025",
    status: "active", joinDate: "03.06.2023",
    tags: ["VIP", "Düzenli"],
    addresses: [
      { id: 1, label: "Ev", district: "Üsküdar", full: "Bağlarbaşı Mh. Aziz Mahmut Hüdai Sk." },
      { id: 2, label: "İş", district: "Ataşehir", full: "Ataşehir Mh. Atatürk Cad. Plaza A" },
    ],
    orders: [
      { id: "#250491", date: "17.05.2025", from: "Üsküdar", to: "Ataşehir", status: "Teslim", price: 320, type: "Paket" },
      { id: "#250380", date: "12.05.2025", from: "Bostancı", to: "Kadıköy", status: "Teslim", price: 290, type: "Evrak" },
    ],
    notes: [
      { id: 1, text: "Düzenli müşteri, hafta içi her gün sipariş verebilir.", author: "Selin T.", date: "15.04.2025" },
    ],
    conversations: [
      { id: 1, channel: "whatsapp", preview: "Kurye çağırmak istiyorum.", time: "09:41", date: "Bugün" },
    ],
  },
  {
    id: 3, name: "ABC Lojistik", shortName: "ABC", vip: true, type: "Kurumsal",
    phone: "+90 212 555 00 11", email: "info@abclojistik.com",
    totalOrders: 142, totalRevenue: 48600, avgOrder: 342, lastOrder: "18.05.2025",
    status: "active", joinDate: "15.03.2022",
    tags: ["Kurumsal", "Toplu", "Faturalı"],
    addresses: [
      { id: 1, label: "Merkez", district: "Maslak", full: "Büyükdere Cad. Noramin İş Merkezi No:237" },
      { id: 2, label: "Depo", district: "Esenyurt", full: "Esenyurt OSB Mah. 5. Cad. No:12" },
    ],
    orders: [
      { id: "#250517", date: "18.05.2025", from: "Maslak", to: "Ataşehir", status: "Kuryede", price: 450, type: "Paket" },
      { id: "#250490", date: "17.05.2025", from: "Maslak", to: "Kadıköy", status: "Teslim", price: 380, type: "Paket" },
      { id: "#250465", date: "16.05.2025", from: "Esenyurt", to: "Beylikdüzü", status: "Teslim", price: 290, type: "Evrak" },
    ],
    notes: [
      { id: 1, text: "Aylık fatura kesilecek. Muhasebe: Fatma Hanım - 0532 111 22 33", author: "Ahmet Y.", date: "01.05.2025" },
      { id: 2, text: "Her pazartesi toplu sipariş veriyorlar, önceden hazır olunmalı.", author: "Mehmet K.", date: "10.03.2025" },
    ],
    conversations: [
      { id: 1, channel: "whatsapp", preview: "3 adet paket var, hepsini aynı...", time: "09:58", date: "Bugün" },
    ],
  },
  {
    id: 4, name: "+90 551 223 45 67", shortName: "M.D.", vip: false, type: "Bireysel",
    phone: "+90 551 223 45 67", email: "",
    totalOrders: 2, totalRevenue: 620, avgOrder: 310, lastOrder: "10.05.2025",
    status: "passive", joinDate: "08.05.2025",
    tags: ["Yeni"],
    addresses: [
      { id: 1, label: "Ev", district: "Fatih", full: "Çarşamba Mh. Fevzi Paşa Cad." },
    ],
    orders: [
      { id: "#250200", date: "10.05.2025", from: "Fatih", to: "Beyoğlu", status: "Teslim", price: 320, type: "Evrak" },
    ],
    notes: [],
    conversations: [],
  },
];

const TABS = ["Genel Bakış", "Siparişler", "Adresler", "Konuşmalar", "Notlar"];

export default function MusteriCRM() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof CUSTOMERS[0] | null>(CUSTOMERS[0]);
  const [activeTab, setActiveTab] = useState(0);
  const [newNote, setNewNote] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = CUSTOMERS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchType = filterType === "all" || (filterType === "vip" && c.vip) || (filterType === "kurumsal" && c.type === "Kurumsal");
    return matchSearch && matchType;
  });

  const statusColor = (s: string) => s === "Teslim" ? C.green : s === "Kuryede" ? C.blue : s === "Onaylandı" ? C.accent : C.muted;

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.bg, color: C.text, height: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 16 }}>👥</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Müşteri CRM</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={{ background: C.accent, border: "none", borderRadius: 7, padding: "7px 14px", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Yeni Müşteri</button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: Customer list */}
        <div style={{ width: 300, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="İsim veya telefon ara..." style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 12px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box" as const }} />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {["all", "vip", "kurumsal"].map(f => (
                <button key={f} onClick={() => setFilterType(f)} style={{ flex: 1, padding: "4px 0", borderRadius: 5, border: "none", cursor: "pointer", background: filterType === f ? C.accent : C.border, color: filterType === f ? "#000" : C.muted, fontSize: 10, fontWeight: 500 }}>
                  {f === "all" ? "Tümü" : f === "vip" ? "VIP" : "Kurumsal"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map(c => (
              <div key={c.id} onClick={() => { setSelected(c); setActiveTab(0); }} style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: selected?.id === c.id ? C.accentDim : "transparent", borderLeft: selected?.id === c.id ? `3px solid ${C.accent}` : "3px solid transparent", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: c.vip ? C.accentDim : C.border, border: c.vip ? `1px solid ${C.accent}40` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c.vip ? C.accent : C.text, flexShrink: 0 }}>
                    {c.shortName}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                      {c.vip && <span style={{ fontSize: 9, background: C.accentDim, color: C.accent, padding: "1px 4px", borderRadius: 3, fontWeight: 600, flexShrink: 0 }}>VIP</span>}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>{c.totalOrders} sipariş · {c.totalRevenue.toLocaleString()} TL</span>
                      <span style={{ fontSize: 10, color: c.status === "active" ? C.green : C.muted }}>● {c.status === "active" ? "Aktif" : "Pasif"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted }}>
            {filtered.length} müşteri · {CUSTOMERS.filter(c => c.vip).length} VIP
          </div>
        </div>

        {/* Right: Customer detail */}
        {selected ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Customer header */}
            <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px 24px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: selected.vip ? C.accentDim : C.border, border: selected.vip ? `2px solid ${C.accent}40` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: selected.vip ? C.accent : C.text, flexShrink: 0 }}>
                  {selected.shortName}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{selected.name}</span>
                    {selected.vip && <span style={{ fontSize: 10, background: C.accentDim, color: C.accent, padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>VIP</span>}
                    <span style={{ fontSize: 10, background: C.border, color: C.muted, padding: "3px 8px", borderRadius: 4 }}>{selected.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.muted }}>
                    <span>📞 {selected.phone}</span>
                    {selected.email && <span>✉️ {selected.email}</span>}
                    <span>📅 {selected.joinDate}'den beri müşteri</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    {selected.tags.map((t, i) => (
                      <span key={i} style={{ fontSize: 10, background: C.border, color: C.mutedLight, padding: "2px 8px", borderRadius: 10 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 14px", color: C.mutedLight, fontSize: 12, cursor: "pointer" }}>📞 Ara</button>
                  <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 14px", color: C.mutedLight, fontSize: 12, cursor: "pointer" }}>💬 Mesaj</button>
                  <button style={{ background: C.accent, border: "none", borderRadius: 7, padding: "7px 14px", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Sipariş</button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", gap: 32, flexShrink: 0 }}>
              {[
                { label: "Toplam Sipariş", value: selected.totalOrders, color: C.accent },
                { label: "Toplam Harcama", value: `${selected.totalRevenue.toLocaleString()} TL`, color: C.text },
                { label: "Ortalama Tutar", value: `${selected.avgOrder} TL`, color: C.text },
                { label: "Son Sipariş", value: selected.lastOrder, color: C.muted },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", gap: 0, flexShrink: 0 }}>
              {TABS.map((t, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{ padding: "12px 16px", background: "none", border: "none", borderBottom: activeTab === i ? `2px solid ${C.accent}` : "2px solid transparent", color: activeTab === i ? C.accent : C.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: activeTab === i ? 500 : 400, marginBottom: -1 }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

              {/* Tab 0: Genel Bakış */}
              {activeTab === 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.muted, marginBottom: 12 }}>SON SİPARİŞLER</div>
                    {selected.orders.slice(0, 3).map((o, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{o.from} → {o.to}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{o.date} · {o.type}</div>
                        </div>
                        <span style={{ fontSize: 11, color: statusColor(o.status) }}>{o.status}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{o.price} TL</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.muted, marginBottom: 12 }}>KAYITLI ADRESLER</div>
                    {selected.addresses.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < selected.addresses.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 13 }}>📍</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{a.label} — {a.district}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{a.full}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.muted, marginBottom: 12 }}>SON NOTLAR</div>
                    {selected.notes.length === 0 && <div style={{ fontSize: 12, color: C.muted }}>Henüz not eklenmemiş.</div>}
                    {selected.notes.map((n, i) => (
                      <div key={i} style={{ padding: "8px 0", borderBottom: i < selected.notes.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <div style={{ fontSize: 12, lineHeight: 1.5 }}>{n.text}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{n.author} · {n.date}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.muted, marginBottom: 12 }}>KANAL GEÇMİŞİ</div>
                    {selected.conversations.length === 0 && <div style={{ fontSize: 12, color: C.muted }}>Konuşma geçmişi yok.</div>}
                    {selected.conversations.map((cv, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < selected.conversations.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 14 }}>{cv.channel === "whatsapp" ? "💬" : "📞"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: C.mutedLight }}>{cv.preview}</div>
                          <div style={{ fontSize: 10, color: C.muted }}>{cv.date} {cv.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 1: Siparişler */}
              {activeTab === 1 && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500, color: C.muted }}>
                    {selected.orders.length} sipariş
                  </div>
                  {selected.orders.map((o, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: i < selected.orders.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.muted, minWidth: 70 }}>{o.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{o.from} → {o.to}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{o.date} · {o.type}</div>
                      </div>
                      <span style={{ fontSize: 11, background: statusColor(o.status) + "20", color: statusColor(o.status), padding: "3px 8px", borderRadius: 4 }}>{o.status}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent, minWidth: 60, textAlign: "right" }}>{o.price} TL</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Adresler */}
              {activeTab === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selected.addresses.map((a, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: C.blueDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📍</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{a.label} — {a.district}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{a.full}</div>
                      </div>
                      <button style={{ background: C.accent, border: "none", borderRadius: 6, padding: "6px 12px", color: "#000", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Kullan</button>
                    </div>
                  ))}
                  <button style={{ background: C.border, border: `1px dashed ${C.borderLight}`, borderRadius: 10, padding: "14px", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>+ Yeni Adres Ekle</button>
                </div>
              )}

              {/* Tab 3: Konuşmalar */}
              {activeTab === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {selected.conversations.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>Konuşma geçmişi yok.</div>}
                  {selected.conversations.map((cv, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", gap: 12, cursor: "pointer" }}>
                      <span style={{ fontSize: 20 }}>{cv.channel === "whatsapp" ? "💬" : "📞"}</span>
                      <div>
                        <div style={{ fontSize: 13 }}>{cv.preview}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{cv.date} · {cv.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Notlar */}
              {activeTab === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px" }}>
                    <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Yeni not ekle..." rows={3} style={{ width: "100%", background: "transparent", border: "none", color: C.text, fontSize: 13, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" as const }} />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                      <button onClick={() => setNewNote("")} style={{ background: C.accent, border: "none", borderRadius: 6, padding: "7px 16px", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Not Ekle</button>
                    </div>
                  </div>
                  {selected.notes.map((n, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, lineHeight: 1.6 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>📝 {n.author} · {n.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 40 }}>👥</div>
            <div>Bir müşteri seçin</div>
          </div>
        )}
      </div>
    </div>
  );
}