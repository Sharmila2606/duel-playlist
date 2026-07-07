import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import RentalCard from '../components/RentalCard'

function SavedPage({ rentals, onToggleSave }) {
  const savedRentals = rentals.filter((rental) => rental.isSaved)

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Shortlist</p>
        <h1>Saved Rentals</h1>
      </div>

      {savedRentals.length > 0 ? (
        <div className="rental-grid">
          {savedRentals.map((rental) => (
            <RentalCard key={rental.id} rental={rental} onToggleSave={onToggleSave} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved rentals yet"
          message="Go to Browse Listings and save the homes you want to compare later."
          action={
            <Link className="button primary" to="/listings">
              Browse listings
            </Link>
          }
        />
      )}
    </section>
  )
}

export default SavedPage
