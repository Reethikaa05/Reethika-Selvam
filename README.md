# Reethika-Selvam — EcomExperts Shopify Hiring Test

## 📦 Repository
[GitHub Repository](https://github.com/Reethikaa05/Reethika-Selvam)

## 🖼️ Banner
![Banner](https://via.placeholder.com/800x200/333333/FFFFFF?text=Banner)

## 🏪 Live Store
[View on Shopify](https://reethika-selvam-s-48-teststore.myshopify.com) ← Live store URL

## 📋 Assignment
Implement a Figma design as a Shopify page using custom sections from scratch.  
No jQuery. No ready-made Dawn sections. All built from scratch.

## ✅ What Was Built

### Figma Assignment (Part Five)
| Feature | Status |
|---------|--------|
| Banner section — all text editable from customizer | ✅ |
| Animated shimmer + lift on buttons | ✅ |
| Scrolling ticker strip at bottom | ✅ |
| 6-product grid selectable from customizer | ✅ |
| Pulsing dot indicator on each card | ✅ |
| Popup with name, price, description, variants | ✅ |
| Dynamic variant rendering from product JSON | ✅ |
| Add to Cart via Shopify AJAX API | ✅ |
| Auto-add "Soft Winter Jacket" on Black + Medium | ✅ |
| Mobile responsive | ✅ |
| Zero jQuery — vanilla JS only | ✅ |
| JSDoc comments on all functions | ✅ |

### Extra Pages Built
| Page | Template |
|------|----------|
| Homepage | `index.json` |
| Gift Guide (Figma) | `page.gift-guide.json` |
| About Us | `page.about.json` |
| Contact | `page.contact.json` |
| FAQ | `page.faq.json` |
| Size Guide | `page.size-guide.json` |
| Shipping & Returns | `page.shipping.json` |

## 🗂️ New Files Added
```
sections/
├── custom-banner.liquid        ← Gift Guide Banner (Figma)
├── custom-product-grid.liquid  ← Gift Guide Grid + Popup (Figma)
├── tv-homepage.liquid          ← Homepage
├── tv-about.liquid             ← About page
├── tv-contact.liquid           ← Contact page
├── tv-faq.liquid               ← FAQ page
├── tv-size-guide.liquid        ← Size guide
└── tv-shipping.liquid          ← Shipping & Returns

assets/
├── custom-page.css             ← Gift Guide styles
├── custom-page.js              ← Popup, variants, ATC, upsell
├── tisso-global.css            ← Global brand styles
└── tisso-site.js               ← Site-wide JS (FAQ, scroll reveal)

templates/
├── page.gift-guide.json
├── page.about.json
├── page.contact.json
├── page.faq.json
├── page.size-guide.json
└── page.shipping.json
```

## 🏗️ Architecture

This Shopify theme follows the **Online Store 2.0** architecture, leveraging modular components for maintainability and scalability. The structure emphasizes separation of concerns, with custom sections handling presentation logic and vanilla JavaScript managing interactivity.

### Core Principles
- **Modular Sections**: Each page section is a self-contained Liquid component with its own schema for customization
- **Vanilla JavaScript**: Pure ES6+ JavaScript with modern async/await patterns for API interactions
- **CSS Custom Properties**: Design tokens for consistent theming and easy customization
- **Performance-First**: Optimized asset loading, lazy loading, and efficient DOM manipulation

### Directory Structure
```
theme/
├── assets/           # Static files (JS, CSS, images)
├── config/           # Theme settings and presets
├── layout/           # Base templates and theme structure
├── locales/          # Translation files
├── sections/         # Reusable page sections
├── snippets/         # Liquid includes and partials
└── templates/        # Page templates and JSON configurations
```

### Key Components
- **Custom Sections**: Built from scratch using Liquid templating with schema-driven customization
- **AJAX Cart Integration**: Seamless add-to-cart functionality with real-time updates
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠️ Tech Stack
- **Shopify Liquid** (OS 2.0 architecture)
- **Vanilla JavaScript** — no jQuery
- **CSS Custom Properties** (design tokens)
- **Shopify AJAX Cart API**
- **Google Fonts** (Playfair Display + DM Sans)

## 🚀 Branch Structure
- `master` — connected to live Shopify store
- `development` — working branch (PR → master)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd theme_export__reethika-selvam-s-48-teststore-myshopify-com-tisso-vison-theme__09APR2026-1048am
   ```

2. **Install dependencies** (if any)
   ```bash
   # No external dependencies required - pure Shopify theme
   ```

3. **Upload to Shopify**
   - Zip the theme folder
   - Upload via Shopify Admin > Online Store > Themes
   - Or use Shopify CLI: `shopify theme push`

4. **Configure theme settings**
   - Access theme customizer
   - Set up product collections for the gift guide
   - Configure banner text and styling

## 🎯 Key Features

### Interactive Product Grid
- Dynamic variant selection with real-time price updates
- Modal popup with product details and add-to-cart functionality
- Automatic upsell logic for specific product combinations

### Performance Optimizations
- Lazy loading of images and assets
- Efficient DOM queries and event handling
- Minimal JavaScript bundle size

### Developer Experience
- JSDoc documentation for all JavaScript functions
- Modular CSS architecture with custom properties
- Clean, maintainable Liquid templates

---

*Built with ❤️ for EcomExperts Shopify Hiring Test*