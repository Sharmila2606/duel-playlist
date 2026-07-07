import { ListChecks } from 'lucide-react'
import EmptyState from './EmptyState'

function ShortlistPanel({ movies }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Tonight's Shortlist</h2>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-black text-emerald-100">{movies.length}</span>
      </div>
      {movies.length === 0 ? (
        <EmptyState icon={ListChecks} title="Shortlist is empty" message="Use the plus button to build a final watchlist for movie night." />
      ) : (
        <div className="space-y-3">
          {movies.map((movie) => (
            <div key={movie.id} className="flex items-center gap-3 rounded-2xl bg-black/20 p-3">
              <img className="size-12 rounded-xl object-cover object-center brightness-95 shadow-lg shadow-black/30" src={movie.poster} alt="" />
              <div>
                <p className="font-bold text-white">{movie.title}</p>
                <p className="text-xs font-semibold text-white/45">{movie.runtime}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}

export default ShortlistPanel
