# Frontend Design & Architecture Decisions

**Project:** BiteCraft — Interactive Restaurant Ordering Web Application  
**Course:** CS4032 — Web Programming (Assignment 02)  
**Student:** Etizaz Ali  
**Student ID:** 24i-2118  
**Section:** BCY-5A  
**Semester:** Fall 2026

> **Implementation status:** These are the three selected frontend decisions. The repository is currently at the foundation milestone; proposed component locations below are targets, not claims that those components already exist. Replace the pending evidence notes with screenshots and observed results after implementation.

---

## Decision 1: Responsive Interactive Menu Cards vs. Downloadable PDF Menus

- **Problem:** On 1969 Restaurant (`https://1969restaurant.com/our-menu/`), the menu page directs visitors to a static downloadable PDF. On mobile, customers must download and zoom a long document rather than browse selectable menu content.
- **Decision:** Render menu records as responsive semantic HTML cards with upfront PKR prices, dietary tags, availability, and clear details/selection actions.
- **Alternative:** Embed a PDF viewer or display menu pages as images.
- **Reason:** Structured HTML supports responsive layouts, keyboard and screen-reader access, and future search/filter/cart interactions.
- **Tradeoff:** Requires maintaining structured local records and authored responsive CSS.
- **Planned code location:** `src/pages/MenuPage.jsx`, `src/components/MenuCard.jsx`, and `src/styles/menu.css`.
- **Evidence:** Pending implementation. Capture the menu at 390 px and 1280 px and verify readable content without horizontal overflow.

## Decision 2: Data-Driven Category Counts and Filtering vs. Hardcoded Categories

- **Problem:** On Angelo's Pizza (`https://angelospizzaonline.com/category/menu/subs/`), the cited category navigation includes empty categories while concentrating products in one category. Static category links can mislead customers when counts do not reflect available records.
- **Decision:** Derive category options and counts from the local menu dataset; combine category and dietary filters with a sorting control.
- **Alternative:** Hardcode category links or create separate fixed pages for each category.
- **Reason:** Derived counts stay aligned with the dataset and help customers narrow the menu without selecting empty categories.
- **Tradeoff:** Requires derived filtering logic and clear handling when a filter hides an item already in the cart.
- **Planned code location:** `src/pages/MenuPage.jsx`, `src/components/FilterBar.jsx`, and `src/pages/ItemDetailsPage.jsx`.
- **Evidence:** Pending implementation. Capture category counts and a combined category/dietary filter state.

## Decision 3: Controlled Search and Guided Empty-State Recovery vs. Full-Reload Search

- **Problem:** The investigated 1969 Restaurant search experience (`https://1969restaurant.com/?s=burger`) was observed to reload the page and provide weak recovery when results do not match the intended menu items.
- **Decision:** Use controlled client-side search across relevant menu fields. Preserve cart selections independently of the visible filtered list, and provide a clear reset action when no results match.
- **Alternative:** Submit search through full-page navigation and reset the current browsing state.
- **Reason:** Immediate results keep browsing responsive, while independent cart state prevents search/filter changes from discarding order progress.
- **Tradeoff:** Requires coordinated search/filter state and distinct no-match, empty-data, and loading-error states.
- **Planned code location:** `src/components/SearchBar.jsx`, `src/components/EmptySearchState.jsx`, and `src/context/OrderContext.jsx`.
- **Evidence:** Pending implementation. Add an item, search for a non-matching term such as “sushi”, verify the cart remains intact, then capture the reset action.
