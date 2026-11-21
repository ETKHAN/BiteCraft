import { Link, useLocation, Navigate } from 'react-router-dom';

const money = (amount) => `PKR ${amount.toLocaleString('en-PK')}`;

export default function ConfirmationPage() {
  const { state } = useLocation();
  const order = state?.order;
  if (!order) return <Navigate to="/menu" replace />;
  return <div className="page-wrap confirmation-wrap"><div className="confirmation-card"><div className="success-mark" aria-hidden="true">✓</div><span className="eyebrow">ORDER RECEIVED · DEMO</span><h1>That’s a wrap.</h1><p className="muted">Your BiteCraft order has been recorded in this session. This is a coursework simulation, not a live restaurant order.</p><div className="order-reference"><span>Order reference</span><strong>{order.reference}</strong><small>{order.placedAt}</small></div><div className="confirmation-lines">{order.lines.map((line, index) => <div className="summary-row" key={index}><span>{line.quantity} × {line.name}</span><strong>{money(line.subtotal)}</strong></div>)}</div><div className="summary-row"><span>Food subtotal</span><strong>{money(order.subtotal)}</strong></div><div className="summary-row"><span>{order.customer.mode === 'pickup' ? 'Pickup' : 'Delivery'} fee</span><strong>{order.deliveryFee ? money(order.deliveryFee) : 'Free'}</strong></div><div className="summary-total"><span>Total</span><strong>{money(order.total)}</strong></div><div className="confirmation-fulfilment"><strong>{order.customer.mode === 'pickup' ? 'Self-pickup · F-7 Markaz' : `Delivery · ${order.customer.sector}`}</strong><span>{order.customer.name} · {order.customer.phone}</span>{order.customer.address && <span>{order.customer.address}</span>}</div><Link className="button button-wide" to="/menu">Back to the menu</Link></div></div>;
}
