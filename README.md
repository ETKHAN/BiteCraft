# Task 2: Fictional Business Definition & Operating Rules

## 2.1 Business Profile — BiteCraft

| Element | Required Detail | 
| ----- | ----- | 
| **Business Identity** | **BiteCraft** — A contemporary Pakistani-continental fusion kitchen and craft grill serving flame-grilled burgers, charcoal karahi & BBQ platters, artisan sides, and house beverages. | 
| **Primary Audience** | University students, faculty members, and young professionals in Islamabad looking for fast, transparent online ordering for self-pickup or local sector delivery. | 
| **Operating Area** | **Islamabad Capital Territory (ICT)** — Kitchen and self-pickup counter located at **F-7 Markaz (Jinnah Super), Islamabad**, with active delivery coverage restricted to central sectors: **F-6, F-7, F-8, F-10, F-11, G-8, G-9, G-10, G-11, and H-11**. | 
| **Main Customer Task** | Browse a responsive interactive menu (`390 px` and `1280 px`), search and filter dishes by category and dietary tags, customize spice/portion options on an item details view (`/items/:id`), manage a persistent cart, and complete a validated pickup/delivery checkout form. | 
| **Business Goal** | Convert online menu visitors into confirmed, valid pickup or delivery orders by providing upfront pricing, live stock availability, transparent delivery rules, and an itemized order confirmation summary. | 
| **Offering** | **12 distinct menu records** organized across **4 active categories** (*Burgers & Wraps*, *Charcoal & Karahi*, *Sides & Starters*, *Beverages*) stored in `src/data/menuItems.js`. Each record includes a stable ID, PKR price, preparation time, dietary tags (`Halal`, `Spicy`, `Vegetarian`), customizable options, and live `stockCount`. | 

## 2.2 Three Operating Rules

### Rule 1: Availability / Capacity — *Per-Item Stock Limit & Maximum Order Quantity Cap*

* **Exact Condition:**

  A customer may order between **1 and 5 units** of any single menu item per order, and never more than the item's available `stockCount` (i.e., `1 <= quantity <= Math.min(5, stockCount)`). Items with `stockCount === 0` are marked **Sold Out** and cannot be added to the cart.

* **Where the User Is Told:**

  * Displayed via an availability badge on every menu card and on the `/items/:id` details page (e.g., *"In Stock (4 left) • Max 5 per order"* or *"Sold Out"*).

  * Shown directly beside the `- / +` quantity stepper controls on `/items/:id` and in the `/checkout` order summary.

* **Application Behavior (When Met vs. Broken):**

  * **Condition Met (`1 <= qty <= Math.min(5, stockCount)`):** Adds or updates the item in shared cart state and recalculates item subtotals and total item count.

  * **Condition Broken (`qty > 5`, `qty > stockCount`, or `stockCount === 0`):** Disables the `+` increment button and `"Add to Cart"` button, blocks order confirmation if a restored `localStorage` cart conflicts with updated stock, and displays a specific inline message (e.g., *"Maximum 5 units allowed per item"* or *"Only 2 units currently in stock"*).

* **Boundary Case & Expected Result:**

  * **Boundary Case:** A dish has `stockCount = 8`, and the customer selects **5 units** (exact limit) versus attempting to increment to **6 units** (one above limit).

  * **Expected Result:** Quantity **5** is accepted and added to the cart; attempting to select **6** is blocked by the UI and rule validator with the message *"Maximum 5 units allowed per item."*

### Rule 2: Eligibility / Compatibility — *Fulfilment Mode & Islamabad Delivery Sector Restriction*

* **Exact Condition:**

  When **Delivery** is selected as the fulfilment method, the customer's selected sector **must** be within BiteCraft's supported Islamabad delivery zone: `["F-6", "F-7", "F-8", "F-10", "F-11", "G-8", "G-9", "G-10", "G-11", "H-11"]`. When **Self-Pickup (F-7 Markaz)** is selected, sector restrictions do not apply.

* **Where the User Is Told:**

  * Stated in the header service notice (*"Delivering to F & G Sectors + H-11 | Free Self-Pickup at F-7 Markaz"*).

  * Displayed directly above the Fulfilment Method and Sector selector inside the `/checkout` form.

* **Application Behavior (When Met vs. Broken):**

  * **Condition Met (`mode === "pickup"` or `SUPPORTED_SECTORS.includes(sector)`):** Validates the fulfilment selection, enables the `"Confirm Order"` button (assuming other rules pass), and applies the applicable delivery fee.

  * **Condition Broken (`mode === "delivery"` and an unsupported sector such as `"E-7"`, `"I-8"`, or `"DHA Phase 2"` is selected):** Highlights the sector input in an error state, prevents form submission, preserves all other valid customer inputs (name, phone, notes), and displays: *"Delivery is unavailable for \[Sector\]. Please select a covered Islamabad sector or switch to Self-Pickup."*

* **Boundary Case & Expected Result:**

  * **Boundary Case:** Customer chooses **Delivery** and selects **`H-11`** (edge of covered zone) versus **`I-8`** (adjacent uncovered sector).

  * **Expected Result:** **`H-11`** passes eligibility validation and allows checkout; **`I-8`** fails validation, blocks order confirmation, and prompts switching to a covered sector or Self-Pickup.

### Rule 3: Pricing / Fulfilment — *Minimum Delivery Order Threshold & Tiered Delivery Fee*

*(Note: This rule is implemented as a standalone exported pure function in `src/utils/orderRules.js` and verified using `node:test` and `node:assert/strict` for Task 6.2.)*

* **Exact Condition:**

  * **Self-Pickup:** No minimum order subtotal (`PKR 0` fulfilment fee).

  * **Delivery:** Requires a minimum food subtotal of **PKR 1,000**. Delivery orders with a subtotal from **PKR 1,000 to PKR 2,499** incur a **PKR 200** delivery fee; delivery orders with a subtotal of **PKR 2,500 or more** qualify for **Free Delivery (`PKR 0`)**.

* **Where the User Is Told:**

  * Displayed in the live **Order Summary** panel (`Food Subtotal`, `Delivery Fee`, `Grand Total`) alongside a dynamic status bar (e.g., *"Add PKR 350 more to reach the PKR 1,000 delivery minimum"* or *"Add PKR 600 more for Free Delivery"*).

* **Application Behavior (When Met vs. Broken):**

  * **Condition Met (`mode === "pickup"` or `subtotal >= 1000`):** Calculates `deliveryFee` (`0` or `200`), computes `grandTotal = subtotal + deliveryFee`, and permits order confirmation.

  * **Condition Broken (`mode === "delivery"` and `subtotal < 1000`):** Blocks order confirmation, displays an inline warning specifying the exact shortfall (`1000 - subtotal`), and provides a quick toggle to switch to **Self-Pickup**.

* **Boundary Case & Expected Result:**

  * **Boundary Case:** Delivery order evaluated at subtotals of **PKR 999** (1 PKR below minimum), **PKR 1,000** (exact delivery minimum), and **PKR 2,500** (exact free-delivery threshold).

  * **Expected Result:**

    * **PKR 999:** Rejected (`valid: false`, shortfall = `PKR 1`), checkout blocked.

    * **PKR 1,000:** Accepted (`valid: true`, `deliveryFee = PKR 200`, `grandTotal = PKR 1,200`).

    * **PKR 2,500:** Accepted (`valid: true`, `deliveryFee = PKR 0`, `grandTotal = PKR 2,500`).