function PlannerSummary({ plannedCount, resultCount, noteCount }) {
  return (
    <aside className="planner-summary" aria-label="Planner summary">
      <div>
        <strong>{plannedCount}</strong>
        <span>places planned</span>
      </div>

      <div>
        <strong>{resultCount}</strong>
        <span>matches now</span>
      </div>

      <div>
        <strong>{noteCount}</strong>
        <span>notes added</span>
      </div>
    </aside>
  )
}

export default PlannerSummary
