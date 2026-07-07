import { useState } from "react";
import { Film } from "lucide-react";
import EmptyState from "./components/EmptyState";
import FavoritesPanel from "./components/FavoritesPanel";
import FilterStatus from "./components/FilterStatus";
import HeroSection from "./components/HeroSection";
import MovieGrid from "./components/MovieGrid";
import Navbar from "./components/Navbar";
import ShortlistPanel from "./components/ShortlistPanel";
import SummaryCard from "./components/SummaryCard";
import { genres, movies } from "./data/movies";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [shortlistIds, setShortlistIds] = useState([]);

  const normalizedSearch = searchTerm.toLowerCase();

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(normalizedSearch) ||
      movie.genre.toLowerCase().includes(normalizedSearch);
    const matchesGenre = activeGenre === "All" || movie.genre === activeGenre;

    return matchesSearch && matchesGenre;
  });

  const favoriteMovies = movies.filter((movie) =>
    favoriteIds.includes(movie.id),
  );
  const shortlistMovies = movies.filter((movie) =>
    shortlistIds.includes(movie.id),
  );

  function toggleFavorite(movieId) {
    if (favoriteIds.includes(movieId)) {
      setFavoriteIds(favoriteIds.filter((id) => id !== movieId));
    } else {
      setFavoriteIds([...favoriteIds, movieId]);
    }
  }

  function toggleShortlist(movieId) {
    if (shortlistIds.includes(movieId)) {
      setShortlistIds(shortlistIds.filter((id) => id !== movieId));
    } else {
      setShortlistIds([...shortlistIds, movieId]);
    }
  }

  function resetFilters() {
    setSearchTerm("");
    setActiveGenre("All");
  }

  return (
    <div className="min-h-screen bg-[#050407] text-white">
      <Navbar
        favoriteCount={favoriteIds.length}
        shortlistCount={shortlistIds.length}
      />

      <HeroSection
        genres={genres}
        activeGenre={activeGenre}
        onGenreChange={setActiveGenre}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-orange-200/70">
              Editor's Picks
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Discover Exceptional Cinema
            </h2>
            <FilterStatus activeGenre={activeGenre} searchTerm={searchTerm} />
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-white/50">
              Showing{" "}
              <span className="text-white">{filteredMovies.length}</span> of{" "}
              {movies.length} movies
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-black text-white/70 transition hover:border-orange-200/40 hover:bg-white/14 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-200/70">
            Selected Mood
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <SummaryCard label="Genre" value={activeGenre} />
            <SummaryCard
              label="Search"
              value={searchTerm ? searchTerm : "None"}
            />
            <SummaryCard
              label="Matches"
              value={`${filteredMovies.length} movies`}
            />
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <EmptyState
            icon={Film}
            title="No movies found"
            message="Try a different title, genre, or clear the active filter to see more picks."
          />
        ) : (
          <MovieGrid
            movies={filteredMovies}
            favoriteIds={favoriteIds}
            shortlistIds={shortlistIds}
            onToggleFavorite={toggleFavorite}
            onToggleShortlist={toggleShortlist}
          />
        )}

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <FavoritesPanel movies={favoriteMovies} />
          <ShortlistPanel movies={shortlistMovies} />
        </section>
      </main>
    </div>
  );
}

export default App;
