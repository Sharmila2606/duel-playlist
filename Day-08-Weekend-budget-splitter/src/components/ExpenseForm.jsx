import { useState } from 'react'

export function ExpenseForm({ categories, onAddExpense }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0].name)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault();

    // Convert the input string into a number before validation.
    const parsedAmount = Number(amount);

    // Validation logic: check empty text first, then invalid or negative money.
    if (!title.trim()) {
      setError("Please enter an expense title.");
      return;
    }

    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be at least 1.");
      return;
    }

    onAddExpense({
      title: title.trim(),
      amount: parsedAmount,
      category,
    });

    setTitle("");
    setAmount("");
    setCategory(categories[0].name);
    setError("");
  }

  return (
    <form className="expense-form glass-card" onSubmit={handleSubmit}>
      <div>
        <p className="section-label">Add expense</p>
        <h2>Log a weekend cost</h2>
      </div>

      <label>
        Title
        <input
          type="text"
          placeholder="Dinner, cab, tickets..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <label>
        Amount
        <input
          type="number"
          min="1"
          placeholder="1200"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      <label>
        Category
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item.name} value={item.name}>
              {item.icon} {item.name}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error-message">{error}</p>}

      <button type="submit">Add expense</button>
    </form>
  )
}
