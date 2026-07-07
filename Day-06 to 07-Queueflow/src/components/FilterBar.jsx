const filters = ['All', 'Reading', 'Completed', 'Pending']

function FilterBar({ activeFilter, onChangeFilter }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-3 px-5 py-4 sm:px-8">
      {filters.map((filter) => {
        const isActive = activeFilter === filter
        return (
          <button
            key={filter}
            onClick={() => onChangeFilter(filter)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition duration-300 ${
              isActive
                ? 'border-cyan-300/50 bg-cyan-300/15 text-cyan-100 shadow-lg shadow-cyan-500/20'
                : 'border-white/10 bg-white/[0.06] text-slate-300 hover:border-violet-300/30 hover:bg-white/[0.1]'
            }`}
          >
            {filter}
          </button>
        )
      })}
    </div>
  )
}

export default FilterBar
