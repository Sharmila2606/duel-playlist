function GenreFilter({ genres, activeGenre, onGenreChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {genres.map((genre) => {
        const isActive = activeGenre === genre

        return (
          <button
            key={genre}
            onClick={() => onGenreChange(genre)}
            className={`rounded-full border px-5 py-2.5 text-sm font-bold shadow-black/20 transition duration-300 hover:-translate-y-1 hover:scale-105 ${
              isActive
                ? 'border-orange-200/70 bg-gradient-to-r from-pink-500/25 via-rose-500/18 to-orange-400/20 text-white shadow-xl shadow-pink-500/25 ring-4 ring-orange-300/10'
                : 'border-white/10 bg-white/7 text-white/65 backdrop-blur-xl hover:border-pink-200/35 hover:bg-white/12 hover:text-white hover:shadow-lg'
            }`}
            type="button"
          >
            {genre}
          </button>
        )
      })}
    </div>
  )
}

export default GenreFilter
