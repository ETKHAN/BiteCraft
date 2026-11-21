import menuItems from './data/menuItems.js'
import './App.css'

const categories = [...new Set(menuItems.map((item) => item.category))]

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="BiteCraft home">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>BiteCraft</span>
        </a>
        <p className="service-note">Pakistani-continental kitchen · F-7 Markaz, Islamabad</p>
      </header>

      <main className="welcome">
        <p className="eyebrow">Fresh from our kitchen</p>
        <h1>Good food. No guesswork.</h1>
        <p className="intro">
          A local menu and ordering experience for BiteCraft is taking shape.
          Our menu data is connected and ready for the next implementation step.
        </p>
        <div className="data-summary" aria-label="Local menu data summary">
          <div>
            <strong>{menuItems.length}</strong>
            <span>menu items</span>
          </div>
          <div>
            <strong>{categories.length}</strong>
            <span>categories</span>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <p>F-7 Markaz, Islamabad · Self-pickup and selected-sector delivery</p>
      </footer>
    </div>
  )
}

export default App
