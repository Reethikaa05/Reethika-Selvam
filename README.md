<div align="center">

# ✨ Tisso Vision Theme ✨
**EcomExperts Shopify Developer Assessment by Reethika Selvam**

![Banner](https://via.placeholder.com/800x200/1a1a1a/ffffff?text=Tisso+Vision+Theme+Project)

[![View Live Store](https://img.shields.io/badge/Shopify-Live_Store-96bf48?style=for-the-badge&logo=shopify)](https://reethika-selvam-s-48-teststore.myshopify.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Reethikaa05/Reethika-Selvam)

*A premium, high-fidelity Shopify implementation of a custom Figma design built completely from scratch using Modern Web Standards and Online Store 2.0 Architecture.*

</div>

---

## 📋 The Mission

The core assignment was to translate a provided **Figma design** into a functional Shopify page relying exclusively on **custom sections**. 

> **Strict Constraints:**  
> 🚫 No jQuery  
> 🚫 No ready-made Dawn sections  
> ✅ 100% Built from scratch with Vanilla JS & Modular CSS

---

## 🚀 Impact & Deliverables

### 🎨 The Figma Implementation (Part Five)
A highly interactive, conversion-focused Gift Guide experience.

| Feature Implementation | Status |
| :--- | :---: |
| **Dynamic Banner** — All text fully editable via Shopify Customizer | ✅ |
| **Micro-Interactions** — Animated shimmer + lift effects on primary buttons | ✅ |
| **Scrolling Ticker** — Continuous marquee strip injected at the bottom | ✅ |
| **Customizer-Driven Grid** — 6-product grid selectable dynamically | ✅ |
| **Visual Cues** — Pulsing dot indicator on each product card | ✅ |
| **Quick View Modal** — Popup surfacing name, price, descriptions, and variants | ✅ |
| **Dynamic Rendering** — Variant DOM updates fed by product JSON | ✅ |
| **AJAX Integration** — Seamless Add to Cart via Shopify AJAX API | ✅ |
| **Smart Upsell** — Auto-add logic ("Soft Winter Jacket" on Black + Medium) | ✅ |
| **Responsive Engineering** — Flawless Mobile-first design | ✅ |
| **Modern JS** — Zero jQuery, strict vanilla ES6+ | ✅ |
| **Developer Ergonomics** — Comprehensive JSDoc comments validating all logic | ✅ |

### 📄 Brand Pages Expansion
Beyond the core assignment, a full suite of brand pages was developed to complete the theme environment.

| Page Template | File Name |
| :--- | :--- |
| **Homepage** | `index.json` |
| **Gift Guide** (Figma Task) | `page.gift-guide.json` |
| **About Us** | `page.about.json` |
| **Contact** | `page.contact.json` |
| **FAQ** | `page.faq.json` |
| **Size Guide** | `page.size-guide.json` |
| **Shipping & Returns** | `page.shipping.json` |

---

## 🏗️ Technical Architecture

This Shopify theme leverages the **Online Store 2.0** architecture, heavily prioritizing modular component design, maintainability, and enterprise-level scalability. 

<details>
<summary><b>📂 Explore Directory Structure</b></summary>
<br>

The theme structure respects Shopify OS 2.0 paradigms with absolute separation of concerns.

```text
theme/
├── assets/           # Static files, CSS Custom Properties, Vanilla JS
├── config/           # Theme settings and global presets
├── layout/           # Base templates and structural containers
├── locales/          # Translation files
├── sections/         # Reusable, schema-driven page sections
├── snippets/         # Liquid includes and partials
└── templates/        # Page templates and JSON configurations
```
</details>

<details>
<summary><b>🛠️ New Files Manifest</b></summary>
<br>

**1. Modular Sections (`sections/`)**
* `custom-banner.liquid` — Gift Guide Banner (Figma Task)
* `custom-product-grid.liquid` — Gift Guide Grid + Popup (Figma Task)
* `tv-homepage.liquid` — Homepage Layout
* `tv-about.liquid`, `tv-contact.liquid`, `tv-faq.liquid`, `tv-size-guide.liquid`, `tv-shipping.liquid`

**2. Styles & Scripts (`assets/`)**
* `custom-page.css`, `custom-page.js` — Scoped logic for Gift Guide (Popup, variants, ATC, upsell)
* `tisso-global.css`, `tisso-site.js` — Global brand UI and Site-wide behaviors (FAQ accordion, scroll reveals)

**3. OS 2.0 Templates (`templates/`)**
* `page.gift-guide.json`, `page.about.json`, `page.contact.json`, `page.faq.json`, `page.size-guide.json`, `page.shipping.json`
</details>

### 💎 Core Engineering Principles
1. **Modular Sections:** Self-contained Liquid components leveraging JSON schemas for deep customizer integration.
2. **Vanilla JavaScript:** Pure ES6+ paradigms leaning heavily into modern async/await patterns for responsive API interactions.
3. **Design Tokens:** Extensive use of CSS Custom Properties mapped to global settings for rapid theming.
4. **Performance-First:** Optimized asset loading pathways, lazy loading primitives, and ultra-efficient DOM parsing.
5. **Accessibility:** Native ARIA labels integration, logical keyboard navigation flows.

---

## ⚙️ Tech Stack & Tooling
*   **Shopify Liquid** (OS 2.0 Native)
*   **Vanilla JavaScript** (No Library Dependencies)
*   **CSS Custom Properties** (Variables Network)
*   **Shopify AJAX Cart API**
*   **Google Fonts** (Playfair Display, DM Sans)
*   **Git Workflow** (`development` → `master` PR strategy)

---

## 💻 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Reethikaa05/Reethika-Selvam.git
   ```

2. **Upload to Shopify**
   * Package the theme folder into a `.zip` archive.
   * Upload via **Shopify Admin > Online Store > Themes > Add Theme > Upload zip file**.
   * *Alternatively*, utilize Shopify CLI: `shopify theme push`.

3. **Configure Environment**
   * Jump into the Shopify Theme Customizer.
   * Populate product collections to feed the Gift Guide.
   * Adjust banner typography, block settings, and styling utilizing the built-in UI options.

---
<div align="center">
  <p><i>Design engineered with ❤️ and rigorous standards for EcomExperts.</i></p>
</div>