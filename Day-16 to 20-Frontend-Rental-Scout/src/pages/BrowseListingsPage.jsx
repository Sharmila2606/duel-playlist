import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import RentalCard from '../components/RentalCard'
import RentalFilters from '../components/RentalFilters'

const defaultFilters = {
  searchText: '',
  city: 'All',
  priceRange: 'All',
  propertyType: 'All',
  availability: 'All',
}

function isInsidePriceRange(rentPerMonth, priceRange) {
  if (priceRange === 'under-10000') {
    return rentPerMonth < 10000
  }

  if (priceRange === '10000-20000') {
    return rentPerMonth >= 10000 && rentPerMonth <= 20000
  }

  if (priceRange === '20000-30000') {
    return rentPerMonth > 20000 && rentPerMonth <= 30000
  }

  if (priceRange === 'above-30000') {
    return rentPerMonth > 30000
  }

  return true
}

function matchesAvailabilityStatus(isAvailable, availability) {
  if (availability === 'available') {
    return isAvailable
  }

  if (availability === 'not-available') {
    return !isAvailable
  }

  return true
}

function BrowseListingsPage({ rentals, onToggleSave }) {
  const [filters, setFilters] = useState(defaultFilters)
  const cityOptions = [...new Set(rentals.map((rental) => rental.city))].sort()
  const propertyTypeOptions = [...new Set(rentals.map((rental) => rental.propertyType))].sort()
  const lowestRent = Math.min(...rentals.map((rental) => rental.rentPerMonth))

  const filteredRentals = rentals.filter((rental) => {
    const searchValue = filters.searchText.trim().toLowerCase()
    const searchContent = [
      rental.title,
      rental.city,
      rental.neighborhood,
      rental.address,
      rental.propertyType,
      rental.summary,
      ...rental.nearbyPlaces,
      ...rental.amenities,
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch = searchValue === '' || searchContent.includes(searchValue)
    const matchesCity = filters.city === 'All' || rental.city === filters.city
    const matchesType =
      filters.propertyType === 'All' || rental.propertyType === filters.propertyType
    const matchesPrice = isInsidePriceRange(rental.rentPerMonth, filters.priceRange)
    const matchesAvailability = matchesAvailabilityStatus(
      rental.isAvailable,
      filters.availability,
    )

    return matchesSearch && matchesCity && matchesType && matchesPrice && matchesAvailability
  })

  function handleFilterChange(filterName, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: value,
    }))
  }

  function handleResetFilters() {
    setFilters(defaultFilters)
  }

  return (
    <section className="page-section listings-page">
      <div className="page-heading wide-heading">
        <p className="eyebrow">Browse realistic local rentals</p>
        <h1>Find your Next Home</h1>
      </div>

      <div className="listing-summary">
        <span>{rentals.length} total listings</span>
        <span>Starting from Rs. {lowestRent.toLocaleString('en-IN')} / month</span>
        <span>{rentals.filter((rental) => rental.isSaved).length} saved now</span>
      </div>

      <RentalFilters
        cityOptions={cityOptions}
        filters={filters}
        propertyTypeOptions={propertyTypeOptions}
        resultCount={filteredRentals.length}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {filteredRentals.length > 0 ? (
        <div className="rental-grid">
          {filteredRentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} onToggleSave={onToggleSave} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No rentals match these filters"
          message="Try a different city, wider price range, or reset the filters."
          action={
            <button className="button primary" type="button" onClick={handleResetFilters}>
              Reset filters
            </button>
          }
        />
      )}
    </section>
  )
}

export default BrowseListingsPage
