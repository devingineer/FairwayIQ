const CLUB_ICONS = {
  Driver: '🏌️',
  '3-Wood': '🪵',
  Hybrid: '⛳',
  Irons: '🔩',
  Wedges: '🔰',
  Putter: '🎯',
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export default function SessionCard({ session }) {
  const { date, duration, clubs, balls, location, notes } = session

  return (
    <div className="session-card">
      <div className="session-card-header">
        <div>
          <div className="session-card-date">{formatDate(date)}</div>
          <div className="session-card-location">{location}</div>
        </div>
        <div className="session-card-meta">
          <span className="session-badge">{formatDuration(duration)}</span>
          <span className="session-badge">{balls} balls</span>
        </div>
      </div>

      {clubs && clubs.length > 0 && (
        <div className="session-card-clubs">
          {clubs.map(club => (
            <span key={club} className="club-tag">
              {CLUB_ICONS[club] || '🏌️'} {club}
            </span>
          ))}
        </div>
      )}

      {notes && (
        <p className="session-card-notes">{notes}</p>
      )}
    </div>
  )
}
