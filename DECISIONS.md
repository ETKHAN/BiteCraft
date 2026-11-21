# Frontend Design & Architecture Decisions

**Project:** BiteCraft — Interactive Restaurant Ordering Web Application  
**Course:** CS4032 — Web Programming (Assignment 02)  
**Student:** Etizaz Ali  
**Student ID:** 24i-2118  
**Section:** BCY-5A  
**Semester:** Fall 2026

These decisions connect the three investigated reference-site problems to implemented behaviour in BiteCraft. The evidence notes below specify the screenshots and actions that must be included in the final report; do not describe a screenshot as attached until the actual image has been captured and added to the repository/report.

---

## Decision 1: Responsive Interactive Menu Cards vs. Downloadable PDF Menus

- **Problem:** On 1969 Restaurant (`https://1969restaurant.com/our-menu/`), the menu experience directs visitors to a downloadable PDF rather than keeping the menu as browsable, selectable web content. This makes scanning and comparing dishes less convenient on a narrow mobile viewport and separates menu discovery from ordering.
- **Observed task difficulty:** A customer trying to compare dishes and start an order must leave the normal page flow, open/download the document, and navigate its page layout instead of using responsive menu controls.
- **Possible business consequence:** Extra steps and poor mobile scanning may discourage customers from finding a suitable dish or continuing to order. This is a plausible consequence, not a measured sales result.
- **Decision:** Render the menu as responsive semantic HTML cards. Each card presents dish information and pricing with clear details and quick-add actions; the layout reflows for mobile and desktop.
- **Alternative:** Embed the PDF in an iframe or show menu pages as images.
- **Reason:** HTML cards remain part of the application, support responsive reading and keyboard interaction, and connect directly to details and cart actions.
- **Tradeoff:** The menu must be maintained as structured local records and styled with authored CSS instead of relying on a print-ready document.
- **Implemented code location:** `src/pages/MenuPage.jsx` (`MenuPage` and menu grid), `src/components/MenuCard.jsx` (`MenuCard`), `src/data/menuItems.js`, and `src/App.css`.
- **Evidence capture:** Save a reference screenshot of the 1969 Restaurant menu/PDF entry and BiteCraft menu screenshots at 390 px and 1280 px. Annotate the responsive card layout, upfront price/availability information, and direct actions.
- **Verification steps:**
  1. Open BiteCraft at 390 px and inspect dish title, price, tags, and actions.
  2. Repeat at 1280 px and confirm the grid adapts.
  3. Confirm no unintended page-wide horizontal overflow.
- **Expected/observed application behaviour:** The implementation renders the menu as interactive HTML cards and offers item details/quick-add actions without requiring a PDF download. Record the final browser observation and attach the screenshots before submission.

## Decision 2: Data-Driven Category Counts and Combined Filtering vs. Hardcoded Categories

- **Problem:** On Angelo's Pizza (`https://angelospizzaonline.com/category/menu/subs/`), the investigated category interface was observed to show multiple empty/disabled categories while concentrating the listed products in one category. Static or stale category counts make it harder for a customer to understand which options are available.
- **Observed task difficulty:** A customer trying to narrow the menu by category may encounter empty categories or category labels that do not help compare the available products.
- **Possible business consequence:** Customers may spend time opening irrelevant categories or abandon discovery before finding a suitable dish. This is a plausible consequence, not a measured sales result.
- **Decision:** Derive category choices and counts from the active menu dataset, and combine category selection with dietary filtering, search, and sorting.
- **Alternative:** Hardcode category links or create separate static pages for each menu category.
- **Reason:** Counts are computed from the same records used to render the menu, so they stay aligned with the local dataset. Combined filters let customers narrow choices without navigating away from the menu.
- **Tradeoff:** The page must coordinate several filter values and handle cases where an active filter hides a dish that remains selected in the cart.
- **Implemented code location:** `src/pages/MenuPage.jsx` (derived `categories`, `counts`, and `results`); `src/data/menuItems.js` (source records). The separate `src/components/FilterBar.jsx` is not the active menu filter implementation and is not cited as the live code location.
- **Evidence capture:** Save the reference category screenshot and a BiteCraft menu screenshot showing all live category counts. Capture a second state with a category and dietary filter applied together.
- **Verification steps:**
  1. Open `/menu` and note the category labels/counts.
  2. Select a category and a dietary tag.
  3. Confirm that the visible records and counts reflect the local dataset and active selection.
- **Expected/observed application behaviour:** Category options and counts are derived from the loaded menu records, and the results list responds to category, dietary, search, and sort state. Attach the final screenshots and record the observed counts from the deployed build.

## Decision 3: Controlled Search, Preserved Cart State, and Guided Empty-Result Recovery vs. Full-Reload Search

- **Problem:** On 1969 Restaurant (`https://1969restaurant.com/?s=burger`), the investigated search experience was observed to reload the page and return a result that did not directly help a customer select a matching menu item. The no-result prompt provided limited guidance for continuing.
- **Observed task difficulty:** A customer searching for a dish may lose the immediate menu context and receive no useful path to relevant alternatives when the result does not match the intended menu item.
- **Possible business consequence:** Unclear search recovery can interrupt ordering and increase the chance that a customer leaves without selecting an item. This is a plausible consequence, not a measured abandonment rate.
- **Decision:** Use controlled client-side search across dish names, descriptions, categories, and dietary tags. Keep cart state separate from visible filtered results, show a notice when selected dishes are hidden by filters, and provide a one-click reset when there are no matches.
- **Alternative:** Submit search through full-page navigation and reset the current filter/cart context.
- **Reason:** Immediate filtering gives clear feedback while preserving order progress. The hidden-selection notice prevents customers from assuming that a filtered-out dish has been removed from the cart.
- **Tradeoff:** Search, category, dietary, and sort state must be coordinated. No-match results must remain distinct from an empty dataset and asynchronous loading failure.
- **Implemented code location:** `src/pages/MenuPage.jsx` (controlled query, derived results, hidden-selection notice, and reset action); `src/context/OrderContext.jsx` (shared cart and localStorage persistence); `src/rules/orderRules.js` (cart quantity revalidation).
- **Evidence capture:** Save the reference search-results screenshot and a BiteCraft screenshot showing a non-matching query (for example, “sushi”), the no-results message, hidden-selected-item notice, and preserved cart count. Capture the reset result as a separate step if one image cannot show the behaviour.
- **Verification steps:**
  1. Add a dish to the cart.
  2. Search for a term that does not match, such as `sushi`.
  3. Confirm that the no-results state and hidden-selection notice appear while the cart count remains unchanged.
  4. Select **Reset search & filters** and confirm that the menu returns.
- **Expected/observed application behaviour:** Search is controlled in React state; the cart is maintained independently and persisted in localStorage. Attach final browser screenshots and record the observed cart count before and after filtering.

---

## Evidence completion checklist

- [ ] Reference screenshot for 1969 Restaurant menu page/PDF menu entry.
- [ ] BiteCraft menu at 390 px with a short annotation.
- [ ] BiteCraft menu at 1280 px with a short annotation.
- [ ] Reference screenshot for Angelo's Pizza category interface.
- [ ] BiteCraft category counts and combined-filter screenshot.
- [ ] Reference screenshot for 1969 Restaurant search results.
- [ ] BiteCraft no-results state with cart-preservation notice.
- [ ] BiteCraft reset-search result.
- [ ] Add the actual image filenames/links to the corresponding decision evidence sections and include them in the final PDF report.

**Evidence discipline:** Distinguish what was directly observed on a reference site from the possible business consequence inferred from that observation. Do not invent customer statistics, sales figures, or user-test results.
