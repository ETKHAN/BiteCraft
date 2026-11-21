import { Link, NavLink, Outlet } from 'react-router-dom';
import { useOrder } from '../context/OrderContext.js';

export default function SiteLayout() {
  const { itemCount } = useOrder();
  return (
    <div className="site-shell">
      <div className="service-strip">F-7 Markaz, Islamabad <span>·</span> Delivery to selected F, G & H sectors <span>·</span> Free pickup</div>
      <header className="site-header">
        <Link to="/menu" className="brand" aria-label="BiteCraft menu">
          <span className="brand-mark">B</span><span>BiteCraft<small>FIRE · FLAVOUR · FRESH</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/cart">Your order <span className="cart-count">{itemCount}</span></NavLink>
        </nav>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <div><strong>BiteCraft</strong><p>Pakistani roots. Continental attitude. Made fresh in F-7.</p></div>
        <p>Self-pickup: F-7 Markaz, Jinnah Super · Islamabad</p>
        <small>Coursework prototype · Orders are simulated · No payment is collected</small>
      </footer>
    </div>
  );
}
