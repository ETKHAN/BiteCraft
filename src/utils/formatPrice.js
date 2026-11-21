// Formats a number as a PKR price, e.g. 1250 -> "PKR 1,250".
export function formatPrice(amount) {
  return `PKR ${amount.toLocaleString('en-US')}`
}
