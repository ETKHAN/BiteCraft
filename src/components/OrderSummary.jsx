import { formatPrice } from '../utils/formatPrice.js'

// Calculated summary of the cart. Pass `fee` (a number) to also show the delivery fee and total.
function OrderSummary({ lines, subtotal, fee }) {
  const validLines = lines.filter((line) => line.item)
  const itemCount = validLines.reduce((sum, line) => sum + line.quantity, 0)
  // The kitchen cooks items together, so the longest preparation time decides the wait.
  const prepMinutes = Math.max(0, ...validLines.map((line) => line.item.prepTime))

  return (
    <aside className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Order summary</h2>
      <dl>
        <div>
          <dt>Items</dt>
          <dd>{itemCount}</dd>
        </div>
        <div>
          <dt>Food subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {fee !== undefined && (
          <>
            <div>
              <dt>Delivery fee</dt>
              <dd>{fee === 0 ? 'Free' : formatPrice(fee)}</dd>
            </div>
            <div className="summary-total">
              <dt>Total</dt>
              <dd>{formatPrice(subtotal + fee)}</dd>
            </div>
          </>
        )}
        <div>
          <dt>Preparation time</dt>
          <dd>{prepMinutes} min</dd>
        </div>
      </dl>
    </aside>
  )
}

export default OrderSummary
