export function SummaryCard({ label, value, helper, tone = 'default' }) {
  return (
    <article className={`summary-card glass-card ${tone}`}>
      <p>{label}</p>
      <strong className="animated-total" key={value}>
        {value}
      </strong>
      <span>{helper}</span>
    </article>
  )
}
