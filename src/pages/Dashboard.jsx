import { useState, useEffect } from 'react'
import DashboardNav from '../components/dashboard/DashboardNav'
import MiniCalendar from '../components/dashboard/MiniCalendar'
import SessionCard from '../components/dashboard/SessionCard'
import LogSessionModal from '../components/dashboard/LogSessionModal'
import StreakCard from '../components/dashboard/StreakCard'
import GoalsCard from '../components/dashboard/GoalsCard'
import { supabase } from '../lib/supabase'

function calcStreak(sessions) {
  if (!sessions.length) return { current: 0, best: 0 }

  const days = [...new Set(sessions.map(s => {
    const d = new Date(s.date)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }))].sort((a, b) => b - a).map(t => new Date(t))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let current = 0
  if (days[0] >= yesterday) {
    current = 1
    for (let i = 1; i < days.length; i++) {
      const diff = Math.round((days[i - 1] - days[i]) / 86400000)
      if (diff === 1) current++
      else break
    }
  }

  let best = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((days[i - 1] - days[i]) / 86400000)
    if (diff === 1) { run++; if (run > best) best = run }
    else run = 1
  }
  best = Math.max(best, current)

  return { current, best }
}

function getWeekStats(sessions) {
  const now = new Date()
  const monday = new Date(now)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))

  const thisWeek = sessions.filter(s => new Date(s.date) >= monday)
  return {
    sessions: thisWeek.length,
    balls: thisWeek.reduce((sum, s) => sum + s.balls, 0),
    minutes: thisWeek.reduce((sum, s) => sum + s.duration, 0),
  }
}

export default function Dashboard() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    async function fetchSessions() {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false })

      if (!error) setSessions(data)
      setLoading(false)
    }
    fetchSessions()
  }, [])

  async function handleSave(session) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('sessions')
      .insert({ ...session, user_id: user.id })
      .select()
      .single()

    if (!error) setSessions(prev => [data, ...prev])
  }

  const filteredSessions = selectedDate
    ? sessions.filter(s => {
        const d = new Date(s.date)
        return (
          d.getFullYear() === selectedDate.getFullYear() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getDate() === selectedDate.getDate()
        )
      })
    : sessions

  const streak = calcStreak(sessions)
  const weekStats = getWeekStats(sessions)

  return (
    <div className="dash-layout">
      <DashboardNav />

      <div className="dash-body">
        {/* Sidebar */}
        <aside className="dash-sidebar">
          <MiniCalendar
            sessions={sessions}
            selectedDate={selectedDate ? selectedDate.toISOString() : null}
            onDaySelect={d => setSelectedDate(prev =>
              prev && prev.toDateString() === d.toDateString() ? null : d
            )}
          />

          <StreakCard current={streak.current} best={streak.best} />

          <GoalsCard
            weekSessions={weekStats.sessions}
            weekBalls={weekStats.balls}
            weekMinutes={weekStats.minutes}
          />

          <div className="dash-stats">
            <div className="stat-item">
              <span className="stat-value">{sessions.length}</span>
              <span className="stat-label">Sessions</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{sessions.reduce((sum, s) => sum + s.balls, 0)}</span>
              <span className="stat-label">Balls Hit</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h</span>
              <span className="stat-label">Total Time</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="dash-main">
          <div className="dash-main-header">
            <div>
              <h1 className="dash-page-title">Practice Sessions</h1>
              {selectedDate && (
                <p className="dash-filter-label">
                  Showing {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  <button className="clear-filter" onClick={() => setSelectedDate(null)}>Clear</button>
                </p>
              )}
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + Log Session
            </button>
          </div>

          <div className="session-list">
            {loading ? (
              <div className="empty-state"><p>Loading sessions...</p></div>
            ) : filteredSessions.length === 0 ? (
              <div className="empty-state">
                <p>No sessions {selectedDate ? 'on this day' : 'yet'}.</p>
                {!selectedDate && (
                  <button className="btn-primary" onClick={() => setShowModal(true)}>Log your first session</button>
                )}
              </div>
            ) : (
              filteredSessions.map(s => <SessionCard key={s.id} session={s} />)
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <LogSessionModal onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </div>
  )
}
