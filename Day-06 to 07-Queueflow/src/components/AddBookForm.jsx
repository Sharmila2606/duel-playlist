import { Plus } from 'lucide-react'
import { useState } from 'react'

const emptyForm = {
  title: '',
  author: '',
  category: '',
  status: 'Pending',
  priority: 'Medium',
}

function AddBookForm({ onAddBook }) {
  const [formData, setFormData] = useState(emptyForm)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.title.trim() || !formData.author.trim() || !formData.category.trim()) {
      setError('Please fill title, author, and category.')
      return
    }

    onAddBook(formData)
    setFormData(emptyForm)
    setError('')
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-cyan-200">Add to queue</p>
            <h2 className="text-2xl font-semibold text-white">Capture your next read</h2>
          </div>
          {error && <p className="rounded-full bg-rose-500/15 px-4 py-2 text-sm text-rose-200">{error}</p>}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_.8fr_.8fr_auto]">
          <input className="field" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
          <input className="field" name="author" value={formData.author} onChange={handleChange} placeholder="Author" />
          <input className="field" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
          <select className="field" name="status" value={formData.status} onChange={handleChange}>
            <option>Pending</option>
            <option>Reading</option>
            <option>Completed</option>
          </select>
          <select className="field" name="priority" value={formData.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]" type="submit">
            <Plus size={18} />
            Add
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddBookForm
