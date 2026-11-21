# BiteCraft — Interactive Restaurant Ordering

**Course:** CS4032 — Web Programming (Assignment 02)  
**Student:** Etizaz Ali  
**Student ID:** 24i-2118  
**Section:** BCY-5A  
**Semester:** Fall 2026

## Project links

- **GitHub repository:** https://github.com/ETKHAN/BiteCraft
- **GitHub Pages target URL:** https://etkhan.github.io/BiteCraft/ (deployment must complete successfully before this is submitted as a verified live link).
- **Final submitted commit:** Record the full commit SHA after the final documentation, test, and deployment changes have been committed.

## Project overview

BiteCraft is a fictional Pakistani-continental fusion kitchen and craft grill located at F-7 Markaz (Jinnah Super), Islamabad. The React frontend demonstrates a complete local menu-to-order journey for university students, faculty members, and young professionals.

Customers can browse 12 dishes, search and filter the menu, open item details, customize an item, manage a cart, complete a validated pickup/delivery form, and view a simulated order confirmation.

## Business profile

- **Offering:** 12 menu items across Burgers & Wraps, Charcoal & Karahi, Sides & Starters, and Beverages.
- **Pickup point:** F-7 Markaz (Jinnah Super), Islamabad.
- **Delivery coverage:** F-6, F-7, F-8, F-10, F-11, G-8, G-9, G-10, G-11, and H-11.
- **Audience:** University students, faculty, and young professionals in Islamabad.
- **Business goal:** Convert menu visitors into valid simulated pickup or delivery orders with clear prices, availability, and fulfilment rules.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to the menu |
| `/menu` | Browse, search, filter, and sort dishes |
| `/items/:id` | View and customize a selected dish; invalid IDs show feedback |
| `/cart` | Review, update, and remove selected dishes |
| `/checkout` | Enter contact and fulfilment details; validate business rules |
| `/confirmation` | Review the final simulated order result |

Navigation uses React Router. Use the links inside the application or browser Back/Forward to move between routes.

## Features

- 12 stable local menu records with PKR prices, descriptions, dietary tags, preparation times, options, and fictional stock.
- Responsive menu cards and item detail pages.
- Controlled search across dish names, descriptions, categories, and dietary tags.
- Dataset-derived category counts, dietary filtering, and sorting.
- Item customization and stock-aware quantity limits.
- Shared cart state with browser local-storage persistence.
- Revalidation of restored cart lines against current menu stock.
- Controlled checkout form with field-specific validation.
- Delivery sector eligibility and minimum-order/tiered-fee enforcement.
- Calculated food subtotal, delivery fee, free-delivery progress, and grand total.
- Asynchronous local menu loading with loading, error, and retry states.
- Distinct empty-menu and no-search-results states.
- Clearly labelled demonstration controls for simulated loading failure and changed stock.
- Keyboard-friendly semantic controls, labels, visible focus styling, and responsive authored CSS.

## Operating rules

1. **Availability:** A customer may order 1–5 units of one menu item, subject to its current stock. Sold-out items cannot be added.
2. **Delivery eligibility:** Delivery is available only to F-6, F-7, F-8, F-10, F-11, G-8, G-9, G-10, G-11, and H-11. Self-pickup at F-7 Markaz is not restricted by sector.
3. **Delivery pricing:** Pickup has no minimum and no fee. Delivery requires a PKR 1,000 food subtotal. The delivery fee is PKR 200 from PKR 1,000 to PKR 2,499, and free from PKR 2,500.

## Deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. It runs lint, the Node test suite, and the Vite production build, then publishes `dist/` to GitHub Pages. The Vite base path and React Router basename are configured for the `/BiteCraft/` project-site path. After the first workflow run, open the repository's **Actions** tab and confirm that the **Deploy to GitHub Pages** workflow completes successfully. Then open `https://etkhan.github.io/BiteCraft/` and verify `/menu`, `/items/<valid-id>`, `/cart`, `/checkout`, and a direct nested-route refresh. If GitHub Pages asks for a publishing source, select **GitHub Actions** under Settings → Pages.

