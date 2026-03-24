import { useState, useEffect } from 'react'
import DashboardNav from '../components/dashboard/DashboardNav'
import MiniCalendar from '../components/dashboard/MiniCalendar'
import SessionCard from '../components/dashboard/SessionCard'
import LogSessionModal from '../components/dashboard/LogSessionModal'
import { supabase } from '../lib/supabase'

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
