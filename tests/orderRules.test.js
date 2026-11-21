import test from 'node:test'
import assert from 'node:assert/strict'
import { getDeliveryQuote } from '../src/utils/orderRules.js'

// This is the same pure quote function used by CheckoutPage.
test('rejects delivery one rupee below the minimum', () => {
  const quote = getDeliveryQuote(999, 'delivery')
  assert.equal(quote.valid, false)
  assert.equal(quote.shortfall, 1)
})

test('accepts delivery at the exact minimum and applies the standard fee', () => {
  const quote = getDeliveryQuote(1000, 'delivery')
  assert.equal(quote.valid, true)
  assert.equal(quote.deliveryFee, 200)
  assert.equal(quote.grandTotal, 1200)
})

test('unlocks free delivery at the exact free-delivery threshold', () => {
  const quote = getDeliveryQuote(2500, 'delivery')
  assert.equal(quote.valid, true)
  assert.equal(quote.deliveryFee, 0)
  assert.equal(quote.grandTotal, 2500)
})

test('pickup has no minimum and no fulfilment fee', () => {
  const quote = getDeliveryQuote(350, 'pickup')
  assert.equal(quote.valid, true)
  assert.equal(quote.deliveryFee, 0)
  assert.equal(quote.grandTotal, 350)
})
