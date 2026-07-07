import MovieCard from './MovieCard'

function MovieGrid({ movies, favoriteIds, shortlistIds, onToggleFavorite, onToggleShortlist }) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favoriteIds.includes(movie.id)}
          isShortlisted={shortlistIds.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
          onToggleShortlist={onToggleShortlist}
        />
      ))}
    </section>
  )
}

export default MovieGrid
