import menuItems from '../data/menuItems.js'

const LOAD_DELAY_MS = 800

// Pretends to be a network request: resolves with the menu after a short delay,
// or rejects when shouldFail is true so the failure state can be demonstrated.
export function loadMenu({ shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('The menu could not be loaded.'))
      } else {
        resolve(menuItems)
      }
    }, LOAD_DELAY_MS)
  })
}
