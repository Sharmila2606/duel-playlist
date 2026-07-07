import { ArrowUpRight, Library } from 'lucide-react'
import bookImage from '../assets/queueflow-books.png'

function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-5 pb-8 pt-6 sm:px-8 lg:pb-12">
      <div className="absolute left-10 top-4 h-56 w-56 animate-float rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute right-8 top-20 h-72 w-72 animate-float-delayed rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-white/3 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <Library size={16} />
              Build your personal knowledge queue
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Organize What You Read
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Capture books and articles, track reading progress, and keep your next best idea close.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-cyan-400/20 blur-3xl" />
            <img
              src={bookImage}
              alt="Premium stack of books and reading notes"
              className="relative mx-auto aspect-[4/3] w-full max-w-xl rounded-[1.75rem] border border-white/10 object-cover shadow-2xl shadow-cyan-950/40"
            />
            <div className="absolute bottom-4 left-4 right-4 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/65 p-4 shadow-xl backdrop-blur-xl sm:left-auto sm:w-64">
              <div className="flex items-center justify-between text-sm text-slate-400">
                This week
                <ArrowUpRight size={17} className="text-emerald-300" />
              </div>
              <p className="text-2xl font-semibold text-white">Focus Queue</p>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
