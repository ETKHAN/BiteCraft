import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'

// Shown for any URL that does not match a route.
function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <EmptyState title="This page does not exist">
        <p>Check the address, or go back to the menu.</p>
        <Link className="button" to="/">
          Back to the menu
        </Link>
      </EmptyState>
    </>
  )
}

export default NotFoundPage
