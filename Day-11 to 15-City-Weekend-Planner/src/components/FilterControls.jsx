function FilterControls({
  activeFilterCount,
  categories,
  searchText,
  selectedCategory,
  showFreeOnly,
  showBudgetOnly,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onFreeOnlyChange,
  onBudgetOnlyChange,
  onSortChange,
  onResetFilters,
}) {
  const filterCountText =
    activeFilterCount === 0
      ? 'No active filters'
      : activeFilterCount === 1
        ? '1 active filter'
        : `${activeFilterCount} active filters`

  return (
    <section className="controls" aria-label="Search and filters">
      <label className="search-label" htmlFor="place-search">
        Search places
      </label>
      <input
        id="place-search"
        type="search"
        placeholder="Try cafe, park, museum..."
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <label className="sort-control">
        Sort by
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="default">Default</option>
          <option value="ratingHigh">Highest rating</option>
          <option value="ratingLow">Lowest rating</option>
          <option value="name">Name A-Z</option>
          <option value="freeFirst">Free places first</option>
        </select>
      </label>

      <div className="filter-row" aria-label="Category filters">
        {categories.map((category) => (
          <button
            aria-pressed={selectedCategory === category}
            className={selectedCategory === category ? 'active' : ''}
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <label className="free-filter">
        <input
          type="checkbox"
          checked={showFreeOnly}
          onChange={(event) => onFreeOnlyChange(event.target.checked)}
        />
        Free places only
      </label>

      <label className="free-filter">
        <input
          type="checkbox"
          checked={showBudgetOnly}
          onChange={(event) => onBudgetOnlyChange(event.target.checked)}
        />
        Budget friendly
      </label>

      {activeFilterCount > 0 && (
        <button className="reset-button" type="button" onClick={onResetFilters}>
          Reset filters
        </button>
      )}
      <p className="filter-count">{filterCountText}</p>
    </section>
  )
}

export default FilterControls
