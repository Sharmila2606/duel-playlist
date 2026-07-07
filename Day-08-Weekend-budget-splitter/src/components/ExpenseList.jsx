export function ExpenseList({
  expenses,
  categories,
  formatMoney,
  onDeleteExpense,
}) {
  return (
    <section className="expense-list glass-card">
      <div>
        <p className="section-label">History</p>
        <h2>Expense history</h2>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <h3>No expenses yet</h3>
          <p>Add the first expense to see totals update automatically.</p>
        </div>
      ) : (
        <ul>
          {expenses.map((expense) => {
            const category = categories.find(
              (item) => item.name === expense.category,
            )

            return (
              <li key={expense.id} className="expense-row">
                <div className="category-icon">{category?.icon}</div>
                <div>
                  <strong>{expense.title}</strong>
                  <span>{expense.category}</span>
                </div>
                <p>{formatMoney(expense.amount)}</p>
                <button
                  type="button"
                  aria-label={`Delete ${expense.title}`}
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
