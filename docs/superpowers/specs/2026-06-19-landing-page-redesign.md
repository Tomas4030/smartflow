# SmartFlow Landing Page Redesign

**Date:** 2026-06-19  
**Approach:** B — Transform in place (same component structure, all new content)  
**Goal:** Convert pitch-deck landing page into a real product landing page that sells to municipalities and registers citizens.

---

## Context

The current landing page was built from pitch deck content. It contains EU investment market data, a 2026–2033 roadmap, competitor analysis by name, and a pricing/team section — all aimed at investors, not buyers or users. A municipality landing on the page sees data, not a product. A citizen sees nothing relevant to them.

## Target Audiences

- **Municipalities** — want to understand what SmartFlow does, how simple it is to deploy, and how to start a pilot. CTA: schedule a demo.
- **Citizens** — want to understand what SmartFlow SOS is and how to register. CTA: register for SOS.

## Approach

Keep all existing React components and their visual design unchanged. Only update:
1. `frontend/src/i18n.js` — all text content (both `pt` and `en` locales)
2. `frontend/src/components/Nav.jsx` — fix broken i18n keys (`product`, `how`, `why`, `sos`, `cta` are used but missing from i18n)
3. `frontend/src/components/Sections.jsx` — Contact section gets dual CTA buttons; Compare section removes competitor name

---

## Section-by-Section Design

### Nav
**Keys to add:** `product`, `how`, `why`, `sos`, `cta`  
**Labels (PT):** `Produto | Como Funciona | Porquê | SOS | Contacto`  
**Labels (EN):** `Product | How It Works | Why | SOS | Contact`  
Nav `loginBt` key stays as-is.

### Hero
No changes — "Cada segundo salva uma vida." is the strongest copy on the page.

### Intro
No changes — the Pombal 2024 story creates immediate emotional urgency.

### Problem
Keep stats. Shorten card sub-labels to be punchier (1 line max each).

### Solution → SmartFlow Intersections
- **Eyebrow:** `SMARTFLOW · CRUZAMENTOS`
- **Title (PT):** `IA nos cruzamentos. A ambulância não para.`
- **Title (EN):** `AI at intersections. The ambulance never stops.`
- Points: shorten descriptions to 1–2 punchy sentences each.

### SmartFlow SOS
- **Eyebrow:** `SMARTFLOW SOS`
- **Title (PT):** `Um botão. Uma vida.`
- **Title (EN):** `One button. One life.`
- **Sub:** Shorten to 2 sentences max.
- Flow cards: keep structure, shorten body text.

### Time Saved
No changes — race track animation works perfectly.

### Market → "Por Que SmartFlow"
- **Eyebrow (PT):** `POR QUÊ NÓS` / **(EN):** `WHY SMARTFLOW`
- **Title (PT):** `Sem GPS. Sem app. Sem complicações.`
- **Title (EN):** `No GPS. No app. No complexity.`
- **Card 1:** `Plug & Play` — *"Instala num cruzamento. Funciona no mesmo dia."*
- **Card 2:** `Zero Integração` — *"Sem app, sem GPS, sem integração de frota. A câmara vê a ambulância."*
- **Card 3:** `Albufeira · 2026` — *"Piloto real. Município real. Resultados reais."*

### Roadmap → "Como Começar"
- **Eyebrow (PT):** `PARA MUNICÍPIOS` / **(EN):** `FOR MUNICIPALITIES`
- **Title (PT):** `Do interesse ao piloto em 4 passos.`
- **Title (EN):** `From interest to pilot in 4 steps.`
- **Steps (replace year-based steps):**
  1. Contacto → *Demo técnica personalizada*
  2. Avaliação → *Identificação dos cruzamentos prioritários*
  3. Piloto → *Instalação em 3 cruzamentos*
  4. Expansão → *Cobertura da rede completa*

### Compare → SmartFlow vs. Solução Tradicional
- Remove competitor name "Life Route" → replace with `"Solução Tradicional"` / `"Traditional System"`
- Keep all visual structure and bullet points.

### Pricing → Investimento
- **Eyebrow (PT):** `PARA MUNICÍPIOS` / **(EN):** `FOR MUNICIPALITIES`
- **Title (PT):** `€11.000 por cruzamento. ROI em meses.`
- **Title (EN):** `€11,000 per intersection. ROI in months.`
- Keep cost breakdown lines.
- Add footer note: *"Orçamento personalizado mediante contacto."* / *"Custom quote on request."*

### Team → A Nossa Missão
- **Eyebrow (PT):** `EQUIPA` / **(EN):** `TEAM`
- **Title (PT):** `Feitos para salvar tempo.`
- **Title (EN):** `Built to save time.`
- Keep member cards as-is.

### Contact — Dual CTA
- **Eyebrow:** `CONTACTO`
- **Title (PT):** `Pronto para salvar vidas?`
- **Title (EN):** `Ready to save lives?`
- **Sub (PT):** *"Municípios: agende uma demo. Cidadãos: registe-se no SOS."*
- **Sub (EN):** *"Municipalities: schedule a demo. Citizens: register for SOS."*
- **Primary CTA (PT):** `Agendar Demo →` → links to `mailto:`
- **Secondary CTA (PT):** `Registar no SOS →` → links to `/client/register`
- Both buttons visible side by side.

### Footer
- Change `footer_note` from `"Projeto académico · Smart Flow 2026"` to `"Smart Flow · 2026"` (drop "académico")

---

## Files to Change

| File | Change type |
|---|---|
| `frontend/src/i18n.js` | Full content rewrite of all `pt` and `en` keys |
| `frontend/src/components/Nav.jsx` | No structural change — i18n fix resolves it |
| `frontend/src/components/Sections.jsx` | Contact: add second CTA button; Compare: no code change needed (text from i18n) |

## Constraints

- All titles ≤ 6 words
- No competitor names in copy
- No EU investment figures
- No academic framing (remove "projeto académico")
- Both PT and EN locales updated in sync
