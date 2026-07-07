function StatsCard({ label, value, icon: Icon, tone }) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 animate-count text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-2xl border border-white/10 p-3 ${tone}`}>
          <Icon size={22} />
        </div>
      </div>
    </article>
  )
}

export default StatsCard
