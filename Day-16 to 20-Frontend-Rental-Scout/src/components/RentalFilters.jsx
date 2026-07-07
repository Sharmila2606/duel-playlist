function RentalFilters({
  cityOptions,
  filters,
  propertyTypeOptions,
  resultCount,
  onFilterChange,
  onResetFilters,
}) {
  return (
    <form className="filter-panel">
      <label className="search-field">
        Search listings
        <input
          type="search"
          value={filters.searchText}
          placeholder="Search by title, area, city, or nearby place"
          onChange={(event) => onFilterChange('searchText', event.target.value)}
        />
      </label>

      <div className="filter-row">
        <label>
          City
          <select
            value={filters.city}
            onChange={(event) => onFilterChange('city', event.target.value)}
          >
            <option value="All">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label>
          Price range
          <select
            value={filters.priceRange}
            onChange={(event) => onFilterChange('priceRange', event.target.value)}
          >
            <option value="All">Any budget</option>
            <option value="under-10000">Under Rs. 10,000</option>
            <option value="10000-20000">Rs. 10,000 - Rs. 20,000</option>
            <option value="20000-30000">Rs. 20,000 - Rs. 30,000</option>
            <option value="above-30000">Above Rs. 30,000</option>
          </select>
        </label>

        <label>
          Property type
          <select
            value={filters.propertyType}
            onChange={(event) => onFilterChange('propertyType', event.target.value)}
          >
            <option value="All">All types</option>
            {propertyTypeOptions.map((propertyType) => (
              <option key={propertyType} value={propertyType}>
                {propertyType}
              </option>
            ))}
          </select>
        </label>

        <label>
          Availability
          <select
            value={filters.availability}
            onChange={(event) => onFilterChange('availability', event.target.value)}
          >
            <option value="All">All listings</option>
            <option value="available">Available</option>
            <option value="not-available">Not available</option>
          </select>
        </label>
      </div>

      <div className="filter-footer">
        <p>{resultCount} matching listings</p>
        <button className="button secondary reset-button" type="button" onClick={onResetFilters}>
          Reset filters
        </button>
      </div>
    </form>
  )
}

export default RentalFilters
