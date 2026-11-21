import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import MenuPage from './pages/MenuPage.jsx';
import ItemDetailsPage from './pages/ItemDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import { loadMenu } from './services/menuService.js';
import './App.css';

function BiteCraftApp() {
  const [menuState, setMenuState] = useState({ items: [], loading: true, error: '' });
  const [failureDemo, setFailureDemo] = useState(false);
  const [restockDemo, setRestockDemo] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    loadMenu({ shouldFail: failureDemo, restockDemo })
      .then((items) => { if (active) setMenuState({ items, loading: false, error: '' }); })
      .catch((reason) => { if (active) setMenuState((current) => ({ ...current, loading: false, error: reason.message || 'Unable to load the menu.' })); });
    return () => { active = false; };
  }, [failureDemo, restockDemo, reloadKey]);

  const startReload = () => {
    setMenuState((current) => ({ ...current, loading: true, error: '' }));
    setReloadKey((key) => key + 1);
  };
  const changeFailureDemo = (value) => {
    setMenuState((current) => ({ ...current, loading: true, error: '' }));
    setFailureDemo(value);
  };
  const changeRestockDemo = (value) => {
    setMenuState((current) => ({ ...current, loading: true, error: '' }));
    setRestockDemo(value);
  };

  return (
    <OrderProvider items={menuState.items}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/menu" element={<MenuPage items={menuState.items} loading={menuState.loading} error={menuState.error} onRetry={startReload} failureDemo={failureDemo} onFailureDemo={changeFailureDemo} restockDemo={restockDemo} onRestockDemo={changeRestockDemo} />} />
          <Route path="/items/:id" element={menuState.loading ? <div className="page-wrap state-panel"><h2>Loading dish…</h2></div> : <ItemDetailsPage items={menuState.items} />} />
          <Route path="/cart" element={<CartPage items={menuState.items} />} />
          <Route path="/checkout" element={<CheckoutPage items={menuState.items} />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<div className="page-wrap state-panel"><h1>Page not found</h1><p>That page doesn’t exist in the BiteCraft menu.</p><a className="button" href="/menu">Return to menu</a></div>} />
        </Route>
      </Routes>
    </OrderProvider>
  );
}

export default function App() {
  return <BrowserRouter><BiteCraftApp /></BrowserRouter>;
}
