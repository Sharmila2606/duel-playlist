import { BookDashed, SearchX } from 'lucide-react'

function EmptyState({ type }) {
  const isFilter = type === 'filter'
  const Icon = isFilter ? SearchX : BookDashed

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-12 pt-4 sm:px-8">
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.05] p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-400/15 text-violet-100">
          <Icon size={30} />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">
          {isFilter ? 'No matching reads found' : 'Your queue is ready'}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
          {isFilter
            ? 'Try another filter or add a new item with this status.'
            : 'Add your first book or article and start building your personal reading system.'}
        </p>
      </div>
    </section>
  )
}

export default EmptyState
