import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrder } from '../context/OrderContext.js';
import { validateItemQuantity } from '../utils/orderRules.js';

export default function ItemDetailsPage({ items }) {
  const { id } = useParams();
  const item = items.find((entry) => entry.id === id);
  const { addItem } = useOrder();
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState({});
  const [notice, setNotice] = useState('');
  if (!item) return <div className="page-wrap state-panel"><h1>Dish not found</h1><p>This menu link may be outdated or the item is unavailable.</p><Link className="button" to="/menu">Back to the menu</Link></div>;
  const optionGroups = Object.entries(item.options).filter(([, values]) => values.length);
  const availability = validateItemQuantity(quantity, item.stockCount);
  const changeOption = (key, value) => setOptions((current) => ({ ...current, [key]: value }));
  const money = (amount) => `PKR ${amount.toLocaleString('en-PK')}`;
  return (
    <div className="page-wrap detail-layout">
      <div className="detail-art"><span>{item.category === 'Beverages' ? '🥤' : item.category === 'Sides & Starters' ? '🍟' : item.category === 'Charcoal & Karahi' ? '🍢' : '🍔'}</span><small>{item.prepTime} MIN PREPARATION</small></div>
      <section className="detail-content"><Link className="back-link" to="/menu">← Back to menu</Link><span className="eyebrow">{item.category}</span><h1>{item.name}</h1><p className="detail-description">{item.description}</p><div className="detail-price">{money(item.price)}</div><p className={item.stockCount ? 'stock-line' : 'stock-line sold-out'}>{item.stockCount ? `In Stock (${item.stockCount} left) · Max 5 per order` : 'Sold Out · Not available to order'}</p>
        <div className="tag-row">{item.dietaryTags.map((tag) => <span className="diet-tag" key={tag}>{tag}</span>)}</div>
        {optionGroups.map(([key, values]) => <fieldset className="option-group" key={key}><legend>{key === 'spiceLevel' ? 'Spice level' : key === 'temperature' ? 'Temperature' : key === 'addOns' ? 'Add-ons' : key === 'portion' ? 'Portion' : key}</legend><div className="option-list">{values.map((value) => <label key={value}><input type={key === 'addOns' ? 'checkbox' : 'radio'} name={key} checked={key === 'addOns' ? (options[key] || []).includes(value) : (options[key] || values[0]) === value} onChange={() => changeOption(key, key === 'addOns' ? [...(options[key] || []).filter((entry) => entry !== value), ...((options[key] || []).includes(value) ? [] : [value])] : value)} />{value}</label>)}</div></fieldset>)}
        <div className="quantity-row"><div><strong>Quantity</strong><small>Limit: 1–5 units, subject to stock</small></div><div className="stepper"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)}>−</button><output aria-live="polite">{quantity}</output><button aria-label="Increase quantity" disabled={quantity >= Math.min(5, item.stockCount)} onClick={() => setQuantity((value) => value + 1)}>+</button></div></div>
        {!availability.valid && <p className="field-error" role="alert">{availability.message}</p>}{notice && <p className="notice" role="status">{notice}</p>}
        <button className="button button-wide" disabled={!availability.valid} onClick={() => setNotice(addItem(item, quantity, options).message)}>Add to order · {money(item.price * quantity)}</button>
      </section>
    </div>
  );
}
