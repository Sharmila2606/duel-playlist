import { X } from 'lucide-react'
import { useState } from 'react'

function EditModal({ book, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: book.title,
    category: book.category,
    status: book.status,
  })

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave(book.id, formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="w-full max-w-lg animate-fade-up rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-cyan-200">Edit item</p>
            <h2 className="text-2xl font-semibold text-white">Update reading details</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4">
          <input className="field" name="title" value={formData.title} onChange={handleChange} />
          <input className="field" name="category" value={formData.category} onChange={handleChange} />
          <select className="field" name="status" value={formData.status} onChange={handleChange}>
            <option>Pending</option>
            <option>Reading</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-slate-300 hover:bg-white/5">
            Cancel
          </button>
          <button className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white" type="submit">
            Save changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditModal
