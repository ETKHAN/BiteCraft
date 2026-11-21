import test from 'node:test';
import assert from 'node:assert/strict';
import { getDeliveryQuote } from '../src/utils/orderRules.js';

test('delivery subtotal below minimum is rejected with exact shortfall', () => {
  const quote = getDeliveryQuote(999, 'delivery');
  assert.equal(quote.valid, false);
  assert.equal(quote.shortfall, 1);
  assert.equal(quote.deliveryFee, 200);
});

test('delivery subtotal exactly at PKR 1,000 minimum is accepted with PKR 200 fee', () => {
  const quote = getDeliveryQuote(1000, 'delivery');
  assert.equal(quote.valid, true);
  assert.equal(quote.deliveryFee, 200);
  assert.equal(quote.grandTotal, 1200);
});

test('delivery subtotal exactly at PKR 2,500 earns free delivery', () => {
  const quote = getDeliveryQuote(2500, 'delivery');
  assert.equal(quote.valid, true);
  assert.equal(quote.deliveryFee, 0);
  assert.equal(quote.grandTotal, 2500);
});

test('self-pickup has no minimum and no fulfilment fee', () => {
  const quote = getDeliveryQuote(350, 'pickup');
  assert.equal(quote.valid, true);
  assert.equal(quote.deliveryFee, 0);
  assert.equal(quote.grandTotal, 350);
});
