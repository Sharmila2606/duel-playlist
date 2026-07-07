import { BookOpen, Sparkles } from 'lucide-react'

function Navbar() {
  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-violet-500/20">
          <BookOpen size={22} className="text-cyan-200" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">QueueFlow</p>
          <p className="text-xs text-slate-400">Smart Reading Queue</p>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:flex">
        <Sparkles size={16} className="text-violet-300" />
        Read smarter every day
      </div>
    </nav>
  )
}

export default Navbar
