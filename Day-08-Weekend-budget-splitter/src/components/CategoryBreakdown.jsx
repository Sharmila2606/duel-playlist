export function CategoryBreakdown({ categories, totalSpent, formatMoney }) {
  return (
    <section className="category-breakdown glass-card">
      <div>
        <p className="section-label">Breakdown</p>
        <h2>Category subtotals</h2>
      </div>

      <div className="category-stack">
        {categories.map((category) => {
          const percent =
            totalSpent > 0 ? Math.round((category.total / totalSpent) * 100) : 0

          return (
            <article key={category.name} className="category-row">
              <div className="category-title">
                <span>{category.icon}</span>
                <div>
                  <strong>{category.name}</strong>
                  <p>{category.count} items</p>
                </div>
              </div>
              <div className="category-money">
                <strong>{formatMoney(category.total)}</strong>
                <span>{percent}%</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
