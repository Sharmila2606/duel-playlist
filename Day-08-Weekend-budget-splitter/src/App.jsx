import { useState } from 'react'
import './App.css'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { SummaryCard } from './components/SummaryCard'

const categories = [
  { name: 'Food', icon: '🍜' },
  { name: 'Travel', icon: '🚕' },
  { name: 'Stay', icon: '🏨' },
  { name: 'Fun', icon: '🎟️' },
  { name: 'Shopping', icon: '🛍️' },
]

// Helper function: keeps all currency formatting in one place.
const formatMoney = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

function App() {
  const [budget, setBudget] = useState("8000");
  const [people, setPeople] = useState("2");
  const [expenses, setExpenses] = useState([]);

  const budgetNumber = Number(budget) || 0;
  // If the people input is empty, use 1. Also cap it at 20 for a realistic group size.
  const peopleNumber = Math.min(Number(people) || 1, 20);

  // Derived state: these values are calculated from expenses during render.
  // We do not store totalSpent separately, because duplicate state can become wrong.
  const totalSpent = expenses.reduce((sum, expense) => {
    // reduce() carries one running value. Here, sum starts at 0 and grows by each amount.
    return sum + expense.amount;
  }, 0);

  // remaining is derived from the budget input and the current total spent.
  const remaining = budgetNumber - totalSpent;
  // perPerson is derived from totalSpent and the number of people.
  const perPerson = totalSpent / peopleNumber;
  const spentPercent =
    budgetNumber > 0 ? Math.min((totalSpent / budgetNumber) * 100, 100) : 0;

  const categoryTotals = categories.map((category) => {
    // filter() keeps only the expenses that match this category.
    const categoryExpenses = expenses.filter(
      (expense) => expense.category === category.name,
    );

    return {
      ...category,
      total: categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      // count is also derived from the filtered list.
      count: categoryExpenses.length,
    };
  });

  function addExpense(newExpense) {
    setExpenses([
      {
        id: crypto.randomUUID(),
        ...newExpense,
      },
      ...expenses,
    ]);
  }

  function deleteExpense(expenseId) {
    setExpenses(expenses.filter((expense) => expense.id !== expenseId));
  }

  return (
    <main className="app-shell">
      <header className="hero-section">
        <div>
          <p className="eyebrow">Weekend finance lab</p>
          <h1>Weekend Budget Splitter</h1>
          <p className="hero-copy">
            Track group expenses, split costs, and learn React derived state
            with live money calculations.
          </p>
        </div>

        <div className="budget-controls glass-card">
          <label>
            Total budget
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            />
          </label>

          <label>
            People
            <input
              type="number"
              min="1"
              max="20"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
            />
          </label>
        </div>
      </header>

      <section className="summary-grid" aria-label="Budget summary">
        <SummaryCard
          label="Total Budget"
          value={formatMoney(budgetNumber)}
          helper="Money planned"
        />
        <SummaryCard
          label="Total Spent"
          value={formatMoney(totalSpent)}
          helper={`${Math.round(spentPercent)}% of budget`}
          tone="cyan"
        />
        <SummaryCard
          label="Remaining"
          value={formatMoney(remaining)}
          helper={remaining >= 0 ? "Still available" : "Over budget"}
          tone={remaining >= 0 ? "success" : "warning"}
        />
        <SummaryCard
          label="Per Person Split"
          value={formatMoney(perPerson)}
          helper={`${peopleNumber} people`}
          tone="purple"
        />
      </section>

      <section className="dashboard-grid">
        <div className="left-column">
          <ExpenseForm categories={categories} onAddExpense={addExpense} />
          <CategoryBreakdown
            categories={categoryTotals}
            totalSpent={totalSpent}
            formatMoney={formatMoney}
          />
        </div>

        <ExpenseList
          expenses={expenses}
          categories={categories}
          formatMoney={formatMoney}
          onDeleteExpense={deleteExpense}
        />
      </section>
    </main>
  );
}

export default App
