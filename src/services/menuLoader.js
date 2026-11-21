import menuItems from '../data/menuItems.js';

const LOAD_DELAY_MS = 800;

// Simulates a network request so loading, retry, and failure states can be demonstrated.
export function loadMenu({ shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('The menu could not be loaded.'));
      } else {
        resolve(menuItems);
      }
    }, LOAD_DELAY_MS);
  });
}
