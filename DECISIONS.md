# Frontend Design & Architecture Decisions (`DECISIONS.md`)

**Project:** BiteCraft — Interactive Restaurant Ordering Web Application  
**Course:** CS4032 — Web Programming (Assignment 02)  
**Student Name:** — Etizaz Ali
**ID:** — 24i-2118
**Section:** — BCY-5A
**Semester:** — Fall-2026

---

## Decision 1: Responsive Interactive Menu Cards vs. Downloadable PDF Menus

* **Problem:**  
  On **1969 Restaurant** (`https://1969restaurant.com/our-menu/`), the menu page replaces browsable web content with a static *"DOWNLOAD LATEST MENU MARCH 2026"* link pointing to a 24-page decorative PDF (`1969-Menu-August-2026.pdf`). Mobile users must download a large file, pinch-and-zoom across multi-column layouts, and scroll linearly without being able to select items or view live availability.
* **Decision:**  
  Render all menu records directly as responsive, semantic HTML `<article>` cards inside a mobile-first CSS Grid (`src/pages/MenuPage.jsx` and `src/components/MenuCard.jsx`) that reflows cleanly at both `390 px` and `1280 px` widths, exposing upfront pricing, dietary badges, stock status, and direct `"View Details"` / `"Quick Add"` actions.
* **Alternative:**  
  Embed an inline PDF viewer (`<iframe>` / `<embed>`) or render high-resolution menu images on the page.
* **Reason:**  
  Inline PDFs and images still prevent keyboard navigation, screen-reader accessibility, live search/filtering, and direct cart interaction. Responsive HTML cards ensure customers on phones can scan dishes, verify prices, and build an order without leaving the browser or zooming.
* **Tradeoff:**  
  Requires maintaining structured local menu records (`src/data/menuItems.js`) and writing responsive CSS layout rules rather than simply uploading a print designer's exported PDF.
* **Code Location:**  
  `src/pages/MenuPage.jsx` (`MenuPage` component), `src/components/MenuCard.jsx` (`MenuCard` component), and `src/styles/menu.css`.
* **Evidence:**  
  *(Attach final screenshot of BiteCraft MenuPage at `390 px` and `1280 px` widths showing responsive cards, pricing, and action buttons.)*  
  1. Navigate to `/menu` on a `390 px` mobile viewport and `1280 px` desktop viewport.  
  2. Observe that all dish titles, descriptions, PKR prices, and `"Add to Cart"` controls stack legibly without horizontal overflow or external downloads.

---

## Decision 2: Dynamic Data-Driven Category Counts & Multi-Faceted Filtering vs. Hardcoded Empty Categories

* **Problem:**  
  On **Angelo's Pizza** (`https://angelospizzaonline.com/category/menu/subs/`), the category filter sidebar displays 17 disabled categories locked at `(0)` (`Pizza (0)`, `Pasta (0)`, `Burgers (0)`, `Salads (0)`) while dumping all 28 items into `Subs (28)`. Furthermore, listing cards omit direct item-selection controls, forcing users into a disconnected ordering flow.
* **Decision:**  
  Compute category filter options and item counts dynamically from the active menu dataset (`src/data/menuItems.js`) using JavaScript array aggregation (`reduce` / `filter`), combined with dietary tag filtering and price/prep-time sorting (`src/components/FilterBar.jsx`), while linking every card to a parameterized details route (`/items/:id`).
* **Alternative:**  
  Hardcode static category links in the navigation bar or split each food category into separate server/route pages with fixed labels.
* **Reason:**  
  Deriving category counts directly from the underlying dataset guarantees that displayed counts never drift out of sync with actual inventory. Customers can immediately see how many dishes exist in each category and narrow results without hitting empty, disabled links.
* **Tradeoff:**  
  Increases client-side derived-state computation on filter changes and requires handling the edge case where an active category filter hides an item already present in the user's cart.
* **Code Location:**  
  `src/pages/MenuPage.jsx` (derived category counts & filtered list logic), `src/components/FilterBar.jsx` (`FilterBar` component), and `src/pages/ItemDetailsPage.jsx` (`/items/:id`).
* **Evidence:**  
  *(Attach final screenshot of BiteCraft FilterBar showing accurate live category counts alongside filtered cards.)*  
  1. Open `/menu` and inspect the category filter pills (`All (12)`, `Burgers & Wraps (3)`, `Charcoal & Karahi (3)`, `Sides & Starters (3)`, `Beverages (3)`).  
  2. Select a category and dietary filter; observe the displayed counts and matching cards update instantaneously.

---

## Decision 3: Live Controlled Search with Guided Empty-State Recovery & Persistent Cart State vs. Full-Reload Dead-End Search

* **Problem:**  
  On **1969 Restaurant** (`https://1969restaurant.com/?s=burger`), searching for `"burger"` triggers a full page reload and returns an unrelated blog post card (`"Our Menu"`, dated March 1, 2022) followed by a dead-end *"Didn't find what you are looking for? Search Again !!"* prompt—even though 5 burgers exist inside their downloadable PDF menu. There are no suggested items, active filter indicators, or reset actions.
* **Decision:**  
  Implement instant, controlled client-side search (`src/components/SearchBar.jsx`) that matches across dish names, descriptions, and dietary tags while preserving active cart selections in React state and `localStorage` (`src/context/OrderContext.jsx`). When search + filters yield zero matches, render a dedicated guided empty state (`src/components/EmptySearchState.jsx`) showing the active query, recommended popular dishes, a `"Hidden Selected Items"` notice if cart items are filtered out, and a one-click `"Reset Search & Filters"` button.
* **Alternative:**  
  Submit search queries via URL query-string navigation that resets filters and hides cart context on each search.
* **Reason:**  
  Customers searching by dish name or dietary preference (e.g., `"spicy"` or `"halal"`) get immediate feedback without losing their existing order progress. When no exact match exists, offering an instant reset and popular alternatives keeps users engaged instead of abandoning the site.
* **Tradeoff:**  
  Requires managing multi-condition filtering (`searchQuery` + `selectedCategory` + `dietaryFilter` + `sortBy`) in React state and keeping empty-search states distinct from asynchronous data-loading failure states (`FR14` vs. `FR15`).
* **Code Location:**  
  `src/components/SearchBar.jsx`, `src/components/EmptySearchState.jsx`, and `src/context/OrderContext.jsx` (shared cart & `localStorage` persistence).
* **Evidence:**  
  *(Attach final screenshot of BiteCraft empty search state showing active query feedback, preserved cart badge, and `"Reset Search & Filters"` button.)*  
  1. Add an item to the cart, then type a non-matching query (e.g., `"sushi"`) into the search bar.  
  2. Verify that the cart badge retains the selected item, a banner notes hidden selections, and clicking `"Reset Search & Filters"` immediately restores the full menu.