# BiteCraft

BiteCraft is a fictional Pakistani-continental fusion kitchen based in F-7 Markaz (Jinnah Super), Islamabad. This React frontend assignment will support menu discovery and simulated pickup or local delivery ordering.

## Business profile

- **Audience:** University students, faculty members, and young professionals in Islamabad.
- **Operating area:** Self-pickup at F-7 Markaz; delivery to F-6, F-7, F-8, F-10, F-11, G-8, G-9, G-10, G-11, and H-11.
- **Customer task:** Browse dishes, search and filter the menu, inspect item details, manage a cart, and complete a validated simulated order.
- **Offering:** 12 local menu records in four categories, stored in `src/data/menuItems.js`.

## Local menu data

The menu dataset contains 12 distinct records across Burgers & Wraps, Charcoal & Karahi, Sides & Starters, and Beverages. Each record has a stable string ID, PKR price, preparation time, dietary tags, customization options, and a stock count. Stock values are fictional demo inventory.

## Operating rules

1. **Item quantity and stock:** A customer may order 1–5 units of an item, never exceeding its current stock. Sold-out items cannot be selected.
2. **Delivery eligibility:** Delivery is available only in F-6, F-7, F-8, F-10, F-11, G-8, G-9, G-10, G-11, and H-11. Self-pickup at F-7 Markaz is not restricted by sector.
3. **Minimum and delivery fee:** Pickup has no minimum and no fee. Delivery requires a PKR 1,000 food subtotal; the fee is PKR 200 for subtotals from PKR 1,000 to PKR 2,499, and free from PKR 2,500.

These are the agreed business rules. Their application logic and automated tests are **not implemented yet**.

## Current implementation status

This repository is at the implementation foundation milestone. The Vite demonstration screen and its sample assets have been removed. The BiteCraft application shell now imports and displays a summary of the local menu dataset.

The following assignment features remain to be implemented: meaningful routes, menu browsing, search, filtering and sorting, item details, shared cart state, persistence, checkout validation, business-rule enforcement, asynchronous mock loading and retry states, completion summary, and automated rule tests.

## Setup

Requirements: Node.js with npm.

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Project structure

- `src/data/menuItems.js` — local menu records
- `src/App.jsx` — application entry view
- `src/App.css` — application-level styles
- `src/index.css` — global styles and design tokens
- `src/main.jsx` — React entry point

## Notes

Orders and payments will be simulated in the frontend. Do not collect payment credentials or real personal information. The project is a coursework prototype, not a live restaurant ordering service.
