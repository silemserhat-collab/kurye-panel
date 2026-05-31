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
  blue: "#3B82F6",
  blueDim: "#3B82F620",
  purple: "#A78BFA",
  text: "#E8EAF0",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
};

const COURIERS = [
  { id: 1, name: "Mehmet A.", vehicle: "🛵", district: "Kadıköy", status: "available", rating: 4.8 },
  { id: 2, name: "Ahmet K.", vehicle: "🛵", district: "Şişli", status: "available", rating: 4.9 },
  { id: 3, name: "Ali D.", vehicle: "🚲", district: "Beşiktaş", status: "available", rating: 4.7 },
  { id: 4, name: "Yusuf Y.", vehicle: "🛵", district: "Ataşehir", status: "available", rating: 4.6 },
  { id: 5, name: "Selin T.", vehicle: "🛵", district: "Üsküdar", status: "available", rating: 4.9 },
];

const RECENT_CUSTOMERS = [
  { id: 1, name: "+90 555 123 45 67", label: "VIP" },
  { id: 2, name: "Ayşe Yıldız", label: "" },
  { id: 3, name: "ABC Lojistik", label: "Kurumsal" },
  { id: 4, name: "+90 532 987 65 43", label: "" },
];

const PACKAGE_TYPES = [
  { id: "evrak", label: "Evrak", icon: "📄", basePrice: 80 },
  { id: "kucuk", label: "Küçük Paket", icon: "📦", basePrice: 120 },
  { id: "orta", label: "Orta Paket", icon: "🗃️", basePrice: 180 },
  { id: "buyuk", label: "Büyük Paket", icon: "📫", basePrice: 250 },
  { id: "motor", label: "Motor Kurye", icon: "🛵", basePrice: 100 },
];

const ISTANBUL_DISTRICTS = [
  "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler",
  "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü",
  "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt",
  "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane",
  "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer",
  "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla",
  "Ümraniye", "Üsküdar", "Zeytinburnu"
];

function calcPrice(pickup: string, delivery: string, pkgType: string): number {
  const pkg = PACKAGE_TYPES.find(p => p.id === pkgType);
  const base = pkg?.basePrice || 100;
  // Simple distance simulation
  const sameArea = pickup === delivery;
  const multiplier = sameArea ? 1 : pickup && delivery ? 1.5 + Math.random() * 1.5 : 1;
  return Math.round(base * multiplier / 10) * 10;
}

const STEPS = ["Müşteri", "Adres", "Paket", "Fiyat & Kurye", "Onay"];

