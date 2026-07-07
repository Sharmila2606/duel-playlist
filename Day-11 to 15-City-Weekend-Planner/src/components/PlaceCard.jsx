function PlaceCard({ place, isPlanned, onTogglePlan }) {
  return (
    <article className="place-card">
      <div className="card-topline">
        <span className="category">{place.category}</span>
        <span className="rating">{place.rating}</span>
      </div>

      <h2>{place.name}</h2>
      <p className="area">{place.area}</p>
      <p className="description">{place.description}</p>

      <div className="card-footer">
        <span>{place.bestTime}</span>
        <span>{place.cost}</span>
      </div>

      <button
        aria-pressed={isPlanned}
        className={isPlanned ? 'plan-button planned' : 'plan-button'}
        type="button"
        onClick={() => onTogglePlan(place.id)}
      >
        {isPlanned ? 'Remove from plan' : 'Add to plan'}
      </button>
    </article>
  )
}

export default PlaceCard
