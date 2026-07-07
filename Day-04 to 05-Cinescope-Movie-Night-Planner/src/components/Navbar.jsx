import { Clapperboard, Heart, ListChecks } from 'lucide-react'

function Navbar({ favoriteCount, shortlistCount }) {
  return (
    <nav className="sticky top-4 z-30 mx-auto flex w-[calc(100%-2rem)] max-w-7xl items-center justify-between rounded-3xl border border-white/10 bg-black/35 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-amber-400 shadow-lg shadow-red-500/25">
          <Clapperboard className="size-5 text-white" />
        </div>
        <div>
          <p className="text-lg font-black tracking-wide text-white">CineScope</p>
          <p className="text-xs font-medium text-white/50">Movie Night Planner</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm font-semibold text-white">
          <Heart className="size-4 fill-rose-400 text-rose-400" />
          <span className="tabular-nums">{favoriteCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm font-semibold text-white">
          <ListChecks className="size-4 text-emerald-300" />
          <span className="tabular-nums">{shortlistCount}</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
