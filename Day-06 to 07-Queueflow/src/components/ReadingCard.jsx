import { Check, Pencil, Trash2 } from 'lucide-react'

const priorityClasses = {
  High: 'bg-rose-400/15 text-rose-200 border-rose-300/20',
  Medium: 'bg-amber-400/15 text-amber-200 border-amber-300/20',
  Low: 'bg-emerald-400/15 text-emerald-200 border-emerald-300/20',
}

const priorityLabels = {
  High: 'Read soon',
  Medium: 'Keep moving',
  Low: 'Later',
}

function ReadingCard({ book, onToggleComplete, onDeleteBook, onEditBook }) {
  return (
    <article
      className={`group animate-fade-up rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.1] hover:shadow-cyan-500/10 ${
        book.completed ? "opacity-60" : "opacity-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={`mb-4 flex h-24 w-20 items-end rounded-2xl bg-gradient-to-br ${book.accent} p-2 shadow-lg shadow-black/30 ${book.completed ? "grayscale" : ""}`}
          >
            <div className="h-10 w-full rounded-xl bg-white/20 backdrop-blur-sm" />
          </div>
          <span className="rounded-full border border-violet-300/20 bg-violet-400/15 px-3 py-1 text-xs font-medium text-violet-100">
            {book.category}
          </span>
          <h3
            className={`mt-4 text-xl font-semibold text-white ${
              book.completed ? "line-through decoration-emerald-300/70" : ""
            }`}
          >
            {book.title}
          </h3>
          <p
            className={`mt-1 text-sm ${
              book.completed ? "text-slate-500" : "text-slate-400"
            }`}
          >
            by {book.author}
          </p>
          <p
            className={`mt-2 text-xs font-medium ${
              book.completed ? "text-emerald-300" : "text-cyan-300"
            }`}
          >
            {book.completed ? "Completed" : "Keep reading"}
          </p>
        </div>

        <button
          onClick={() => onToggleComplete(book.id)}
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
            book.completed
              ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-100 shadow-lg shadow-emerald-500/20"
              : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
          }`}
          title="Toggle complete"
        >
          <Check size={18} />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
          {book.status}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${priorityClasses[book.priority]}`}
        >
          {book.priority}: {priorityLabels[book.priority]}
        </span>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onEditBook(book)}
          className="card-action text-slate-200 hover:text-cyan-100"
        >
          <Pencil size={16} />
          Edit
        </button>
        <button
          onClick={() => onDeleteBook(book.id)}
          className="card-action text-slate-300 hover:border-rose-300/30 hover:bg-rose-500/15 hover:text-rose-100"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </article>
  );
}

export default ReadingCard
