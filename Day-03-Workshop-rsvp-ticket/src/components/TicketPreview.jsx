function getInitials(name) {
  if (!name.trim()) {
    return 'RS'
  }

  return name
    .trim()
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function TicketPreview({ ticket, theme, isReady }) {
  return (
    <div
      className={`ticket-card rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-1 ${theme.ticketPanel} ${
        isReady ? 'ticket-card-ready' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={`text-xs uppercase tracking-[0.25em] ${theme.softText}`}>Live Ticket</p>
          <h2 className={`mt-2 text-2xl font-black tracking-tight ${theme.cardValue}`}>
            Event Pass
          </h2>
        </div>
        <div
          className={`grid h-16 w-16 place-items-center rounded-full ${theme.button} text-xl font-bold text-black shadow-lg ${theme.avatarShadow}`}
        >
          {getInitials(ticket.name)}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <p className={`text-xs ${theme.cardLabel}`}>Attendee</p>
          <p className={`text-lg font-semibold ${theme.cardValue}`}>{ticket.name || 'Guest Name'}</p>
        </div>
        <div>
          <p className={`text-xs ${theme.cardLabel}`}>Phone</p>
          <p className={`text-lg font-semibold ${theme.cardValue}`}>
            {ticket.phone || 'Phone number'}
          </p>
        </div>
        <div>
          <p className={`text-xs ${theme.cardLabel}`}>Workshop</p>
          <p className={`text-lg font-semibold ${theme.cardValue}`}>
            {ticket.workshop || 'Choose workshop'}
          </p>
        </div>
        <div>
          <p className={`text-xs ${theme.cardLabel}`}>Ticket Category</p>
          <p className={`text-lg font-semibold ${theme.cardValue}`}>
            {ticket.category || 'Select category'}
          </p>
        </div>
        <div>
          <p className={`text-xs ${theme.cardLabel}`}>Ticket ID</p>
          <p className={`font-mono text-sm ${theme.softText}`}>
            {ticket.id || 'Generated after submit'}
          </p>
        </div>
        {ticket.id && (
          <div className="grid gap-4 rounded-2xl border border-purple-300/20 p-4 sm:grid-cols-2">
            <div>
              <p className={`text-xs ${theme.cardLabel}`}>Registered Date</p>
              <p className={`text-sm font-semibold ${theme.cardValue}`}>{ticket.date}</p>
            </div>
            <div>
              <p className={`text-xs ${theme.cardLabel}`}>Registered Time</p>
              <p className={`text-sm font-semibold ${theme.cardValue}`}>{ticket.time}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketPreview
