import { Link } from 'react-router-dom';

const money = (amount) => `PKR ${amount.toLocaleString('en-PK')}`;

export default function MenuCard({ item, onQuickAdd }) {
  const soldOut = item.stockCount < 1;
  return (
    <article className="menu-card">
      <div className="dish-art" aria-hidden="true"><span>{item.category === 'Beverages' ? '🥤' : item.category === 'Sides & Starters' ? '🍟' : item.category === 'Charcoal & Karahi' ? '🍢' : '🍔'}</span><i>{item.prepTime} min</i></div>
      <div className="menu-card-body">
        <div className="card-topline"><span className="category-label">{item.category}</span><span className={soldOut ? 'stock sold-out' : 'stock'}>{soldOut ? 'Sold Out' : `In stock · ${item.stockCount}`}</span></div>
        <h3><Link to={`/items/${item.id}`}>{item.name}</Link></h3>
        <p>{item.description}</p>
        <div className="tag-row">{item.dietaryTags.map((tag) => <span className="diet-tag" key={tag}>{tag}</span>)}</div>
        <div className="card-bottom"><strong>{money(item.price)}</strong><div className="card-actions"><Link className="text-link" to={`/items/${item.id}`}>Details</Link><button className="button button-small" disabled={soldOut} onClick={() => onQuickAdd(item)}>Quick add</button></div></div>
      </div>
    </article>
  );
}
