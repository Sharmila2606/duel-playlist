import { BookMarked, CheckCircle2, Clock3, Flame } from 'lucide-react'
import StatsCard from './StatsCard'

function StatsSection({ stats }) {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
      <StatsCard label="Total items" value={stats.total} icon={BookMarked} tone="bg-violet-400/15 text-violet-200" />
      <StatsCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="bg-emerald-400/15 text-emerald-200" />
      <StatsCard label="Pending" value={stats.pending} icon={Clock3} tone="bg-amber-400/15 text-amber-200" />
      <StatsCard label="Reading now" value={stats.reading} icon={Flame} tone="bg-cyan-400/15 text-cyan-200" />
    </section>
  )
}

export default StatsSection
