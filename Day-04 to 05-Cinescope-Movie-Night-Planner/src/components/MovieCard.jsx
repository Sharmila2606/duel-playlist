import { Clock, Heart, ListPlus, Star } from 'lucide-react'

function MovieCard({ movie, isFavorite, isShortlisted, onToggleFavorite, onToggleShortlist }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 shadow-[0_22px_70px_rgba(0,0,0,0.46)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-orange-200/35 hover:shadow-[0_34px_110px_rgba(244,63,94,0.18)]">
      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -inset-1 bg-gradient-to-br from-pink-500/25 via-orange-400/10 to-violet-500/20 blur-2xl" />
      </div>
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-950">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="h-full w-full object-cover object-center brightness-[0.92] contrast-110 saturate-[1.05] transition duration-700 ease-out group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-125"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_30%)] opacity-35 transition duration-500 group-hover:opacity-65" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-xs font-black text-white shadow-lg shadow-black/30 backdrop-blur-xl">
          {movie.genre}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1 text-sm font-black text-black shadow-lg shadow-amber-950/40">
          <Star className="size-4 fill-black text-black" />
          {movie.rating}
        </div>
      </div>
      <div className="relative border-t border-white/8 bg-gradient-to-b from-white/8 to-white/4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">{movie.title}</h2>
            <p className="mt-1 text-sm font-bold text-orange-100/55">{movie.year}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleFavorite(movie.id)}
              className={`grid size-10 place-items-center rounded-2xl border transition hover:scale-105 ${
                isFavorite
                  ? 'border-rose-300/60 bg-rose-500/25 text-rose-200'
                  : 'border-white/10 bg-white/8 text-white/55 hover:text-rose-200'
              }`}
              type="button"
              aria-label="Toggle favorite"
            >
              <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onToggleShortlist(movie.id)}
              className={`grid size-10 place-items-center rounded-2xl border transition hover:scale-105 ${
                isShortlisted
                  ? 'border-emerald-300/60 bg-emerald-500/20 text-emerald-200'
                  : 'border-white/10 bg-white/8 text-white/55 hover:text-emerald-200'
              }`}
              type="button"
              aria-label="Toggle shortlist"
            >
              <ListPlus className="size-4" />
            </button>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 text-sm font-bold text-white/60">
          <span className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5">
            <Clock className="size-4" />
            {movie.runtime}
          </span>
          <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-white/75">{movie.genre}</span>
        </div>
      </div>
    </article>
  )
}

export default MovieCard