## Installation and development

**Requirements:** Node.js 20.19+ or 22.12+ and npm (Vite 8 toolchain).

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Build, lint, and test

```bash
npm run lint
npm test
npm run build
npm run preview
```

The automated pricing-rule test uses Node.js `node:test` and `node:assert/strict`. It imports `getDeliveryQuote()` from `src/utils/orderRules.js`, the same function used by the checkout page, and checks the delivery minimum and free-delivery boundary.

## Reproducing the edge cases

1. **Loading failure and retry:** Open **Demo controls · testing only** on the menu page, enable **Simulate menu loading failure**, observe the error state, disable the control, and use **Try again**.
2. **Changed availability:** Enable **Restock Nimbu Mint Cooler (0 → 4)** and observe the availability change. Existing cart quantities are reconciled with current stock.
3. **Search with no matches:** Add an item, search for `sushi`, confirm the no-results message and hidden-selection notice, then use **Reset search & filters**. The cart should remain intact.
4. **Delivery sector boundary:** Choose delivery to H-11 (supported) and then E-7 or I-8 (unsupported). Unsupported sectors must prevent confirmation and display a field-specific message.
5. **Delivery minimum:** Test a food subtotal of PKR 999 (rejected), PKR 1,000 (accepted with PKR 200 fee), and PKR 2,500 (accepted with free delivery).
6. **Pickup:** Select self-pickup with a subtotal below PKR 1,000. Pickup should remain valid with no fulfilment fee.
7. **Invalid item URL:** Open `/items/not-a-menu-id` and confirm that useful invalid-item feedback is displayed.
8. **Responsive layout:** Inspect the main journey at viewport widths of 390 px and 1280 px. Check for horizontal overflow and keyboard usability.

## Project structure and concept map

| Concept | File | Component/function |
| --- | --- | --- |
| Application routes | `src/App.jsx` | `BiteCraftApp`, `BrowserRouter`, route definitions |
| Menu records | `src/data/menuItems.js` | `menuItems` |
| Menu browsing and derived filters | `src/pages/MenuPage.jsx` | `MenuPage`, search/filter/sort derivation |
| Menu card | `src/components/MenuCard.jsx` | `MenuCard` |
| Shared cart state | `src/context/OrderContext.jsx` | `OrderProvider`, `addItem`, `updateQuantity`, `removeItem` |
| Cart context hook | `src/context/useOrder.js` | `useOrder` |
| Cart quantity/availability rules | `src/rules/orderRules.js` | `validateQuantity`, `getLineProblem` |
| Checkout rules and quote | `src/utils/orderRules.js` | `getDeliveryQuote`, `validateDeliverySector` |
| Checkout form | `src/pages/CheckoutPage.jsx` | `CheckoutPage`, controlled fields and validation |
| Async menu loading | `src/services/menuService.js` | `loadMenu` |
| Automated rule test | `tests/orderRules.test.js` | Node test cases for delivery pricing |

## Simulated operations and limitations

This is a frontend coursework prototype. Orders are simulated in the browser. No order is transmitted to a restaurant, no payment is processed, and no payment details are requested. Menu inventory is fictional local data, not live restaurant stock. The confirmation is carried in navigation state for the current browser session; it is not stored as a server-side order. The menu uses illustrative emoji artwork rather than live restaurant photography.

## Submission checklist

- [ ] Replace the pending deployment entry above with the verified public website URL.
- [ ] Verify the public site, assets, main journey, and direct nested-route refresh.
- [ ] Add annotated application screenshots and reference-site evidence to the PDF report.
- [ ] Record the final commit SHA in the report and submission details.
- [ ] Create the source ZIP with source, assets, tests, dependency files, lockfile, README, and DECISIONS; exclude `node_modules`, build output, and secrets.
