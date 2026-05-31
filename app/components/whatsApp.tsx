"use client";
import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0D0F14",
  surface: "#13161E",
  card: "#181C26",
  border: "#1E2433",
  borderLight: "#252B3D",
  accent: "#F5A623",
  accentDim: "#F5A62320",
  green: "#25D366",
  greenDim: "#25D36620",
  red: "#EF4444",
  blue: "#3B82F6",
  blueDim: "#3B82F620",
  purple: "#A78BFA",
  text: "#E8EAF0",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
};

const LINES = [
  { id: 1, number: "+90 532 000 11 11", label: "Hat 1 — Genel", color: C.green },
  { id: 2, number: "+90 532 000 22 22", label: "Hat 2 — VIP", color: C.accent },
  { id: 3, number: "+90 532 000 33 33", label: "Hat 3 — Kurumsal", color: C.blue },
];

const CONVERSATIONS = [
  {
    id: 1, line: 1, name: "+90 555 123 45 67", vip: true,
    lastMsg: "Evrak göndereceğim, acil motor lazım", time: "10:42", unread: 2,
    status: "open", assignedTo: null,
    messages: [
      { id: 1, dir: "in", text: "Merhaba, Acıbadem'den Levent'e acil evrak göndereceğim.", time: "10:41", read: true },
      { id: 2, dir: "out", text: "Merhaba, mesafeye göre tahmini fiyat 350 TL görünüyor. Onaylıyor musunuz?", time: "10:42", read: true },
      { id: 3, dir: "in", text: "Evet, onaylıyorum.", time: "10:42", read: true },
      { id: 4, dir: "out", text: "Tamamdır, size en yakın kuryemizi yönlendiriyoruz. Tahmini teslim süresi 25-30 dk.", time: "10:43", read: true },
    ]
  },
  {
    id: 2, line: 1, name: "+90 532 987 65 43", vip: false,
    lastMsg: "Kuryeniz yola çıktı mı?", time: "10:35", unread: 1,
    status: "open", assignedTo: "Ahmet Y.",
    messages: [
      { id: 1, dir: "in", text: "Merhaba, siparişim ne zaman teslim edilecek?", time: "10:30", read: true },
      { id: 2, dir: "out", text: "Kuryemiz şu an yolda, tahmini 20 dakika içinde ulaşır.", time: "10:32", read: true },
      { id: 3, dir: "in", text: "Kuryeniz yola çıktı mı?", time: "10:35", read: false },
    ]
  },
  {
    id: 3, line: 2, name: "Ayşe Yıldız", vip: true,
    lastMsg: "Kurye çağırmak istiyorum.", time: "09:41", unread: 0,
    status: "waiting", assignedTo: "Mehmet K.",
    messages: [
      { id: 1, dir: "in", text: "Kurye çağırmak istiyorum.", time: "09:41", read: true },
      { id: 2, dir: "out", text: "Merhaba Ayşe Hanım, adresinizi alabilir miyiz?", time: "09:42", read: true },
    ]
  },
  {
    id: 4, line: 1, name: "+90 555 765 43 21", vip: false,
    lastMsg: "Fiyat alabilir miyim?", time: "10:15", unread: 0,
    status: "open", assignedTo: null,
    messages: [
      { id: 1, dir: "in", text: "Fiyat alabilir miyim?", time: "10:15", read: true },
    ]
  },
  {
    id: 5, line: 3, name: "ABC Lojistik", vip: true,
    lastMsg: "3 adet paket var, hepsini aynı anda alabilir mi?", time: "09:58", unread: 3,
    status: "open", assignedTo: null,
    messages: [
      { id: 1, dir: "in", text: "Merhaba, bugün 3 adet paket var, hepsini aynı anda alabilir misiniz?", time: "09:55", read: true },
      { id: 2, dir: "in", text: "Paketler Maslak'tan Ataşehir'e gidecek.", time: "09:56", read: false },
      { id: 3, dir: "in", text: "3 adet paket var, hepsini aynı anda alabilir mi?", time: "09:58", read: false },
    ]
  },
  {
    id: 6, line: 1, name: "+90 551 223 45 67", vip: false,
    lastMsg: "Cevapsız Arama", time: "09:22", unread: 0,
    status: "closed", assignedTo: null,
    messages: [
      { id: 1, dir: "in", text: "Cevapsız Arama", time: "09:22", read: true },
    ]
  },
];

const AI_SUGGESTIONS = [
  "Merhaba! Tahmini fiyatınız hesaplanıyor, lütfen bekleyin.",
  "Adresinizi paylaşır mısınız? En yakın kuryemizi göndereceğiz.",
  "Kuryemiz yola çıktı, tahmini 20 dakika içinde ulaşır.",
  "Fiyatı onayladıktan sonra kurye ataması yapılacaktır.",
];

