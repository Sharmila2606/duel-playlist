function WeekendPlan({
  plannedPlaces,
  planNotes,
  onClearPlan,
  onNoteChange,
  onRemovePlace,
  onResetApp,
}) {
  const savedCountText =
    plannedPlaces.length === 1
      ? '1 place saved'
      : `${plannedPlaces.length} places saved`

  return (
    <section className="weekend-plan">
      <div className="plan-heading">
        <div>
          <p className="eyebrow">Your plan</p>
          <h2>Weekend Plan</h2>
          <p>{savedCountText}</p>
        </div>

        {plannedPlaces.length > 0 && (
          <div className="plan-actions">
            <button className="clear-button" type="button" onClick={onClearPlan}>
              Clear plan
            </button>
            <button className="clear-button" type="button" onClick={onResetApp}>
              Reset whole app
            </button>
          </div>
        )}
      </div>

      {plannedPlaces.length > 0 ? (
        <ul>
          {plannedPlaces.map((place) => (
            <li key={place.id}>
              <div className="planned-place-top">
                <div>
                  <strong>{place.name}</strong>
                  <span>{place.bestTime}</span>
                </div>

                <button
                  aria-label={`Remove ${place.name} from plan`}
                  className="remove-plan-button"
                  type="button"
                  onClick={() => onRemovePlace(place.id)}
                >
                  Remove
                </button>
              </div>

              <label>
                Personal note
                <input
                  type="text"
                  placeholder="Example: Go before sunset"
                  value={planNotes[place.id] || ''}
                  onChange={(event) =>
                    onNoteChange(place.id, event.target.value)
                  }
                />
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="plan-empty">
          No saved places yet. Add a place to start your weekend plan.
        </p>
      )}
    </section>
  )
}

export default WeekendPlan
