function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/7 px-6 py-14 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-white/10 text-rose-200">
        <Icon className="size-7" />
      </div>
      <h3 className="mt-5 text-2xl font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">{message}</p>
    </div>
  )
}

export default EmptyState
