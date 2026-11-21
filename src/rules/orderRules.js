import { formatPrice } from '../utils/formatPrice.js'

// Rule 1 (availability): at most 5 of one item, and never more than the stock.
export const MAX_QUANTITY = 5

// Rule 2 (eligibility): delivery only inside these sectors.
export const SERVED_SECTORS = ['F-6', 'F-7', 'F-8', 'F-10', 'F-11', 'G-8', 'G-9', 'G-10', 'G-11', 'H-11']

// Rule 3 (pricing): delivery minimum, delivery fee, and the subtotal where the fee is waived.
export const MIN_DELIVERY_SUBTOTAL = 1000
export const DELIVERY_FEE = 200
export const FREE_DELIVERY_SUBTOTAL = 2500

// Text shown wherever the delivery rules need to be explained to the customer.
export const DELIVERY_RULE_TEXT =
  `Delivery covers ${SERVED_SECTORS.join(', ')}. ` +
  `Minimum food subtotal ${formatPrice(MIN_DELIVERY_SUBTOTAL)}. ` +
  `Delivery fee ${formatPrice(DELIVERY_FEE)}, free from ${formatPrice(FREE_DELIVERY_SUBTOTAL)}. ` +
  'Pickup has no minimum and no fee.'

// Largest quantity of an item the customer may order right now.
export function getMaxQuantity(item) {
  return Math.min(MAX_QUANTITY, item.stockCount)
}

// Rule 1: checks a quantity against the stock and the per-item limit.
export function validateQuantity(quantity, stockCount) {
  if (stockCount <= 0) {
    return { valid: false, message: 'This item is sold out.' }
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { valid: false, message: 'Enter a whole number of at least 1.' }
  }
  if (quantity > stockCount) {
    return { valid: false, message: `Only ${stockCount} in stock.` }
  }
  if (quantity > MAX_QUANTITY) {
    return { valid: false, message: `You can order at most ${MAX_QUANTITY} of one item.` }
  }
  return { valid: true, message: '' }
}

// Rule 2: true when the sector is inside the delivery zone.
export function isSectorServed(sector) {
  return SERVED_SECTORS.includes(sector)
}

// Rule 3: works out whether the order may be delivered and what the delivery fee is.
export function getDeliveryCharge(subtotal, method) {
  if (method !== 'delivery') {
    return { allowed: true, fee: 0, message: '' }
  }
  if (subtotal < MIN_DELIVERY_SUBTOTAL) {
    const missing = MIN_DELIVERY_SUBTOTAL - subtotal
    return {
      allowed: false,
      fee: 0,
      message: `Delivery needs a food subtotal of at least ${formatPrice(MIN_DELIVERY_SUBTOTAL)}. Add ${formatPrice(missing)} more or choose pickup.`,
    }
  }
  if (subtotal >= FREE_DELIVERY_SUBTOTAL) {
    return { allowed: true, fee: 0, message: '' }
  }
  return { allowed: true, fee: DELIVERY_FEE, message: '' }
}

// Adds up price x quantity for every cart line whose item still exists.
export function calculateSubtotal(lines) {
  return lines.reduce((sum, line) => (line.item ? sum + line.item.price * line.quantity : sum), 0)
}

// Compares a saved or current cart line with today's menu data.
// Returns an explanation of the conflict, or an empty string when the line is fine.
export function getLineProblem(item, quantity, portion) {
  if (!item) {
    return 'This item is no longer on the menu.'
  }
  const check = validateQuantity(quantity, item.stockCount)
  if (!check.valid) {
    return check.message
  }
  if (!item.portions.includes(portion)) {
    return 'The selected portion is no longer offered.'
  }
  return ''
}

// Turns stock into a text label plus a tone used for styling.
export function getAvailability(item) {
  if (item.stockCount <= 0) {
    return { label: 'Sold out', tone: 'out' }
  }
  if (item.stockCount <= 3) {
    return { label: `Only ${item.stockCount} left`, tone: 'low' }
  }
  return { label: 'In stock', tone: 'ok' }
}
