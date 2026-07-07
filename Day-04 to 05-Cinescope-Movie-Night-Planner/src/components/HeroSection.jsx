import { Sparkles } from 'lucide-react'
import GenreFilter from './GenreFilter'
import SearchBar from './SearchBar'

function HeroSection({ genres, activeGenre, onGenreChange, searchTerm, onSearchChange }) {
  return (
    <header className="relative isolate overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
      <div className="absolute inset-0 -z-20 bg-[#050407]" />
      <div className="hero-ambient absolute inset-0 -z-10" />
      <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-64 max-w-4xl bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.28),rgba(168,85,247,0.12)_38%,transparent_72%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

      <div className="fade-up mx-auto max-w-6xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold text-rose-100 shadow-2xl shadow-rose-950/30 backdrop-blur-2xl">
          <Sparkles className="size-4 text-amber-300" />
          Handpicked cinema for every mood
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[0.95] text-white sm:text-7xl lg:text-8xl">
          Discover Movies
          <span className="block bg-gradient-to-r from-pink-200 via-orange-200 to-violet-200 bg-clip-text text-transparent drop-shadow-[0_0_34px_rgba(244,114,182,0.28)]">
            Worth Remembering
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-white/64 sm:text-xl">
          Find films that match your mood, save what moves you, and shape a watchlist for tonight.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>

        <div className="mt-8">
          <GenreFilter genres={genres} activeGenre={activeGenre} onGenreChange={onGenreChange} />
        </div>
      </div>
    </header>
  )
}

export default HeroSection
