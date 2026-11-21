import { getDeliveryCharge, isSectorServed } from './orderRules.js'

// Checks the checkout form and returns an object of error messages keyed by field name.
// An empty object means the form is valid.
export function validateCheckout(form, subtotal) {
  const errors = {}

  if (form.name.trim().length < 2) {
    errors.name = 'Enter a name with at least 2 characters.'
  }

  // Remove spaces and dashes, then expect a Pakistani mobile number such as 03001234567.
  const phoneDigits = form.phone.replace(/\D/g, '')
  if (!/^03\d{9}$/.test(phoneDigits)) {
    errors.phone = 'Enter a mobile number like 0300 1234567.'
  }

  // Delivery-only checks. Pickup orders skip them.
  if (form.method === 'delivery') {
    if (!form.sector) {
      errors.sector = 'Choose a delivery sector.'
    } else if (!isSectorServed(form.sector)) {
      errors.sector = `We do not deliver to ${form.sector} yet. Choose a covered sector or switch to pickup.`
    }

    if (form.address.trim().length < 10) {
      errors.address = 'Enter a full delivery address (at least 10 characters).'
    }

    const charge = getDeliveryCharge(subtotal, form.method)
    if (!charge.allowed) {
      errors.delivery = charge.message
    }
  }

  return errors
}