export default function YeniSiparis() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    customer: "",
    customerPhone: "",
    pickupAddress: "",
    pickupDistrict: "",
    pickupNote: "",
    deliveryAddress: "",
    deliveryDistrict: "",
    deliveryNote: "",
    packageType: "",
    packageDesc: "",
    weight: "",
    price: 0,
    priceApproved: false,
    courierId: null as number | null,
    paymentType: "nakit",
    urgent: false,
    note: "",
  });
  const [priceLoading, setPriceLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const calcAndSetPrice = () => {
    setPriceLoading(true);
    setTimeout(() => {
      const p = calcPrice(form.pickupDistrict, form.deliveryDistrict, form.packageType);
      set("price", p);
      setPriceLoading(false);
    }, 800);
  };

  const selectedCourier = COURIERS.find(c => c.id === form.courierId);

  const inputStyle = {
    width: "100%", background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13,
    outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
  };

  const labelStyle = { fontSize: 11, color: C.muted, marginBottom: 5, display: "block" as const, fontWeight: 500 };

  if (submitted) {
    return (
      <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Sipariş Oluşturuldu!</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
            Sipariş #250519 başarıyla oluşturuldu.<br />
            {selectedCourier ? `${selectedCourier.name} atandı.` : "Kurye atanacak."}
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px", marginBottom: 20, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: C.muted, fontSize: 12 }}>Güzergah</span>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{form.pickupDistrict} → {form.deliveryDistrict}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: C.muted, fontSize: 12 }}>Paket</span>
              <span style={{ fontSize: 12 }}>{PACKAGE_TYPES.find(p => p.id === form.packageType)?.label}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.muted, fontSize: 12 }}>Tutar</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{form.price} TL</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setSubmitted(false); setStep(0); setForm(f => ({ ...f, customer: "", pickupDistrict: "", deliveryDistrict: "", packageType: "", price: 0, courierId: null })); }}
              style={{ flex: 1, background: C.border, border: "none", borderRadius: 8, padding: "11px", color: C.text, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              + Yeni Sipariş
            </button>
            <button style={{ flex: 1, background: C.accent, border: "none", borderRadius: 8, padding: "11px", color: "#000", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Takip Et →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 16 }}>📦</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Yeni Sipariş Oluştur</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {form.urgent && <span style={{ background: C.red + "20", color: C.red, fontSize: 11, padding: "3px 10px", borderRadius: 6, fontWeight: 500 }}>⚡ ACİL</span>}
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 700, margin: "0 auto" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: i < step ? "pointer" : "default" }} onClick={() => i < step && setStep(i)}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600,
                  background: i < step ? C.green : i === step ? C.accent : C.border,
                  color: i <= step ? "#000" : C.muted,
                  transition: "all 0.3s",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i === step ? C.accent : i < step ? C.green : C.muted, fontWeight: i === step ? 500 : 400, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? C.green : C.border, margin: "0 12px", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: "32px auto", padding: "0 24px" }}>

        {/* Step 0: Müşteri */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Müşteri Bilgileri</div>
              <div style={{ fontSize: 13, color: C.muted }}>Mevcut müşteri seçin veya yeni müşteri ekleyin.</div>
            </div>

            <div>
              <label style={labelStyle}>Son Müşteriler</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {RECENT_CUSTOMERS.map(c => (
                  <div key={c.id} onClick={() => set("customer", c.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: form.customer === c.name ? C.accentDim : C.card, border: `1px solid ${form.customer === c.name ? C.accent + "40" : C.border}`, borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>{c.name.charAt(0)}</div>
                    <span style={{ fontSize: 13, flex: 1 }}>{c.name}</span>
                    {c.label && <span style={{ fontSize: 10, background: C.accentDim, color: C.accent, padding: "2px 6px", borderRadius: 4 }}>{c.label}</span>}
                    {form.customer === c.name && <span style={{ color: C.green, fontSize: 14 }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 11, color: C.muted }}>veya yeni müşteri</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Ad Soyad / Firma</label>
                <input value={form.customer} onChange={e => set("customer", e.target.value)} placeholder="Müşteri adı..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input value={form.customerPhone} onChange={e => set("customerPhone", e.target.value)} placeholder="+90 5XX XXX XX XX" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer" }} onClick={() => set("urgent", !form.urgent)}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: form.urgent ? C.red : C.border, border: `1px solid ${form.urgent ? C.red : C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{form.urgent && "✓"}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>⚡ Acil Sipariş</div>
                <div style={{ fontSize: 11, color: C.muted }}>Öncelikli kurye atanır, ek ücret uygulanır.</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Adres */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Adres Bilgileri</div>
              <div style={{ fontSize: 13, color: C.muted }}>Alım ve teslimat adreslerini girin.</div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ width: 24, height: 24, background: C.green + "20", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>A</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.green }}>Alım Adresi</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>İlçe</label>
                  <select value={form.pickupDistrict} onChange={e => set("pickupDistrict", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Seçin...</option>
                    {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Açık Adres</label>
                  <input value={form.pickupAddress} onChange={e => set("pickupAddress", e.target.value)} placeholder="Mahalle, cadde, no..." style={inputStyle} />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={labelStyle}>Adres Notu</label>
                <input value={form.pickupNote} onChange={e => set("pickupNote", e.target.value)} placeholder="Kat, daire, bina adı..." style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 1, height: 20, background: C.border }} />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ width: 24, height: 24, background: C.red + "20", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>B</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.red }}>Teslimat Adresi</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>İlçe</label>
                  <select value={form.deliveryDistrict} onChange={e => set("deliveryDistrict", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Seçin...</option>
                    {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Açık Adres</label>
                  <input value={form.deliveryAddress} onChange={e => set("deliveryAddress", e.target.value)} placeholder="Mahalle, cadde, no..." style={inputStyle} />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={labelStyle}>Adres Notu</label>
                <input value={form.deliveryNote} onChange={e => set("deliveryNote", e.target.value)} placeholder="Kat, daire, bina adı..." style={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Paket */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Paket Bilgileri</div>
              <div style={{ fontSize: 13, color: C.muted }}>Paket türü ve açıklamasını seçin.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {PACKAGE_TYPES.map(p => (
                <div key={p.id} onClick={() => set("packageType", p.id)} style={{ padding: "14px", background: form.packageType === p.id ? C.accentDim : C.card, border: `1px solid ${form.packageType === p.id ? C.accent + "60" : C.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Baz fiyat: {p.basePrice} TL</div>
                  </div>
                  {form.packageType === p.id && <span style={{ marginLeft: "auto", color: C.accent, fontSize: 16 }}>✓</span>}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Paket Açıklaması</label>
                <input value={form.packageDesc} onChange={e => set("packageDesc", e.target.value)} placeholder="İçerik, özel talimatlar..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ağırlık (kg)</label>
                <input value={form.weight} onChange={e => set("weight", e.target.value)} placeholder="0.5" type="number" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Sipariş Notu</label>
              <textarea value={form.note} onChange={e => set("note", e.target.value)} placeholder="Özel istekler, dikkat edilmesi gerekenler..." rows={3} style={{ ...inputStyle, resize: "none" }} />
            </div>
          </div>
        )}

        {/* Step 3: Fiyat & Kurye */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Fiyat & Kurye Ataması</div>
              <div style={{ fontSize: 13, color: C.muted }}>Fiyatı hesaplayın ve kurye seçin.</div>
            </div>

            {/* Price card */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Fiyat Hesaplama</span>
                <button onClick={calcAndSetPrice} style={{ background: C.accent, border: "none", borderRadius: 7, padding: "7px 16px", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {priceLoading ? "Hesaplanıyor..." : "Hesapla"}
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12, fontSize: 12, color: C.muted }}>
                <span>📍 {form.pickupDistrict || "—"}</span>
                <span>→</span>
                <span>📍 {form.deliveryDistrict || "—"}</span>
                <span style={{ marginLeft: 8 }}>·</span>
                <span>{PACKAGE_TYPES.find(p => p.id === form.packageType)?.label || "—"}</span>
                {form.urgent && <span style={{ color: C.red }}>· ⚡ Acil</span>}
              </div>

              {form.price > 0 && (
                <div>
                  <div style={{ fontSize: 36, fontWeight: 600, color: C.accent, letterSpacing: "-1px", marginBottom: 8 }}>
                    {form.price} TL
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div onClick={() => set("priceApproved", !form.priceApproved)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: form.priceApproved ? C.green : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#000" }}>{form.priceApproved && "✓"}</div>
                      <span style={{ fontSize: 12, color: form.priceApproved ? C.green : C.muted }}>Müşteri fiyatı onayladı</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment */}
            <div>
              <label style={labelStyle}>Ödeme Yöntemi</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["nakit", "kredi", "havale"].map(p => (
                  <button key={p} onClick={() => set("paymentType", p)} style={{ flex: 1, padding: "9px", borderRadius: 7, border: `1px solid ${form.paymentType === p ? C.accent + "60" : C.border}`, background: form.paymentType === p ? C.accentDim : C.card, color: form.paymentType === p ? C.accent : C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: form.paymentType === p ? 500 : 400 }}>
                    {p === "nakit" ? "💵 Nakit" : p === "kredi" ? "💳 Kredi Kartı" : "🏦 Havale"}
                  </button>
                ))}
              </div>
            </div>

            {/* Couriers */}
            <div>
              <label style={labelStyle}>Kurye Seç</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {COURIERS.map(c => (
                  <div key={c.id} onClick={() => set("courierId", c.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: form.courierId === c.id ? C.blueDim : C.card, border: `1px solid ${form.courierId === c.id ? C.blue + "40" : C.border}`, borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.green + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.vehicle}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{c.district} · ⭐ {c.rating}</div>
                    </div>
                    <span style={{ fontSize: 10, background: C.greenDim, color: C.green, padding: "2px 8px", borderRadius: 4 }}>Müsait</span>
                    {form.courierId === c.id && <span style={{ color: C.blue, fontSize: 16 }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Onay */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Sipariş Özeti</div>
              <div style={{ fontSize: 13, color: C.muted }}>Bilgileri kontrol edip onaylayın.</div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              {[
                { label: "Müşteri", value: form.customer },
                { label: "Alım", value: `${form.pickupDistrict} — ${form.pickupAddress}` },
                { label: "Teslimat", value: `${form.deliveryDistrict} — ${form.deliveryAddress}` },
                { label: "Paket", value: PACKAGE_TYPES.find(p => p.id === form.packageType)?.label },
                { label: "Kurye", value: selectedCourier?.name || "Atanacak" },
                { label: "Ödeme", value: form.paymentType === "nakit" ? "Nakit" : form.paymentType === "kredi" ? "Kredi Kartı" : "Havale" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 12, color: C.muted }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{row.value || "—"}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", background: C.accentDim, borderTop: `1px solid ${C.accent}30` }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Toplam Tutar</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>{form.price} TL</span>
              </div>
            </div>

            {form.note && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Not</div>
                <div style={{ fontSize: 12 }}>{form.note}</div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: "11px 24px", background: C.border, border: "none", borderRadius: 8, color: C.text, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              ← Geri
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button onClick={() => { if (step === 2) calcAndSetPrice(); setStep(s => s + 1); }} style={{ padding: "11px 28px", background: C.accent, border: "none", borderRadius: 8, color: "#000", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Devam →
            </button>
          ) : (
            <button onClick={() => setSubmitted(true)} style={{ padding: "11px 28px", background: C.green, border: "none", borderRadius: 8, color: "#000", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              ✓ Siparişi Onayla
            </button>
          )}
        </div>
      </div>
    </div>
  );
}