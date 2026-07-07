import { Link } from 'react-router-dom'
import { rentals } from '../data/rentals'

function HomePage() {
  const lowBudgetCount = rentals.filter((rental) => rental.rentPerMonth <= 22000).length

  return (
    <section className="page-section hero-section">
      <div className="hero-panel">
        <p className="eyebrow">Smart rental search for students and young renters</p>
        <h1>Rental Scout</h1>
        <p className="tagline">Find a place that fits your budget, commute, and daily life.</p>
        <p className="lead">
          Browse realistic apartment, PG, and hostel-style options with rent, location,
          nearby places, and quick inquiry flow.
        </p>

        <div className="action-row">
          <Link className="button primary" to="/listings">
            Browse {rentals.length} listings
          </Link>
          <Link className="button secondary" to="/saved">
            View saved homes
          </Link>
        </div>

        <div className="hero-stats" aria-label="Rental Scout summary">
          <div>
            <strong>{rentals.length}</strong>
            <span>Total listings</span>
          </div>
          <div>
            <strong>{lowBudgetCount}</strong>
            <span>Low-budget options</span>
          </div>
          <div>
            <strong>2</strong>
            <span>PG / hostel stays</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
