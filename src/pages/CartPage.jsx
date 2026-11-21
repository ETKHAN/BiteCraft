import { Link } from 'react-router-dom';
import { useOrder } from '../context/useOrder.js';
import { validateItemQuantity } from '../utils/orderRules.js';

const money = (amount) => `PKR ${amount.toLocaleString('en-PK')}`;

export default function CartPage({ items }) {
  const { lines, subtotal, itemCount, updateQuantity, removeItem } = useOrder();
  if (!lines.length) return <div className="page-wrap state-panel cart-empty"><span className="empty-icon">🛍️</span><h1>Your order is waiting.</h1><p>Explore the menu and add something delicious.</p><Link className="button" to="/menu">Browse the menu</Link></div>;
  return (
    <div className="page-wrap checkout-layout"><section><span className="eyebrow">YOUR SELECTION</span><h1>Your order</h1><p className="muted">{itemCount} item{itemCount === 1 ? '' : 's'} in your bag. Your selections stay saved on this device.</p>
      <div className="cart-lines">{lines.map((line) => { const item = items.find((entry) => entry.id === line.id); const check = validateItemQuantity(line.quantity, item?.stockCount || 0); return <article className="cart-line" key={line.id + JSON.stringify(line.options)}><div className="cart-thumb">🍽️</div><div className="cart-line-info"><h3>{line.item.name}</h3><p>{Object.entries(line.options).flatMap(([key, value]) => Array.isArray(value) ? value : [value]).join(' · ') || 'Standard preparation'}</p><small>{money(line.item.price)} each · {item?.stockCount || 0} in stock</small>{!check.valid && <span className="field-error">{check.message}</span>}<button className="remove-link" onClick={() => removeItem(line.id, line.options)}>Remove</button></div><div className="cart-line-end"><strong>{money(line.subtotal)}</strong><div className="stepper compact"><button aria-label={`Decrease ${line.item.name}`} disabled={line.quantity <= 1} onClick={() => updateQuantity(line.id, line.options, line.quantity - 1)}>−</button><output>{line.quantity}</output><button aria-label={`Increase ${line.item.name}`} disabled={line.quantity >= Math.min(5, item?.stockCount || 0)} onClick={() => updateQuantity(line.id, line.options, line.quantity + 1)}>+</button></div></div></article>; })}</div>
    </section><aside className="summary-card"><span className="eyebrow">AT A GLANCE</span><h2>Order summary</h2><div className="summary-row"><span>Items ({itemCount})</span><strong>{money(subtotal)}</strong></div><div className="summary-row"><span>Fulfilment</span><strong>Calculated at checkout</strong></div><div className="summary-total"><span>Food subtotal</span><strong>{money(subtotal)}</strong></div><p className="muted small">Delivery has a PKR 1,000 minimum. Orders from PKR 2,500 qualify for free delivery. Pickup is always free.</p><Link className="button button-wide" to="/checkout">Continue to checkout</Link><Link className="text-link centered" to="/menu">Continue browsing</Link></aside></div>
  );
}