const QUICK_REPLIES = [
  "Fiyat bilgisini ilettim.",
  "Kurye yönlendiriyoruz.",
  "Teslimat tamamlandı.",
  "Adres alabilir miyim?",
  "Siparişiniz alındı.",
];

const OPERATORS = ["Ahmet Y.", "Mehmet K.", "Selin T.", "Atanmamış"];

export default function WhatsAppMerkezi() {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [activeConv, setActiveConv] = useState<number | null>(1);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [showAI, setShowAI] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConvs = conversations.filter(c => {
    const lineMatch = activeLine === null || c.line === activeLine;
    const statusMatch = filterStatus === "all" || c.status === filterStatus;
    const searchMatch = c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMsg.toLowerCase().includes(search.toLowerCase());
    return lineMatch && statusMatch && searchMatch;
  });

  const selected = conversations.find(c => c.id === activeConv);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv, conversations]);

  const sendMessage = () => {
    if (!message.trim() || !activeConv) return;
    setConversations(prev => prev.map(c => c.id === activeConv ? {
      ...c,
      messages: [...c.messages, { id: Date.now(), dir: "out", text: message, time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }), read: true }],
      lastMsg: message,
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    } : c));
    setMessage("");
    setShowAI(false);
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: C.bg, color: C.text, height: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.green + "20", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💬</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>WhatsApp Merkezi</div>
            <div style={{ fontSize: 11, color: C.muted }}>{totalUnread} okunmamış mesaj</div>
          </div>
        </div>

        {/* Line tabs */}
        <div style={{ display: "flex", gap: 6, marginLeft: 16 }}>
          <button onClick={() => setActiveLine(null)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: activeLine === null ? C.accent : C.border, color: activeLine === null ? "#000" : C.mutedLight, fontSize: 12, fontWeight: 500 }}>
            Tüm Hatlar
          </button>
          {LINES.map(l => (
            <button key={l.id} onClick={() => setActiveLine(l.id)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${activeLine === l.id ? l.color : C.border}`, cursor: "pointer", background: activeLine === l.id ? l.color + "20" : "transparent", color: activeLine === l.id ? l.color : C.mutedLight, fontSize: 12, fontWeight: 500 }}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}40`, borderRadius: 6, padding: "5px 12px", fontSize: 11, color: C.green, fontWeight: 500 }}>
            ● 3 Hat Aktif
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Conversation list */}
        <div style={{ width: 300, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Search + filter */}
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ara..."
              style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 12px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {["all", "open", "waiting", "closed"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{ flex: 1, padding: "4px 0", borderRadius: 5, border: "none", cursor: "pointer", background: filterStatus === s ? C.accent : C.border, color: filterStatus === s ? "#000" : C.muted, fontSize: 10, fontWeight: 500 }}>
                  {s === "all" ? "Tümü" : s === "open" ? "Açık" : s === "waiting" ? "Bekleyen" : "Kapalı"}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredConvs.map(conv => {
              const line = LINES.find(l => l.id === conv.line);
              return (
                <div key={conv.id} onClick={() => setActiveConv(conv.id)} style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: activeConv === conv.id ? C.accentDim : "transparent", borderLeft: activeConv === conv.id ? `3px solid ${C.accent}` : "3px solid transparent", transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, position: "relative" }}>
                      {conv.name.charAt(0)}
                      <span style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: line?.color, border: `2px solid ${C.surface}` }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.name}</span>
                          {conv.vip && <span style={{ fontSize: 9, background: C.accentDim, color: C.accent, padding: "1px 4px", borderRadius: 3, fontWeight: 600, flexShrink: 0 }}>VIP</span>}
                        </div>
                        <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{conv.time}</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{conv.lastMsg}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                        <span style={{ fontSize: 9, color: conv.status === "open" ? C.green : conv.status === "waiting" ? C.accent : C.muted }}>
                          ● {conv.status === "open" ? "Açık" : conv.status === "waiting" ? "Bekliyor" : "Kapalı"}
                        </span>
                        {conv.unread > 0 && <span style={{ background: C.accent, color: "#000", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px" }}>{conv.unread}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        {selected ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Chat header */}
            <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600 }}>
                {selected.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{selected.name}</span>
                  {selected.vip && <span style={{ fontSize: 9, background: C.accentDim, color: C.accent, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>VIP</span>}
                  <span style={{ fontSize: 10, background: C.greenDim, color: C.green, padding: "2px 6px", borderRadius: 4 }}>Yeni Müşteri</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                  {LINES.find(l => l.id === selected.line)?.label} · {selected.assignedTo ? `Atandı: ${selected.assignedTo}` : "Atanmamış"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {/* Assign dropdown */}
                <select
                  defaultValue={selected.assignedTo || ""}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 10px", color: C.text, fontSize: 11, cursor: "pointer", outline: "none" }}
                  onChange={e => setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, assignedTo: e.target.value || null } : c))}
                >
                  <option value="">Ata...</option>
                  {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 10px", color: C.mutedLight, fontSize: 11, cursor: "pointer" }}>📋 Not</button>
                <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 10px", color: C.mutedLight, fontSize: 11, cursor: "pointer" }}>📦 Sipariş</button>
                <button style={{ background: C.greenDim, border: `1px solid ${C.green}40`, borderRadius: 6, padding: "5px 10px", color: C.green, fontSize: 11, cursor: "pointer", fontWeight: 500 }}>✓ Kapat</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: C.muted, background: C.border, padding: "3px 10px", borderRadius: 10 }}>Bugün</span>
              </div>
              {selected.messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.dir === "out" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "65%",
                    background: msg.dir === "out" ? C.accent + "15" : C.card,
                    border: `1px solid ${msg.dir === "out" ? C.accent + "30" : C.border}`,
                    borderRadius: msg.dir === "out" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    padding: "10px 14px",
                  }}>
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: C.text }}>{msg.text}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, textAlign: "right" }}>
                      {msg.time} {msg.dir === "out" && "✓✓"}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* AI suggestions */}
            {showAI && (
              <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "10px 16px" }}>
                <div style={{ fontSize: 11, color: C.purple, fontWeight: 500, marginBottom: 8 }}>⚡ AI Önerileri</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {AI_SUGGESTIONS.map((s, i) => (
                    <div key={i} onClick={() => { setMessage(s); setShowAI(false); }} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 12px", fontSize: 12, color: C.mutedLight, cursor: "pointer", transition: "all 0.15s" }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick replies */}
            <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {QUICK_REPLIES.map((r, i) => (
                <button key={i} onClick={() => setMessage(r)} style={{ fontSize: 11, padding: "4px 10px", background: C.border, border: "none", borderRadius: 12, color: C.mutedLight, cursor: "pointer" }}>{r}</button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: C.surface, display: "flex", gap: 10, alignItems: "flex-end" }}>
              <button onClick={() => setShowAI(!showAI)} style={{ background: showAI ? C.purple + "20" : C.card, border: `1px solid ${showAI ? C.purple + "40" : C.border}`, borderRadius: 8, padding: "9px 12px", color: showAI ? C.purple : C.muted, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>⚡ AI</button>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Mesajınızı yazın..."
                rows={1}
                style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5 }}
              />
              <button onClick={sendMessage} style={{ background: C.green, border: "none", borderRadius: 8, padding: "9px 14px", color: "#fff", cursor: "pointer", fontSize: 16, flexShrink: 0 }}>➤</button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 40 }}>💬</div>
            <div>Bir konuşma seçin</div>
          </div>
        )}

        {/* Right panel — customer info */}
        {selected && (
          <div style={{ width: 260, background: C.surface, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "16px", gap: 14, overflowY: "auto" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, margin: "0 auto 8px" }}>{selected.name.charAt(0)}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{selected.name}</div>
              {selected.vip && <span style={{ fontSize: 10, background: C.accentDim, color: C.accent, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>VIP Müşteri</span>}
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 0", fontSize: 11, color: C.mutedLight, cursor: "pointer" }}>📞 Ara</button>
              <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 0", fontSize: 11, color: C.mutedLight, cursor: "pointer" }}>✉️ SMS</button>
              <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 0", fontSize: 11, color: C.mutedLight, cursor: "pointer" }}>📋 Not</button>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px" }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 500 }}>MÜŞTERİ GEÇMİŞİ</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: C.muted }}>Toplam İş</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>8</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: C.muted }}>Toplam Harcama</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>2.850 TL</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: C.muted }}>Ort. Tutar</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>356 TL</span>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px" }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 500 }}>KAYITLI ADRESLER</div>
              {[
                { label: "Acıbadem Mh.", sub: "Kadıköy / İstanbul" },
                { label: "Levent Mh.", sub: "Beşiktaş / İstanbul" },
                { label: "Şişli Merkez", sub: "Şişli / İstanbul" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 12 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500 }}>{a.label}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px" }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 500 }}>SON İŞLEMLER</div>
              {[
                { route: "Acıbadem → Levent", status: "Onaylandı", price: "350 TL", color: C.accent },
                { route: "Kadıköy → Ümraniye", status: "Kuryede", price: "420 TL", color: C.blue },
                { route: "Şişli → Taksim", status: "Teslim", price: "300 TL", color: C.green },
              ].map((t, i) => (
                <div key={i} style={{ padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: C.mutedLight }}>{t.route}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.accent }}>{t.price}</span>
                  </div>
                  <span style={{ fontSize: 10, color: t.color }}>{t.status}</span>
                </div>
              ))}
            </div>

            <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.accent, fontWeight: 500, marginBottom: 4 }}>📌 Not</div>
              <div style={{ fontSize: 11, color: C.mutedLight, lineHeight: 1.5 }}>VIP müşteri – hızlı dönüş bekliyor. Fiyat hassasiyeti var.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}