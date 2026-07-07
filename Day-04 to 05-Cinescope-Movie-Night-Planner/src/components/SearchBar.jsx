import { Search } from 'lucide-react'

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <label className="group relative block w-full">
      <span className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500/20 via-orange-300/10 to-violet-500/20 opacity-60 blur-xl transition duration-500 group-focus-within:opacity-100" />
      <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-white/45 transition duration-300 group-focus-within:scale-110 group-focus-within:text-orange-200" />
      <input
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="relative w-full rounded-3xl border border-white/12 bg-white/9 py-5 pl-14 pr-20 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_80px_rgba(0,0,0,0.42)] outline-none backdrop-blur-2xl transition duration-300 placeholder:text-white/36 focus:border-orange-200/55 focus:bg-white/14 focus:ring-4 focus:ring-pink-400/12"
        placeholder="Discover something unforgettable..."
        type="text"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70 hover:bg-white/20 hover:text-white"
        >
          Clear
        </button>
      )}
    </label>
  );
}

export default SearchBar
