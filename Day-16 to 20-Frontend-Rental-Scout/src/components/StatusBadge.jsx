function StatusBadge({ isAvailable }) {
  return (
    <span className={`availability-status ${isAvailable ? 'available' : 'not-available'}`}>
      {isAvailable ? 'Available' : 'Not available'}
    </span>
  )
}

export default StatusBadge
