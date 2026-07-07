import { Heart } from 'lucide-react'
import EmptyState from './EmptyState'

function FavoritesPanel({ movies }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Favorites</h2>
        <span className="rounded-full bg-rose-500/20 px-3 py-1 text-sm font-black text-rose-100">{movies.length}</span>
      </div>
      {movies.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" message="Tap the heart on a movie card to keep your top picks close." />
      ) : (
        <div className="space-y-3">
          {movies.map((movie) => (
            <div key={movie.id} className="flex items-center gap-3 rounded-2xl bg-black/20 p-3">
              <img className="size-12 rounded-xl object-cover object-center brightness-95 shadow-lg shadow-black/30" src={movie.poster} alt="" />
              <div>
                <p className="font-bold text-white">{movie.title}</p>
                <p className="text-xs font-semibold text-white/45">{movie.genre}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}

export default FavoritesPanel
