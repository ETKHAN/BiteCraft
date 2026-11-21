import menuItems from '../data/menuItems.js';

// A short delay makes loading and retry states observable in this frontend prototype.
export async function loadMenu({ shouldFail = false, restockDemo = false } = {}) {
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  if (shouldFail) throw new Error('The menu could not be loaded. Check the demo setting and try again.');
  return menuItems.map((item) => ({
    ...item,
    stockCount: restockDemo && item.id === 'nimbu-mint-cooler' ? 4 : item.stockCount,
    dietaryTags: [...item.dietaryTags],
    options: Object.fromEntries(Object.entries(item.options).map(([key, values]) => [key, [...values]])),
  }));
}
