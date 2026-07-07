import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page-section">
      <h1>Page not found</h1>
      <p>This route is not part of the Rental Scout skeleton yet.</p>
      <Link className="text-link" to="/">
        Go home
      </Link>
    </section>
  )
}

export default NotFoundPage
