import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuCard from '../components/MenuCard.jsx';
import { useOrder } from '../context/OrderContext.js';
import { SUPPORTED_SECTORS } from '../utils/orderRules.js';

export default function MenuPage({ items, loading, error, onRetry, onFailureDemo, onRestockDemo, failureDemo, restockDemo }) {
  const { addItem, itemCount, lines } = useOrder();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [diet, setDiet] = useState('All');
  const [sort, setSort] = useState('featured');
  const [notice, setNotice] = useState('');
  const categories = useMemo(() => ['All', ...new Set(items.map((item) => item.category))], [items]);
  const counts = useMemo(() => Object.fromEntries(categories.map((name) => [name, name === 'All' ? items.length : items.filter((item) => item.category === name).length])), [categories, items]);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const matchesText = !term || [item.name, item.description, item.category, ...item.dietaryTags].join(' ').toLowerCase().includes(term);
      return matchesText && (category === 'All' || item.category === category) && (diet === 'All' || item.dietaryTags.includes(diet));
    });
    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'prep') filtered.sort((a, b) => a.prepTime - b.prepTime);
    return filtered;
  }, [items, query, category, diet, sort]);
  const hiddenSelected = lines.filter((line) => !results.some((result) => result.id === line.id));
  const quickAdd = (item) => {
    const result = addItem(item);
    setNotice(result.message);
  };

  return (
    <div className="page-wrap">
      <section className="hero-panel">
        <div className="hero-copy"><span className="eyebrow">THE BITECRAFT KITCHEN · ISLAMABAD</span><h1>Big flavour.<br/><em>Zero fuss.</em></h1><p>Flame-grilled favourites, charcoal classics and fresh-made sides. Find your next favourite, then make it yours.</p><a className="button" href="#menu-list">Explore the menu <span aria-hidden="true">↓</span></a></div>
        <div className="hero-plate" aria-label="Illustration of a grilled burger"><div className="plate-ring"><span>🍔</span><b>MADE<br/>FRESH</b></div><small>FIRE-KISSED · MADE TO ORDER</small></div>
        <div className="hero-stamp">FRESH<br/>NOT FAST<br/><strong>FOOD</strong></div>
      </section>
      <section className="service-row" aria-label="Service information"><div><span>01</span><strong>Pickup</strong><small>F-7 Markaz · No fee</small></div><div><span>02</span><strong>Local delivery</strong><small>10 covered sectors</small></div><div><span>03</span><strong>Free delivery</strong><small>On orders PKR 2,500+</small></div></section>
      <section className="menu-section" id="menu-list">
        <div className="section-heading"><div><span className="eyebrow">FIND YOUR CRAVING</span><h2>The menu</h2><p>Good things, made fresh and priced upfront.</p></div><Link className="button button-outline" to="/cart">View order ({itemCount})</Link></div>
        <div className="filter-panel">
          <label className="search-field"><span className="sr-only">Search menu</span><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes, ingredients or tags…" /></label>
          <label className="select-field">Dietary<select value={diet} onChange={(event) => setDiet(event.target.value)}><option>All</option><option>Halal</option><option>Spicy</option><option>Vegetarian</option></select></label>
          <label className="select-field">Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="prep">Quickest prep</option></select></label>
        </div>
        <div className="category-tabs" aria-label="Filter by category">{categories.map((name) => <button key={name} className={category === name ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(name)} aria-pressed={category === name}>{name} <span>{counts[name]}</span></button>)}</div>
        {notice && <p className="notice" role="status">{notice}</p>}
        {hiddenSelected.length > 0 && <p className="notice">{hiddenSelected.length} selected dish{hiddenSelected.length === 1 ? ' is' : 'es are'} hidden by your current filters. <Link to="/cart">Review your order</Link>.</p>}
        {loading ? <div className="state-panel"><span className="loader" /><h3>Preparing the menu…</h3><p>Getting the kitchen list ready.</p></div> : error ? <div className="state-panel error-panel"><h3>We couldn’t load the menu.</h3><p>{error}</p><button className="button" onClick={onRetry}>Try again</button></div> : items.length === 0 ? <div className="state-panel"><h3>The menu is empty right now.</h3><p>Please check back soon.</p></div> : results.length === 0 ? <div className="state-panel"><h3>No dishes match “{query}”.</h3><p>Try another search or clear the filters to see all {items.length} dishes.</p><button className="button" onClick={() => { setQuery(''); setCategory('All'); setDiet('All'); }}>Reset search & filters</button></div> : <div className="menu-grid">{results.map((item) => <MenuCard key={item.id} item={item} onQuickAdd={quickAdd} />)}</div>}
      </section>
      <details className="demo-controls"><summary>Demo controls · testing only</summary><p>Use these controls to demonstrate loading recovery and changed availability. They do not change real inventory.</p><label><input type="checkbox" checked={failureDemo} onChange={(event) => onFailureDemo(event.target.checked)} /> Simulate menu loading failure</label><label><input type="checkbox" checked={restockDemo} onChange={(event) => onRestockDemo(event.target.checked)} /> Restock Nimbu Mint Cooler (0 → 4)</label><small>Covered delivery sectors: {SUPPORTED_SECTORS.join(', ')}.</small></details>
    </div>
  );
}
