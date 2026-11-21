import test from 'node:test'
import assert from 'node:assert/strict'
import { validateQuantity, isSectorServed, getDeliveryCharge } from '../src/rules/orderRules.js'

test('accepts quantities within stock and the per-item cap', () => {
  assert.deepEqual(validateQuantity(2, 8), { valid: true, message: '' })
  assert.equal(validateQuantity(5, 8).valid, true)
})

test('rejects quantities above the per-item cap or available stock', () => {
  assert.equal(validateQuantity(6, 8).valid, false)
  assert.equal(validateQuantity(4, 3).valid, false)
  assert.equal(validateQuantity(1, 0).valid, false)
})

test('restricts delivery to the configured sectors', () => {
  assert.equal(isSectorServed('F-7'), true)
  assert.equal(isSectorServed('E-7'), false)
})

test('applies delivery minimum, fee, and free-delivery threshold boundaries', () => {
  assert.equal(getDeliveryCharge(999, 'delivery').allowed, false)
  assert.equal(getDeliveryCharge(1000, 'delivery').fee, 200)
  assert.equal(getDeliveryCharge(2499, 'delivery').fee, 200)
  assert.equal(getDeliveryCharge(2500, 'delivery').fee, 0)
  assert.equal(getDeliveryCharge(350, 'pickup').fee, 0)
})
