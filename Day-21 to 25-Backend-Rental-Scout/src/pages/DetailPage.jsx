import { Link, useParams } from 'react-router-dom'
import DetailFact from '../components/DetailFact'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { rentals } from '../data/rentals'

function DetailPage() {
  const { rentalId } = useParams()
  const rental = rentals.find((item) => item.id === rentalId)

  if (!rental) {
    return (
      <section className="page-section">
        <EmptyState
          title="Rental not found"
          message="This property link does not match any listing in the sample data."
          action={
            <Link className="button primary" to="/listings">
              Back to listings
            </Link>
          }
        />
      </section>
    )
  }

  return (
    <section className="page-section detail-page">
      <div className="detail-media">
        <img className="detail-image" src={rental.imageUrl} alt={rental.title} />
        <div className="detail-quick-card">
          <StatusBadge isAvailable={rental.isAvailable} />
          <p className="price">Rs. {rental.rentPerMonth.toLocaleString('en-IN')} / month</p>
          <Link className="button primary" to={`/listings/${rental.id}/apply`}>
            Inquiry / Apply
          </Link>
        </div>
      </div>

      <div className="detail-content">
        <Link className="text-link back-link" to="/listings">
          Back to listings
        </Link>

        <p className="eyebrow">
          {rental.city} | {rental.neighborhood}
        </p>
        <h1>{rental.title}</h1>
        <p className="property-type-line">{rental.propertyType}</p>
        <p className="lead">{rental.summary}</p>

        <div className="rating-row" aria-label={`${rental.rating} out of 5 rating`}>
          <span className="stars">Rating: {rental.rating} / 5</span>
        </div>

        <div className="detail-facts">
          <DetailFact
            label="Monthly rent"
            value={`Rs. ${rental.rentPerMonth.toLocaleString('en-IN')}`}
          />
          <DetailFact label="Deposit" value={`Rs. ${rental.deposit.toLocaleString('en-IN')}`} />
          <DetailFact label="Bedrooms" value={rental.bedrooms} />
          <DetailFact label="Bathrooms" value={rental.bathrooms} />
        </div>

        <div className="info-block">
          <h2>Address and Contact</h2>
          <p>{rental.address}</p>
          <p>Contact number: {rental.contactNumber}</p>
        </div>

        <div className="info-block highlight-block">
          <h2>Key Property Highlights</h2>
          <ul className="clean-list">
            {rental.keyHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div className="info-block">
          <h2>Amenities</h2>
          <div className="tag-row">
            {rental.amenities.map((amenity) => (
              <span className="tag" key={amenity}>
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="info-block">
          <h2>Nearby Places</h2>
          <div className="nearby-grid">
            {rental.nearbyPlaces.map((place) => (
              <span key={place}>{place}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DetailPage
