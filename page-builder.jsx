import { useState, useRef, useCallback } from "react";

const COMPONENT_TYPES = {
  hero: {
    label: "Hero Banner",
    icon: "◻",
    description: "Full-bleed hero with image/video background",
    defaults: {
      title: "The Links\nCollection",
      subtitle: "Crafted for the course, designed for everywhere else.",
      ctaPrimary: "Shop the Collection",
      ctaSecondary: "Discover More",
      ctaPrimaryUrl: "#",
      ctaSecondaryUrl: "#",
      mediaUrl: "",
      mediaType: "image",
    },
  },
  split: {
    label: "Split Feature",
    icon: "◧",
    description: "50/50 image + content panel",
    defaults: {
      title: "The Iconic\nStripe Polo",
      description: "Engineered for peak performance with a refined heritage aesthetic.",
      ctaPrimary: "Shop Polos",
      ctaSecondary: "View Details",
      ctaPrimaryUrl: "#",
      ctaSecondaryUrl: "#",
      mediaUrl: "",
      mediaType: "image",
      reversed: false,
    },
  },
  videoRow: {
    label: "Video Row (3-up)",
    icon: "▶",
    description: "Three vertical video/image cards",
    defaults: {
      cards: [
        { title: "Performance Fabric", description: "Advanced moisture-wicking technology.", mediaUrl: "", mediaType: "image" },
        { title: "Unrestricted Movement", description: "Four-way stretch construction.", mediaUrl: "", mediaType: "image" },
        { title: "Heritage Design", description: "Classic championship styling.", mediaUrl: "", mediaType: "image" },
      ],
    },
  },
  categoryCards: {
    label: "Category Cards (2-up)",
    icon: "▣",
    description: "Two category cards with overlay CTAs",
    defaults: {
      cards: [
        { title: "Men's Collection", description: "Performance polos and layering pieces.", ctaLabel: "Shop Men", ctaUrl: "#", mediaUrl: "" },
        { title: "Women's Collection", description: "Refined silhouettes for the modern game.", ctaLabel: "Shop Women", ctaUrl: "#", mediaUrl: "" },
      ],
    },
  },
  productGrid: {
    label: "Product Grid",
    icon: "⊞",
    description: "Horizontal scrolling product carousel",
    defaults: {
      sectionTitle: "Shop the Collection",
      viewAllUrl: "#",
      products: [
        { name: "The Open Iconic Stripe Polo – Grey", category: "The Links Collection", price: "£60.00", salePrice: "", imageUrl: "", productUrl: "#" },
        { name: "The Open Performance Polo – Black", category: "The Links Collection", price: "£55.00", salePrice: "", imageUrl: "", productUrl: "#" },
        { name: "The Open BOSS Polo – White", category: "BOSS x The Open", price: "£95.00", salePrice: "", imageUrl: "", productUrl: "#" },
      ],
    },
  },
  bottomCta: {
    label: "Bottom CTA",
    icon: "→",
    description: "Simple full-width call to action",
    defaults: {
      title: "Shop the Collection",
      ctaLabel: "Shop Now",
      ctaUrl: "#",
    },
  },
};

const DEFAULT_PAGE = [
  { id: "1", type: "hero", data: { ...COMPONENT_TYPES.hero.defaults } },
  { id: "2", type: "split", data: { ...COMPONENT_TYPES.split.defaults } },
  { id: "3", type: "videoRow", data: { ...JSON.parse(JSON.stringify(COMPONENT_TYPES.videoRow.defaults)) } },
  { id: "4", type: "productGrid", data: { ...JSON.parse(JSON.stringify(COMPONENT_TYPES.productGrid.defaults)) } },
  { id: "5", type: "bottomCta", data: { ...COMPONENT_TYPES.bottomCta.defaults } },
];

