import { useState } from 'react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function MiniCalendar({ sessions = [], onDaySelect, selectedDate }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const sessionDates = new Set(
    sessions.map(s => {
      const d = new Date(s.date)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  )

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">
        <button className="mini-cal-nav" onClick={prevMonth}>‹</button>
        <span className="mini-cal-title">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="mini-cal-nav" onClick={nextMonth}>›</button>
      </div>
      <div className="mini-cal-grid">
        {DAYS.map(d => (
          <div key={d} className="mini-cal-day-name">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const key = `${viewYear}-${viewMonth}-${day}`
          const hasSession = sessionDates.has(key)
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
          const selDate = selectedDate ? new Date(selectedDate) : null
          const isSelected = selDate && day === selDate.getDate() && viewMonth === selDate.getMonth() && viewYear === selDate.getFullYear()

          return (
            <button
              key={key}
              className={`mini-cal-day ${isToday ? 'today' : ''} ${hasSession ? 'has-session' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => onDaySelect && onDaySelect(new Date(viewYear, viewMonth, day))}
            >
              {day}
              {hasSession && <span className="mini-cal-dot" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
