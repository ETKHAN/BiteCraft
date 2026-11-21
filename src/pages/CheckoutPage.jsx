import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/useOrder.js';
import { getDeliveryQuote, SUPPORTED_SECTORS, validateDeliverySector } from '../utils/orderRules.js';

const money = (amount) => `PKR ${amount.toLocaleString('en-PK')}`;
const initialForm = { name: '', phone: '', mode: 'pickup', sector: 'F-7', address: '', notes: '' };

export default function CheckoutPage({ items }) {
  const { lines, subtotal, clearCart } = useOrder();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const quote = useMemo(() => getDeliveryQuote(subtotal, form.mode), [subtotal, form.mode]);
  const sectorCheck = validateDeliverySector(form.mode, form.sector);
  const update = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); };
  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name (at least 2 characters).';
    if (!/^03\d{9}$/.test(form.phone.trim())) next.phone = 'Enter a valid 11-digit Pakistani mobile number (03XXXXXXXXX).';
    if (form.mode === 'delivery' && !sectorCheck.valid) next.sector = sectorCheck.message;
    if (form.mode === 'delivery' && form.address.trim().length < 8) next.address = 'Enter a complete delivery address (at least 8 characters).';
    if (!quote.valid) next.mode = `Delivery needs a food subtotal of PKR 1,000. Add ${money(quote.shortfall)} or switch to pickup.`;
    const stockConflict = lines.some((line) => { const item = items.find((entry) => entry.id === line.id); return !item || line.quantity > Math.min(5, item.stockCount); });
    if (stockConflict) next.stock = 'Your cart contains an unavailable quantity. Return to your order and correct it.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const order = {
      reference: `BC-${Date.now().toString().slice(-7)}`,
      placedAt: new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }),
      customer: { ...form },
      lines: lines.map((line) => ({ name: line.item.name, quantity: line.quantity, options: line.options, subtotal: line.subtotal })),
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal, deliveryFee: quote.deliveryFee, total: quote.grandTotal,
    };
    clearCart();
    navigate('/confirmation', { state: { order } });
  };
  if (!lines.length) return <div className="page-wrap state-panel"><h1>Nothing to check out yet.</h1><p>Add a dish before continuing.</p><Link className="button" to="/menu">Browse menu</Link></div>;
  return (
    <div className="page-wrap checkout-layout"><section><Link className="back-link" to="/cart">← Back to your order</Link><span className="eyebrow">ALMOST THERE</span><h1>Checkout</h1><p className="muted">This is a simulated order. No payment details are requested or collected.</p>
      <form className="checkout-form" onSubmit={submit} noValidate>
        <fieldset><legend>Contact details</legend><label>Full name<input value={form.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label><label>Mobile number<input value={form.phone} onChange={(event) => update('phone', event.target.value)} inputMode="tel" placeholder="03XXXXXXXXX" autoComplete="tel" aria-invalid={!!errors.phone} />{errors.phone && <small className="field-error">{errors.phone}</small>}</label></fieldset>
        <fieldset><legend>How would you like your order?</legend><div className="mode-options"><label className={form.mode === 'pickup' ? 'mode-option selected' : 'mode-option'}><input type="radio" name="mode" checked={form.mode === 'pickup'} onChange={() => update('mode', 'pickup')} /><span><strong>Self-pickup</strong><small>F-7 Markaz · Free</small></span></label><label className={form.mode === 'delivery' ? 'mode-option selected' : 'mode-option'}><input type="radio" name="mode" checked={form.mode === 'delivery'} onChange={() => update('mode', 'delivery')} /><span><strong>Local delivery</strong><small>Selected Islamabad sectors</small></span></label></div>
          <p className="rule-note">Delivery coverage: {SUPPORTED_SECTORS.join(', ')}. Delivery minimum PKR 1,000; PKR 200 fee, free from PKR 2,500.</p>
          {form.mode === 'delivery' && <><label>Delivery sector<select value={form.sector} onChange={(event) => update('sector', event.target.value)}><option value="">Choose your sector</option>{SUPPORTED_SECTORS.map((sector) => <option key={sector}>{sector}</option>)}<option value="E-7">E-7 (not covered · demo)</option><option value="I-8">I-8 (not covered · demo)</option></select>{errors.sector && <small className="field-error">{errors.sector}</small>}</label><label>Street address<input value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="House / building, street and sector" autoComplete="street-address" aria-invalid={!!errors.address} />{errors.address && <small className="field-error">{errors.address}</small>}</label></>}
        </fieldset>
        <fieldset><legend>Anything else?</legend><label>Kitchen notes <span className="muted">(optional)</span><textarea rows="3" maxLength="240" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Allergies, delivery instructions or preferences…" /></label></fieldset>
        {errors.mode && <p className="field-error" role="alert">{errors.mode}</p>}{errors.stock && <p className="field-error" role="alert">{errors.stock}</p>}
        <button className="button button-wide" type="submit">Confirm simulated order</button>
      </form>
    </section>
    <aside className="summary-card"><span className="eyebrow">YOUR TOTAL</span><h2>Order summary</h2>{lines.map((line) => <div className="summary-row" key={line.id + JSON.stringify(line.options)}><span>{line.quantity} × {line.item.name}</span><strong>{money(line.subtotal)}</strong></div>)}<div className="summary-row"><span>Food subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-row"><span>{form.mode === 'pickup' ? 'Pickup fee' : 'Delivery fee'}</span><strong>{form.mode === 'pickup' ? 'Free' : quote.deliveryFee === 0 ? 'Free' : money(quote.deliveryFee)}</strong></div>{form.mode === 'delivery' && <div className="delivery-progress">{!quote.valid ? <><strong>Add {money(quote.shortfall)} more</strong><span>to reach the PKR 1,000 delivery minimum.</span></> : quote.deliveryFee > 0 ? <><strong>Add {money(quote.freeDeliveryShortfall)} more</strong><span>for free delivery.</span></> : <strong>You’ve unlocked free delivery!</strong>}</div>}<div className="summary-total"><span>Grand total</span><strong>{money(quote.grandTotal)}</strong></div><p className="muted small">Payment is not collected. This prototype creates a local confirmation only.</p></aside></div>
  );
}
