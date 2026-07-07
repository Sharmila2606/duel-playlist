import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function RentalCard({ rental, onToggleSave }) {
  return (
    <article className="rental-card">
      <div className="card-image-wrap">
        <img src={rental.imageUrl} alt={rental.title} />
        <span className="property-badge">{rental.propertyType}</span>
        {onToggleSave && (
          <button
            className={`save-button ${rental.isSaved ? 'saved' : ''}`}
            type="button"
            onClick={() => onToggleSave(rental.id)}
            aria-label={rental.isSaved ? 'Remove from saved listings' : 'Save listing'}
          >
            {rental.isSaved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      <div className="rental-card-body">
        <p className="eyebrow">{rental.neighborhood}</p>
        <h2>{rental.title}</h2>
        <p className="muted">{rental.city}</p>
        <p className="price">Rs. {rental.rentPerMonth.toLocaleString('en-IN')} / month</p>
        <p className="card-meta">
          {rental.bedrooms} bed | {rental.bathrooms} bath | {rental.rating} stars
        </p>
        <StatusBadge isAvailable={rental.isAvailable} />

        <Link className="text-link" to={`/listings/${rental.id}`}>
          View details
        </Link>
      </div>
    </article>
  )
}

export default RentalCard
