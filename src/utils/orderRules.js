export const MAX_ITEM_QUANTITY = 5;
export const MIN_DELIVERY_SUBTOTAL = 1000;
export const FREE_DELIVERY_THRESHOLD = 2500;
export const DELIVERY_FEE = 200;

export const SUPPORTED_SECTORS = [
  'F-6', 'F-7', 'F-8', 'F-10', 'F-11',
  'G-8', 'G-9', 'G-10', 'G-11', 'H-11',
];

export function validateItemQuantity(quantity, stockCount) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { valid: false, message: 'Choose at least 1 unit.' };
  }
  if (stockCount <= 0) {
    return { valid: false, message: 'This item is sold out.' };
  }
  if (quantity > MAX_ITEM_QUANTITY) {
    return { valid: false, message: 'Maximum 5 units allowed per item.' };
  }
  if (quantity > stockCount) {
    return { valid: false, message: `Only ${stockCount} units currently in stock.` };
  }
  return { valid: true, message: '' };
}

export function getDeliveryQuote(subtotal, mode = 'delivery') {
  if (mode === 'pickup') {
    return { valid: true, deliveryFee: 0, grandTotal: subtotal, shortfall: 0, freeDeliveryShortfall: 0 };
  }
  if (subtotal < MIN_DELIVERY_SUBTOTAL) {
    return {
      valid: false, deliveryFee: DELIVERY_FEE, grandTotal: subtotal + DELIVERY_FEE,
      shortfall: MIN_DELIVERY_SUBTOTAL - subtotal, freeDeliveryShortfall: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
    };
  }
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return {
    valid: true, deliveryFee, grandTotal: subtotal + deliveryFee, shortfall: 0,
    freeDeliveryShortfall: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
  };
}

export function validateDeliverySector(mode, sector) {
  if (mode === 'pickup') return { valid: true, message: '' };
  if (SUPPORTED_SECTORS.includes(sector)) return { valid: true, message: '' };
  return {
    valid: false,
    message: `Delivery is unavailable for ${sector || 'this sector'}. Please select a covered Islamabad sector or switch to Self-Pickup.`,
  };
}
