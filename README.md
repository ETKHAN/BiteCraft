# BiteCraft — Interactive Restaurant Ordering

BiteCraft is a fictional Pakistani-continental fusion kitchen and craft grill at F-7 Markaz (Jinnah Super), Islamabad. This React application demonstrates a complete local menu-to-order journey for university students, faculty, and young professionals.

## Business profile

- **Offering:** 12 menu items across Burgers & Wraps, Charcoal & Karahi, Sides & Starters, and Beverages.
- **Pickup:** F-7 Markaz, Islamabad.
- **Delivery coverage:** F-6, F-7, F-8, F-10, F-11, G-8, G-9, G-10, G-11, and H-11.
- **Order journey:** Browse, search, filter, sort, customize an item, manage a persistent cart, complete checkout, and review a simulated confirmation.

## Operating rules implemented

1. **Item availability:** Quantity must be an integer from 1 to 5 and cannot exceed current item stock. Sold-out items cannot be added. Cart restoration and checkout recheck availability.
2. **Delivery eligibility:** Delivery is limited to the ten supported sectors listed above. Self-pickup at F-7 Markaz is not sector-restricted.
3. **Delivery pricing:** Pickup has no minimum or fee. Delivery requires a PKR 1,000 food subtotal; fee is PKR 200 for PKR 1,000–2,499 and free from PKR 2,500.

The pure delivery pricing function is exported from `src/utils/orderRules.js` and tested with Node's built-in test runner.

## Features

- React Router routes: `/menu`, `/items/:id`, `/cart`, `/checkout`, and `/confirmation`.
- Live search across names, descriptions, categories, and dietary tags.
- Dataset-derived category counts, dietary filtering, and price/preparation sorting.
- Item customization, quantity caps, sold-out states, and shared cart state.
- Cart persistence in browser local storage with stock revalidation after restore or inventory changes.
- Controlled checkout form with field-specific validation and preservation of other entered fields.
- Live subtotal, delivery fee, minimum-order progress, and grand total.
- Asynchronous local menu loader with loading, failure, and retry states.
- Clearly labelled demo controls for loading failure and restocking the Nimbu Mint Cooler.
- Guided no-results, empty-cart, invalid-item URL, and confirmation states.
- Responsive authored CSS, semantic controls, labels, keyboard focus states, and reduced-motion support.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm (required by the installed Vite 8 toolchain).

```bash
npm install
npm run dev
```

## Verification commands

```bash
npm run lint
npm test
npm run build
```

The business-rule test covers PKR 999 (rejected), exactly PKR 1,000 (accepted with fee), exactly PKR 2,500 (free delivery), and pickup below the delivery minimum.

## Demo / edge-case checks

1. On the menu page, open **Demo controls · testing only** and enable **Simulate menu loading failure**. The page shows a clear error; disable the setting and use **Try again** to recover.
2. Enable **Restock Nimbu Mint Cooler (0 → 4)** to demonstrate availability changing from sold out to available. Cart quantities are revalidated against the current stock.
3. Search for a term such as `sushi`, then use **Reset search & filters**. Cart state is independent of the filtered menu.
4. Try delivery to E-7 or I-8 to see the unsupported-sector message; H-11 is a supported boundary sector.
5. Check delivery totals at PKR 999, PKR 1,000, and PKR 2,500. Pickup remains available for low-value baskets.

## Project structure

- `src/data/menuItems.js` — local menu dataset
- `src/services/menuService.js` — asynchronous mock menu loader
- `src/context/OrderContext.jsx` — shared cart state and local-storage persistence
- `src/utils/orderRules.js` — pure business-rule functions
- `src/components/` — shared layout and menu components
- `src/pages/` — menu, details, cart, checkout, and confirmation routes
- `tests/orderRules.test.js` — automated pricing-rule tests

## Scope and limitations

This is a frontend coursework prototype. Orders are simulated in the browser; no order is transmitted to a restaurant, no payment is processed, and checkout data is not sent to a server. The confirmation is held in navigation state for the current browser session. The menu uses local fictional stock and illustrative emoji artwork rather than live inventory or restaurant photography.