// ---------- HTML GENERATOR ----------
function generateHTML(components) {
  const css = `<style>
:root{--color-primary:#002B3A;--color-secondary:#ffffff;--color-accent:#1A6B54;--color-muted:#6B7B83;--color-light-bg:#F7F6F3;--color-warm-bg:#F2EDE6;--color-gold:#B8965A;--font-heading:'Playfair Display','Georgia',serif;--font-body:'Source Sans 3','Helvetica Neue',sans-serif;--content-max:1440px;--transition-speed:0.35s}*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}body{font-family:var(--font-body);color:var(--color-primary);background:var(--color-secondary);overflow-x:hidden;line-height:1.6;font-weight:400}a{text-decoration:none;color:inherit}img,video{display:block;width:100%;height:100%;object-fit:cover}
.hero{position:relative;width:100%;height:92vh;min-height:600px;max-height:960px;overflow:hidden;background:var(--color-primary)}.hero__media{position:absolute;inset:0;z-index:1}.hero__media img{animation:gentleDrift 30s ease-in-out infinite alternate}@keyframes gentleDrift{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.05) translate(-0.5%,-0.5%)}}.hero__overlay{position:absolute;inset:0;z-index:2;background:linear-gradient(170deg,rgba(0,43,58,0.15) 0%,rgba(0,43,58,0.3) 40%,rgba(0,43,58,0.75) 100%)}.hero__content{position:absolute;bottom:0;left:0;right:0;z-index:3;padding:100px 64px;max-width:var(--content-max);margin:0 auto}.hero__title{font-family:var(--font-heading);font-size:clamp(42px,6vw,80px);font-weight:500;color:#fff;line-height:1.05;margin-bottom:20px;max-width:700px;white-space:pre-line}.hero__subtitle{font-family:var(--font-body);font-size:18px;font-weight:300;color:rgba(255,255,255,0.85);max-width:480px;margin-bottom:40px;line-height:1.7}.hero__actions{display:flex;gap:16px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;font-family:var(--font-body);font-size:14px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:16px 36px;border-radius:0;transition:all var(--transition-speed) ease;white-space:nowrap}.btn--primary{background:var(--color-secondary);color:var(--color-primary);border:1px solid var(--color-secondary)}.btn--primary:hover{background:var(--color-gold);color:#fff;border-color:var(--color-gold)}.btn--outline{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.45)}.btn--outline:hover{border-color:#fff;background:rgba(255,255,255,0.08)}.btn--dark{background:var(--color-primary);color:#fff;border:1px solid var(--color-primary)}.btn--dark:hover{background:var(--color-gold);border-color:var(--color-gold)}
.split-feature{display:grid;grid-template-columns:1fr 1fr;min-height:580px}.split-feature--reverse .split-feature__media{order:2}.split-feature--reverse .split-feature__content{order:1}.split-feature__media{position:relative;overflow:hidden;min-height:480px}.split-feature__media img{transition:transform 1.2s ease}.split-feature:hover .split-feature__media img{transform:scale(1.025)}.split-feature__content{display:flex;flex-direction:column;justify-content:center;padding:80px 72px;background:var(--color-primary);color:var(--color-secondary)}.split-feature__title{font-family:var(--font-heading);font-size:clamp(30px,3.5vw,48px);font-weight:500;line-height:1.1;margin-bottom:20px;white-space:pre-line}.split-feature__desc{font-size:16px;font-weight:300;color:rgba(255,255,255,0.7);margin-bottom:36px;max-width:420px;line-height:1.7}.split-feature__actions{display:flex;gap:16px;flex-wrap:wrap}
.video-features{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.1)}.video-feature-card{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--color-primary)}.video-feature-card__media{position:absolute;inset:0}.video-feature-card__media video,.video-feature-card__media img{width:100%;height:100%;object-fit:cover;transition:transform 1s ease}.video-feature-card:hover .video-feature-card__media video,.video-feature-card:hover .video-feature-card__media img{transform:scale(1.035)}.video-feature-card__overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(0,43,58,0.85) 0%,rgba(0,43,58,0.2) 40%,rgba(0,43,58,0.05) 100%)}.video-feature-card__content{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:48px 32px}.video-feature-card__title{font-family:var(--font-heading);font-size:clamp(20px,2vw,26px);font-weight:500;color:#fff;margin-bottom:12px;line-height:1.2}.video-feature-card__desc{font-size:14px;font-weight:300;color:rgba(255,255,255,0.8);line-height:1.65;max-width:300px}.video-feature-card__play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:3;width:68px;height:68px;border-radius:50%;background:rgba(255,255,255,0.1);backdrop-filter:blur(12px);border:1.5px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;opacity:0;transition:all 0.4s ease}.video-feature-card:hover .video-feature-card__play{opacity:1}.video-feature-card__play svg{width:20px;height:20px;fill:#fff;margin-left:3px}
.category-cards{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,0.1)}.category-card{position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--color-primary)}.category-card img{transition:transform 1s ease}.category-card:hover img{transform:scale(1.03)}.category-card__overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(0,43,58,0.7) 0%,rgba(0,43,58,0.1) 50%,rgba(0,43,58,0.02) 100%)}.category-card__content{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:48px 40px}.category-card__title{font-family:var(--font-heading);font-size:clamp(26px,3vw,38px);font-weight:500;color:#fff;margin-bottom:10px}.category-card__desc{font-size:15px;font-weight:300;color:rgba(255,255,255,0.8);margin-bottom:24px}.category-card__link{font-family:var(--font-body);font-size:13px;font-weight:600;color:#fff;text-transform:uppercase;letter-spacing:2px;display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border:1px solid rgba(255,255,255,0.4);transition:all var(--transition-speed) ease}.category-card__link:hover{background:#fff;color:var(--color-primary)}
.product-grid{padding:96px 0;background:var(--color-light-bg)}.product-grid__header{max-width:var(--content-max);margin:0 auto;padding:0 64px 48px;display:flex;justify-content:space-between;align-items:baseline}.product-grid__title{font-family:var(--font-heading);font-size:32px;font-weight:500}.product-grid__view-all{font-family:var(--font-body);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:var(--color-accent);border-bottom:1px solid transparent;padding-bottom:2px;transition:color var(--transition-speed)}.product-grid__view-all:hover{color:var(--color-primary);border-bottom-color:var(--color-primary)}.product-grid__track{display:flex;gap:24px;padding:0 64px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;scroll-behavior:smooth}.product-grid__track::-webkit-scrollbar{display:none}.product-card{flex:0 0 354px;scroll-snap-align:start;transition:transform var(--transition-speed) ease}.product-card:hover{transform:translateY(-3px)}.product-card__image{aspect-ratio:3/4;overflow:hidden;background:#fff;margin-bottom:18px}.product-card__image img{transition:transform 0.6s ease}.product-card:hover .product-card__image img{transform:scale(1.05)}.product-card__name{font-family:var(--font-body);font-weight:500;font-size:15px;margin-bottom:4px;line-height:1.4;color:var(--color-primary)}.product-card__category{font-size:13px;font-weight:400;color:var(--color-muted);margin-bottom:6px}.product-card__price{font-weight:600;font-size:15px;color:var(--color-primary)}.product-card__price--sale{color:#9B2C2C}.product-card__price--was{text-decoration:line-through;color:var(--color-muted);font-weight:400;margin-left:8px}.product-card__badge{display:inline-block;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#fff;background:#9B2C2C;padding:4px 12px;margin-top:8px}
.bottom-cta{padding:100px 64px;text-align:center;background:var(--color-primary)}.bottom-cta__title{font-family:var(--font-heading);font-size:clamp(36px,5vw,64px);font-weight:500;color:#fff;line-height:1.1;margin-bottom:40px}
.animate-in{opacity:0;transform:translateY(30px);transition:opacity 0.8s ease,transform 0.8s ease}.animate-in.visible{opacity:1;transform:translateY(0)}.animate-in-delay-1{transition-delay:0.15s}.animate-in-delay-2{transition-delay:0.3s}
@media(max-width:1024px){.hero__content{padding:72px 40px}.split-feature{grid-template-columns:1fr}.split-feature__media{min-height:400px}.split-feature__content{padding:64px 40px}.split-feature--reverse .split-feature__media{order:1}.split-feature--reverse .split-feature__content{order:2}.product-grid__header{padding:0 40px 40px}.product-grid__track{padding:0 40px}.product-card{flex:0 0 310px}}
@media(max-width:768px){.hero{height:auto;min-height:unset;max-height:unset;aspect-ratio:3/4}.hero__content{padding:48px 24px}.hero__title{font-size:clamp(36px,10vw,52px)}.video-features{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}.video-features::-webkit-scrollbar{display:none}.video-feature-card{flex:0 0 85vw;scroll-snap-align:start;aspect-ratio:3/4}.category-cards{grid-template-columns:1fr}.video-feature-card__content{padding:32px 24px}.product-card{flex:0 0 260px}.product-grid{padding:64px 0}.product-grid__header{padding:0 24px 32px}.product-grid__track{padding:0 24px;gap:16px}.bottom-cta{padding:72px 24px}}
</style>`;

  const mediaTag = (url, type, alt = "") => {
    if (!url) return `<div style="width:100%;height:100%;background:#1a3a4a"></div>`;
    if (type === "video") return `<video autoplay muted loop playsinline poster="${url}"><source src="${url}" type="video/mp4"></video>`;
    return `<img src="${url}" alt="${alt}" loading="lazy">`;
  };

  let body = "";
  for (const comp of components) {
    const d = comp.data;
    switch (comp.type) {
      case "hero":
        body += `<section class="hero"><div class="hero__media">${mediaTag(d.mediaUrl, d.mediaType, "Hero")}</div><div class="hero__overlay"></div><div class="hero__content"><h1 class="hero__title animate-in">${d.title}</h1><p class="hero__subtitle animate-in animate-in-delay-1">${d.subtitle}</p><div class="hero__actions animate-in animate-in-delay-2">${d.ctaPrimary ? `<a href="${d.ctaPrimaryUrl || "#"}" class="btn btn--primary">${d.ctaPrimary}</a>` : ""}${d.ctaSecondary ? `<a href="${d.ctaSecondaryUrl || "#"}" class="btn btn--outline">${d.ctaSecondary}</a>` : ""}</div></div></section>\n`;
        break;
      case "split":
        body += `<section class="split-feature${d.reversed ? " split-feature--reverse" : ""}"><div class="split-feature__media">${mediaTag(d.mediaUrl, d.mediaType, d.title)}</div><div class="split-feature__content"><h2 class="split-feature__title animate-in">${d.title}</h2><p class="split-feature__desc animate-in animate-in-delay-1">${d.description}</p><div class="split-feature__actions animate-in animate-in-delay-2">${d.ctaPrimary ? `<a href="${d.ctaPrimaryUrl || "#"}" class="btn btn--primary">${d.ctaPrimary}</a>` : ""}${d.ctaSecondary ? `<a href="${d.ctaSecondaryUrl || "#"}" class="btn btn--outline">${d.ctaSecondary}</a>` : ""}</div></div></section>\n`;
        break;
      case "videoRow":
        body += `<section class="video-features">${(d.cards || []).map((c) => `<div class="video-feature-card"><div class="video-feature-card__media">${mediaTag(c.mediaUrl, c.mediaType, c.title)}</div><div class="video-feature-card__overlay"></div><div class="video-feature-card__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="video-feature-card__content"><h3 class="video-feature-card__title">${c.title}</h3><p class="video-feature-card__desc">${c.description}</p></div></div>`).join("")}</section>\n`;
        break;
      case "categoryCards":
        body += `<section class="category-cards">${(d.cards || []).map((c) => `<a href="${c.ctaUrl || "#"}" class="category-card">${mediaTag(c.mediaUrl, "image", c.title)}<div class="category-card__overlay"></div><div class="category-card__content animate-in"><h3 class="category-card__title">${c.title}</h3><p class="category-card__desc">${c.description}</p><span class="category-card__link">${c.ctaLabel} →</span></div></a>`).join("")}</section>\n`;
        break;
      case "productGrid":
        body += `<section class="product-grid"><div class="product-grid__header"><h2 class="product-grid__title">${d.sectionTitle}</h2><a href="${d.viewAllUrl || "#"}" class="product-grid__view-all" target="_blank">View All →</a></div><div class="product-grid__track">${(d.products || []).map((p) => `<a href="${p.productUrl || "#"}" class="product-card" target="_blank"><div class="product-card__image">${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" loading="lazy">` : `<div style="width:100%;height:100%;background:#e8e4de"></div>`}</div><p class="product-card__name">${p.name}</p><p class="product-card__category">${p.category}</p><p class="product-card__price">${p.salePrice ? `<span class="product-card__price--sale">${p.salePrice}</span><span class="product-card__price--was">${p.price}</span>` : p.price}</p>${p.salePrice ? `<span class="product-card__badge">Sale</span>` : ""}</a>`).join("")}</div></section>\n`;
        break;
      case "bottomCta":
        body += `<section class="bottom-cta"><h2 class="bottom-cta__title animate-in">${d.title}</h2><a href="${d.ctaUrl || "#"}" class="btn btn--primary animate-in animate-in-delay-1">${d.ctaLabel}</a></section>\n`;
        break;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Collection Launch Page</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">
${css}
</head>
<body>
${body}
<script>
const observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add('visible')})},{threshold:0.15,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('.animate-in').forEach(e=>observer.observe(e));
<\/script>
</body>
</html>`;
}

// ---------- FIELD EDITOR COMPONENTS ----------
function TextField({ label, value, onChange, multiline, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>{label}</label>
      {multiline ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", resize: "vertical", background: "#fafafa", outline: "none", transition: "border 0.2s" }} onFocus={(e) => (e.target.style.borderColor = "#002B3A")} onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")} />
      ) : (
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", background: "#fafafa", outline: "none", transition: "border 0.2s" }} onFocus={(e) => (e.target.style.borderColor = "#002B3A")} onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")} />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", background: "#fafafa", outline: "none" }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{label}</label>
      <div onClick={() => onChange(!value)} style={{ width: 40, height: 22, borderRadius: 11, background: value ? "#002B3A" : "#ddd", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 2, left: value ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#eee", margin: "20px 0" }} />;
}

// ---------- COMPONENT-SPECIFIC EDITORS ----------
function HeroEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <>
      <TextField label="Title" value={data.title} onChange={(v) => set("title", v)} multiline placeholder="Enter headline..." />
      <TextField label="Subtitle" value={data.subtitle} onChange={(v) => set("subtitle", v)} multiline placeholder="Enter subtitle..." />
      <Divider />
      <TextField label="Image / Video URL" value={data.mediaUrl} onChange={(v) => set("mediaUrl", v)} placeholder="https://..." />
      <SelectField label="Media Type" value={data.mediaType} onChange={(v) => set("mediaType", v)} options={[{ value: "image", label: "Image" }, { value: "video", label: "Video" }]} />
      <Divider />
      <TextField label="Primary CTA Label" value={data.ctaPrimary} onChange={(v) => set("ctaPrimary", v)} />
      <TextField label="Primary CTA URL" value={data.ctaPrimaryUrl} onChange={(v) => set("ctaPrimaryUrl", v)} placeholder="https://..." />
      <TextField label="Secondary CTA Label" value={data.ctaSecondary} onChange={(v) => set("ctaSecondary", v)} />
      <TextField label="Secondary CTA URL" value={data.ctaSecondaryUrl} onChange={(v) => set("ctaSecondaryUrl", v)} placeholder="https://..." />
    </>
  );
}

function SplitEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <>
      <TextField label="Title" value={data.title} onChange={(v) => set("title", v)} multiline />
      <TextField label="Description" value={data.description} onChange={(v) => set("description", v)} multiline />
      <Divider />
      <TextField label="Image / Video URL" value={data.mediaUrl} onChange={(v) => set("mediaUrl", v)} placeholder="https://..." />
      <SelectField label="Media Type" value={data.mediaType} onChange={(v) => set("mediaType", v)} options={[{ value: "image", label: "Image" }, { value: "video", label: "Video" }]} />
      <ToggleField label="Reverse layout (media right)" value={data.reversed} onChange={(v) => set("reversed", v)} />
      <Divider />
      <TextField label="Primary CTA" value={data.ctaPrimary} onChange={(v) => set("ctaPrimary", v)} />
      <TextField label="Primary CTA URL" value={data.ctaPrimaryUrl} onChange={(v) => set("ctaPrimaryUrl", v)} placeholder="https://..." />
      <TextField label="Secondary CTA" value={data.ctaSecondary} onChange={(v) => set("ctaSecondary", v)} />
      <TextField label="Secondary CTA URL" value={data.ctaSecondaryUrl} onChange={(v) => set("ctaSecondaryUrl", v)} placeholder="https://..." />
    </>
  );
}

function VideoRowEditor({ data, onChange }) {
  const cards = data.cards || [];
  const updateCard = (idx, key, val) => {
    const next = cards.map((c, i) => (i === idx ? { ...c, [key]: val } : c));
    onChange({ ...data, cards: next });
  };
  const addCard = () => onChange({ ...data, cards: [...cards, { title: "New Card", description: "Description", mediaUrl: "", mediaType: "image" }] });
  const removeCard = (idx) => onChange({ ...data, cards: cards.filter((_, i) => i !== idx) });
  return (
    <>
      {cards.map((c, i) => (
        <div key={i} style={{ background: "#f8f8f8", borderRadius: 8, padding: 16, marginBottom: 12, border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Card {i + 1}</span>
            {cards.length > 1 && <button onClick={() => removeCard(i)} style={{ fontSize: 11, color: "#c0392b", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
          </div>
          <TextField label="Title" value={c.title} onChange={(v) => updateCard(i, "title", v)} />
          <TextField label="Description" value={c.description} onChange={(v) => updateCard(i, "description", v)} />
          <TextField label="Media URL" value={c.mediaUrl} onChange={(v) => updateCard(i, "mediaUrl", v)} placeholder="https://..." />
          <SelectField label="Media Type" value={c.mediaType} onChange={(v) => updateCard(i, "mediaType", v)} options={[{ value: "image", label: "Image" }, { value: "video", label: "Video" }]} />
        </div>
      ))}
      <button onClick={addCard} style={{ width: "100%", padding: "10px", border: "1px dashed #ccc", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#888", cursor: "pointer", background: "transparent" }}>+ Add Card</button>
    </>
  );
}

function CategoryCardsEditor({ data, onChange }) {
  const cards = data.cards || [];
  const updateCard = (idx, key, val) => {
    const next = cards.map((c, i) => (i === idx ? { ...c, [key]: val } : c));
    onChange({ ...data, cards: next });
  };
  const addCard = () => onChange({ ...data, cards: [...cards, { title: "New Category", description: "Description", ctaLabel: "Shop Now", ctaUrl: "#", mediaUrl: "" }] });
  const removeCard = (idx) => onChange({ ...data, cards: cards.filter((_, i) => i !== idx) });
  return (
    <>
      {cards.map((c, i) => (
        <div key={i} style={{ background: "#f8f8f8", borderRadius: 8, padding: 16, marginBottom: 12, border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Card {i + 1}</span>
            {cards.length > 1 && <button onClick={() => removeCard(i)} style={{ fontSize: 11, color: "#c0392b", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
          </div>
          <TextField label="Title" value={c.title} onChange={(v) => updateCard(i, "title", v)} />
          <TextField label="Description" value={c.description} onChange={(v) => updateCard(i, "description", v)} />
          <TextField label="CTA Label" value={c.ctaLabel} onChange={(v) => updateCard(i, "ctaLabel", v)} />
          <TextField label="CTA URL" value={c.ctaUrl} onChange={(v) => updateCard(i, "ctaUrl", v)} placeholder="https://..." />
          <TextField label="Image URL" value={c.mediaUrl} onChange={(v) => updateCard(i, "mediaUrl", v)} placeholder="https://..." />
        </div>
      ))}
      <button onClick={addCard} style={{ width: "100%", padding: "10px", border: "1px dashed #ccc", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#888", cursor: "pointer", background: "transparent" }}>+ Add Card</button>
    </>
  );
}

function ProductGridEditor({ data, onChange }) {
  const products = data.products || [];
  const updateProduct = (idx, key, val) => {
    const next = products.map((p, i) => (i === idx ? { ...p, [key]: val } : p));
    onChange({ ...data, products: next });
  };
  const addProduct = () => onChange({ ...data, products: [...products, { name: "New Product", category: "Collection", price: "£0.00", salePrice: "", imageUrl: "", productUrl: "#" }] });
  const removeProduct = (idx) => onChange({ ...data, products: products.filter((_, i) => i !== idx) });
  return (
    <>
      <TextField label="Section Title" value={data.sectionTitle} onChange={(v) => onChange({ ...data, sectionTitle: v })} />
      <TextField label="View All URL" value={data.viewAllUrl} onChange={(v) => onChange({ ...data, viewAllUrl: v })} placeholder="https://..." />
      <Divider />
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "#888", marginBottom: 12 }}>Products ({products.length})</div>
      {products.map((p, i) => (
        <div key={i} style={{ background: "#f8f8f8", borderRadius: 8, padding: 16, marginBottom: 12, border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Product {i + 1}</span>
            <button onClick={() => removeProduct(i)} style={{ fontSize: 11, color: "#c0392b", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Remove</button>
          </div>
          <TextField label="Name" value={p.name} onChange={(v) => updateProduct(i, "name", v)} />
          <TextField label="Category" value={p.category} onChange={(v) => updateProduct(i, "category", v)} />
          <TextField label="Price" value={p.price} onChange={(v) => updateProduct(i, "price", v)} placeholder="£00.00" />
          <TextField label="Sale Price (optional)" value={p.salePrice} onChange={(v) => updateProduct(i, "salePrice", v)} placeholder="£00.00" />
          <TextField label="Image URL" value={p.imageUrl} onChange={(v) => updateProduct(i, "imageUrl", v)} placeholder="https://..." />
          <TextField label="Product URL" value={p.productUrl} onChange={(v) => updateProduct(i, "productUrl", v)} placeholder="https://..." />
        </div>
      ))}
      <button onClick={addProduct} style={{ width: "100%", padding: "10px", border: "1px dashed #ccc", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#888", cursor: "pointer", background: "transparent" }}>+ Add Product</button>
    </>
  );
}

function BottomCtaEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <>
      <TextField label="Title" value={data.title} onChange={(v) => set("title", v)} />
      <TextField label="CTA Label" value={data.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
      <TextField label="CTA URL" value={data.ctaUrl} onChange={(v) => set("ctaUrl", v)} placeholder="https://..." />
    </>
  );
}

const EDITORS = { hero: HeroEditor, split: SplitEditor, videoRow: VideoRowEditor, categoryCards: CategoryCardsEditor, productGrid: ProductGridEditor, bottomCta: BottomCtaEditor };

// ---------- MINI PREVIEW THUMBNAILS ----------
function MiniPreview({ type }) {
  const s = { display: "flex", width: "100%", height: 48, borderRadius: 4, overflow: "hidden", border: "1px solid #e8e8e8" };
  const dark = "#002B3A";
  const mid = "#1a4a5a";
  const light = "#f0ece6";
  switch (type) {
    case "hero": return <div style={{ ...s, background: `linear-gradient(135deg, ${mid}, ${dark})`, alignItems: "flex-end", padding: "0 0 6px 8px" }}><div style={{ width: "40%", height: 4, background: "rgba(255,255,255,0.6)", borderRadius: 2 }} /><div style={{ width: "25%", height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 2, marginLeft: 4 }} /></div>;
    case "split": return <div style={s}><div style={{ width: "50%", height: "100%", background: light }} /><div style={{ width: "50%", height: "100%", background: dark, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8px", gap: 3 }}><div style={{ width: "60%", height: 3, background: "rgba(255,255,255,0.6)", borderRadius: 1 }} /><div style={{ width: "80%", height: 2, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} /></div></div>;
    case "videoRow": return <div style={{ ...s, gap: 1 }}><div style={{ flex: 1, background: `linear-gradient(to top, ${dark}, ${mid})` }} /><div style={{ flex: 1, background: `linear-gradient(to top, ${dark}, ${mid})` }} /><div style={{ flex: 1, background: `linear-gradient(to top, ${dark}, ${mid})` }} /></div>;
    case "categoryCards": return <div style={{ ...s, gap: 1 }}><div style={{ flex: 1, background: `linear-gradient(to top, ${dark}, ${mid})` }} /><div style={{ flex: 1, background: `linear-gradient(to top, ${dark}, ${mid})` }} /></div>;
    case "productGrid": return <div style={{ ...s, background: light, padding: "8px 6px", gap: 4 }}>{[1, 2, 3, 4].map((i) => <div key={i} style={{ width: 28, height: 32, background: "#fff", borderRadius: 2, border: "1px solid #e0dcd6" }} />)}</div>;
    case "bottomCta": return <div style={{ ...s, background: dark, justifyContent: "center", alignItems: "center" }}><div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.6)", borderRadius: 2 }} /></div>;
    default: return <div style={s} />;
  }
}

// ---------- MAIN APP ----------
export default function PageBuilder() {
  const [components, setComponents] = useState(DEFAULT_PAGE);
  const [selected, setSelected] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedHTML, setExportedHTML] = useState("");
  const idCounter = useRef(100);

  const addComponent = (type) => {
    idCounter.current++;
    const newComp = { id: String(idCounter.current), type, data: JSON.parse(JSON.stringify(COMPONENT_TYPES[type].defaults)) };
    setComponents((prev) => [...prev, newComp]);
    setSelected(newComp.id);
  };

  const removeComponent = (id) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selected === id) setSelected(null);
  };

  const updateComponent = (id, data) => {
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, data } : c)));
  };

  const moveComponent = (fromIdx, toIdx) => {
    if (fromIdx === toIdx) return;
    setComponents((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  };

  const duplicateComponent = (id) => {
    const comp = components.find((c) => c.id === id);
    if (!comp) return;
    idCounter.current++;
    const idx = components.findIndex((c) => c.id === id);
    const dup = { id: String(idCounter.current), type: comp.type, data: JSON.parse(JSON.stringify(comp.data)) };
    setComponents((prev) => [...prev.slice(0, idx + 1), dup, ...prev.slice(idx + 1)]);
    setSelected(dup.id);
  };

  const handleExport = () => {
    setExportedHTML(generateHTML(components));
    setShowExportModal(true);
  };

  const handleDownload = () => {
    const html = generateHTML(components);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "collection-page.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedComp = components.find((c) => c.id === selected);
  const EditorComponent = selectedComp ? EDITORS[selectedComp.type] : null;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Source Sans 3', -apple-system, sans-serif", background: "#ffffff", color: "#222" }}>
      {/* LEFT SIDEBAR - Component Library + Layer List */}
      <div style={{ width: 280, borderRight: "1px solid #eee", display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #eee" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, background: "#002B3A", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>C</div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>Collection Builder</span>
          </div>
        </div>

        {/* Add Components */}
        <div style={{ padding: "16px 20px 8px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>Add Component</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {Object.entries(COMPONENT_TYPES).map(([key, val]) => (
              <button key={key} onClick={() => addComponent(key)} style={{ padding: "10px 8px", border: "1px solid #eee", borderRadius: 8, fontSize: 11, fontWeight: 600, color: "#555", cursor: "pointer", background: "#fafafa", transition: "all 0.15s", textAlign: "center", lineHeight: 1.3 }}
                onMouseEnter={(e) => { e.target.style.background = "#f0f0f0"; e.target.style.borderColor = "#ddd"; }}
                onMouseLeave={(e) => { e.target.style.background = "#fafafa"; e.target.style.borderColor = "#eee"; }}>
                <span style={{ display: "block", fontSize: 16, marginBottom: 3 }}>{val.icon}</span>
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layer List */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>Layers ({components.length})</div>
          {components.map((comp, idx) => (
            <div key={comp.id} draggable onDragStart={() => setDragIdx(idx)} onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx); }}
              onDragLeave={() => setDragOverIdx(null)}
              onDrop={() => { moveComponent(dragIdx, idx); setDragIdx(null); setDragOverIdx(null); }}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              onClick={() => setSelected(comp.id)}
              style={{
                padding: "10px 12px", marginBottom: 4, borderRadius: 8, cursor: "grab",
                background: selected === comp.id ? "#f0f7fa" : dragOverIdx === idx ? "#f5f5f5" : "transparent",
                border: selected === comp.id ? "1px solid #b8dce8" : dragOverIdx === idx ? "1px dashed #ccc" : "1px solid transparent",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10,
              }}>
              <div style={{ color: "#bbb", fontSize: 10, cursor: "grab", userSelect: "none", lineHeight: 1 }}>⠿</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <MiniPreview type={comp.type} />
              </div>
              <div style={{ flex: 1.2, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{COMPONENT_TYPES[comp.type]?.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #eee" }}>
          <button onClick={handleDownload} style={{ width: "100%", padding: "13px 20px", background: "#002B3A", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.5px", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.target.style.background = "#B8965A")}
            onMouseLeave={(e) => (e.target.style.background = "#002B3A")}>
            ↓ Export HTML
          </button>
          <button onClick={handleExport} style={{ width: "100%", padding: "10px 20px", background: "transparent", color: "#888", border: "1px solid #eee", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 6, transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.target.style.borderColor = "#ccc"; e.target.style.color = "#555"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "#eee"; e.target.style.color = "#888"; }}>
            View Source
          </button>
        </div>
      </div>

      {/* CENTER - Canvas Preview */}
      <div style={{ flex: 1, overflow: "auto", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 960, margin: "32px auto", background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid #eee" }}>
          {components.length === 0 && (
            <div style={{ padding: 80, textAlign: "center", color: "#bbb" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>◻</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No components yet</div>
              <div style={{ fontSize: 13 }}>Add components from the left panel to start building.</div>
            </div>
          )}
          {components.map((comp, idx) => {
            const type = COMPONENT_TYPES[comp.type];
            const isSelected = selected === comp.id;
            return (
              <div key={comp.id} onClick={() => setSelected(comp.id)} style={{ position: "relative", cursor: "pointer", outline: isSelected ? "2px solid #002B3A" : "2px solid transparent", outlineOffset: -2, transition: "outline 0.15s" }}>
                {/* Component preview */}
                <ComponentPreview comp={comp} />
                {/* Hover toolbar */}
                {isSelected && (
                  <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4, zIndex: 10 }}>
                    {idx > 0 && <ToolbarBtn label="↑" onClick={(e) => { e.stopPropagation(); moveComponent(idx, idx - 1); }} />}
                    {idx < components.length - 1 && <ToolbarBtn label="↓" onClick={(e) => { e.stopPropagation(); moveComponent(idx, idx + 1); }} />}
                    <ToolbarBtn label="⧉" onClick={(e) => { e.stopPropagation(); duplicateComponent(comp.id); }} />
                    <ToolbarBtn label="✕" onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }} danger />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDEBAR - Editor */}
      <div style={{ width: 320, borderLeft: "1px solid #eee", flexShrink: 0, overflow: "auto", background: "#fff" }}>
        {selectedComp && EditorComponent ? (
          <div>
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{COMPONENT_TYPES[selectedComp.type]?.label}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{COMPONENT_TYPES[selectedComp.type]?.description}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #eee", background: "transparent", cursor: "pointer", fontSize: 14, color: "#aaa", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <EditorComponent data={selectedComp.data} onChange={(data) => updateComponent(selectedComp.id, data)} />
            </div>
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "#ccc" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>←</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Select a component<br />to edit its properties</div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }} onClick={() => setShowExportModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 800, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>HTML Source</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { navigator.clipboard.writeText(exportedHTML); }} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, border: "1px solid #ddd", borderRadius: 6, background: "#fafafa", cursor: "pointer" }}>Copy</button>
                <button onClick={() => setShowExportModal(false)} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, background: "#002B3A", color: "#fff", cursor: "pointer" }}>Close</button>
              </div>
            </div>
            <pre style={{ padding: 24, overflow: "auto", flex: 1, fontSize: 11, lineHeight: 1.5, fontFamily: "'SF Mono', 'Fira Code', monospace", color: "#444", background: "#fafafa", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{exportedHTML}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({ label, onClick, danger }) {
  return (
    <button onClick={onClick} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: danger ? "#fee" : "rgba(255,255,255,0.95)", color: danger ? "#c0392b" : "#333", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", fontWeight: 700, transition: "background 0.15s" }}>{label}</button>
  );
}

// ---------- PREVIEW RENDERER ----------
function ComponentPreview({ comp }) {
  const d = comp.data;
  const placeholder = (h, bg = "#1a4a5a") => <div style={{ width: "100%", height: h, background: bg }} />;
  const mediaPreview = (url, type, h) => {
    if (!url) return placeholder(h);
    if (type === "video") return <video src={url} muted autoPlay loop playsInline style={{ width: "100%", height: h, objectFit: "cover" }} />;
    return <img src={url} alt="" style={{ width: "100%", height: h, objectFit: "cover" }} />;
  };

  switch (comp.type) {
    case "hero":
      return (
        <div style={{ position: "relative", height: 340, overflow: "hidden", background: "#002B3A" }}>
          <div style={{ position: "absolute", inset: 0 }}>{mediaPreview(d.mediaUrl, d.mediaType, "100%")}</div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, rgba(0,43,58,0.15), rgba(0,43,58,0.75))" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, padding: "40px 32px", zIndex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 500, color: "#fff", lineHeight: 1.1, whiteSpace: "pre-line", marginBottom: 8 }}>{d.title}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", maxWidth: 340, marginBottom: 16 }}>{d.subtitle}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {d.ctaPrimary && <span style={{ padding: "8px 18px", background: "#fff", color: "#002B3A", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{d.ctaPrimary}</span>}
              {d.ctaSecondary && <span style={{ padding: "8px 18px", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{d.ctaSecondary}</span>}
            </div>
          </div>
        </div>
      );
    case "split":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 240 }}>
          <div style={{ order: d.reversed ? 2 : 1 }}>{mediaPreview(d.mediaUrl, d.mediaType, "100%")}</div>
          <div style={{ order: d.reversed ? 1 : 2, background: "#002B3A", padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1.15, whiteSpace: "pre-line", marginBottom: 8 }}>{d.title}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 16, maxWidth: 280 }}>{d.description}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {d.ctaPrimary && <span style={{ padding: "6px 14px", background: "#fff", color: "#002B3A", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{d.ctaPrimary}</span>}
            </div>
          </div>
        </div>
      );
    case "videoRow":
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${(d.cards || []).length}, 1fr)`, gap: 1, background: "rgba(255,255,255,0.1)" }}>
          {(d.cards || []).map((c, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#002B3A" }}>
              <div style={{ position: "absolute", inset: 0 }}>{mediaPreview(c.mediaUrl, c.mediaType, "100%")}</div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,43,58,0.85) 0%, rgba(0,43,58,0.1) 50%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px", zIndex: 1 }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{c.description}</div>
              </div>
            </div>
          ))}
        </div>
      );
    case "categoryCards":
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${(d.cards || []).length}, 1fr)`, gap: 1 }}>
          {(d.cards || []).map((c, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: "#002B3A" }}>
              <div style={{ position: "absolute", inset: 0 }}>{mediaPreview(c.mediaUrl, "image", "100%")}</div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,43,58,0.7) 0%, rgba(0,43,58,0.05) 60%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px", zIndex: 1 }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>{c.description}</div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff", padding: "6px 14px", border: "1px solid rgba(255,255,255,0.4)" }}>{c.ctaLabel} →</span>
              </div>
            </div>
          ))}
        </div>
      );
    case "productGrid":
      return (
        <div style={{ padding: "32px 0", background: "#F7F6F3" }}>
          <div style={{ padding: "0 24px 20px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 500 }}>{d.sectionTitle}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#1A6B54" }}>View All →</span>
          </div>
          <div style={{ display: "flex", gap: 12, padding: "0 24px", overflow: "hidden" }}>
            {(d.products || []).slice(0, 5).map((p, i) => (
              <div key={i} style={{ flex: "0 0 140px" }}>
                <div style={{ aspectRatio: "3/4", background: p.imageUrl ? "transparent" : "#e8e4de", marginBottom: 8, borderRadius: 2, overflow: "hidden" }}>
                  {p.imageUrl && <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.3, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#6B7B83" }}>{p.category}</div>
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>
                  {p.salePrice ? <><span style={{ color: "#9B2C2C" }}>{p.salePrice}</span> <span style={{ textDecoration: "line-through", color: "#aaa", fontWeight: 400 }}>{p.price}</span></> : p.price}
                </div>
              </div>
            ))}
            {(d.products || []).length > 5 && <div style={{ flex: "0 0 140px", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 12 }}>+{d.products.length - 5} more</div>}
          </div>
        </div>
      );
    case "bottomCta":
      return (
        <div style={{ padding: "48px 32px", textAlign: "center", background: "#002B3A" }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 500, color: "#fff", marginBottom: 20 }}>{d.title}</div>
          <span style={{ padding: "10px 24px", background: "#fff", color: "#002B3A", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{d.ctaLabel}</span>
        </div>
      );
    default:
      return placeholder(100);
  }
}
