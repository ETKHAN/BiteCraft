import { useEffect, useMemo, useState } from 'react';
import { OrderContext } from './orderContext.js';
import { validateItemQuantity } from '../rules/orderRules.js';

const STORAGE_KEY = 'bitecraft-cart-v1';

function readSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((line) => line && typeof line.id === 'string').map((line) => ({
      id: line.id, quantity: Number(line.quantity) || 0, options: line.options || {},
    })) : [];
  } catch {
    return [];
  }
}

// Enforce the per-menu-item cap across customisation variants, not just each cart row.
function clampCart(lines, items) {
  if (!items.length) return lines;
  const totals = new Map();
  return lines.flatMap((line) => {
    const item = items.find((entry) => entry.id === line.id);
    if (!item) return [];
    const alreadySelected = totals.get(line.id) || 0;
    const remaining = Math.max(0, Math.min(5, item.stockCount) - alreadySelected);
    const quantity = Math.min(line.quantity, remaining);
    if (!validateItemQuantity(quantity, item.stockCount).valid) return [];
    totals.set(line.id, alreadySelected + quantity);
    return [{ ...line, quantity }];
  });
}

export function OrderProvider({ items = [], children }) {
  const [storedCart, setStoredCart] = useState(readSavedCart);
  const cart = useMemo(() => clampCart(storedCart, items), [storedCart, items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Keep the in-memory cart usable if browser storage is unavailable.
    }
  }, [cart]);

  const addItem = (item, quantity = 1, options = {}) => {
    const totalForItem = cart.filter((line) => line.id === item.id).reduce((sum, line) => sum + line.quantity, 0);
    const check = validateItemQuantity(totalForItem + quantity, item.stockCount);
    if (!check.valid) return check;
    setStoredCart((current) => {
      const safe = clampCart(current, items);
      const match = safe.find((line) => line.id === item.id && JSON.stringify(line.options) === JSON.stringify(options));
      return match
        ? safe.map((line) => line === match ? { ...line, quantity: line.quantity + quantity } : line)
        : [...safe, { id: item.id, quantity, options }];
    });
    return { valid: true, message: `${item.name} added to your cart.` };
  };

  const updateQuantity = (id, options, quantity) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return { valid: false, message: 'This menu item is no longer available.' };
    const otherQuantity = cart.filter((line) => line.id === id && JSON.stringify(line.options) !== JSON.stringify(options))
      .reduce((sum, line) => sum + line.quantity, 0);
    const check = validateItemQuantity(quantity + otherQuantity, item.stockCount);
    if (!check.valid) return check;
    setStoredCart((current) => clampCart(current, items).map((line) =>
      line.id === id && JSON.stringify(line.options) === JSON.stringify(options) ? { ...line, quantity } : line
    ));
    return { valid: true, message: '' };
  };

  const removeItem = (id, options) => setStoredCart((current) => current.filter(
    (line) => !(line.id === id && JSON.stringify(line.options) === JSON.stringify(options))
  ));
  const clearCart = () => setStoredCart([]);

  const lines = useMemo(() => cart.map((line) => ({
    ...line,
    item: items.find((item) => item.id === line.id),
    subtotal: (items.find((item) => item.id === line.id)?.price || 0) * line.quantity,
  })).filter((line) => line.item), [cart, items]);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);

  return <OrderContext.Provider value={{ cart, lines, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart }}>{children}</OrderContext.Provider>;
}
