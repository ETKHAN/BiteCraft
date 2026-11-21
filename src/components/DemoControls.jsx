import { useOrder } from '../context/OrderContext.jsx'

// Testing buttons that make the failure and changed-availability cases easy to reproduce.
function DemoControls() {
  const { simulateLoadFailure, reduceStock } = useOrder()

  return (
    <section className="demo-controls" aria-labelledby="demo-title">
      <h2 id="demo-title">Demo controls (testing only)</h2>
      <div className="button-row">
        <button type="button" className="button button-secondary button-small" onClick={simulateLoadFailure}>
          Simulate loading failure
        </button>
        <button
          type="button"
          className="button button-secondary button-small"
          onClick={() => reduceStock('smash-beef-burger', 1)}
        >
          Reduce Smash Burger stock to 1
        </button>
      </div>
      <p>Reload the page, or use Try again after a failure, to restore the original stock.</p>
    </section>
  )
}

export default DemoControls
