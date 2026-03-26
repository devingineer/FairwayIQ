import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const DEFAULTS = { weekly_sessions: 3, weekly_balls: 300, weekly_minutes: 120 }

function ProgressBar({ value, target, unit }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  const done = value >= target
  return (
    <div className="goal-bar-wrap">
      <div className="goal-bar-track">
        <div
          className={`goal-bar-fill ${done ? 'goal-bar-done' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="goal-bar-label">
        {value} / {target} {unit}
      </span>
    </div>
  )
}

export default function GoalsCard({ weekSessions, weekBalls, weekMinutes }) {
  const [goals, setGoals] = useState(DEFAULTS)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGoals() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) {
        const g = { weekly_sessions: data.weekly_sessions, weekly_balls: data.weekly_balls, weekly_minutes: data.weekly_minutes }
        setGoals(g)
        setDraft(g)
      }
      setLoading(false)
    }
    fetchGoals()
  }, [])

  async function handleSave() {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('goals').upsert(
      { user_id: user.id, ...draft },
      { onConflict: 'user_id' }
    )
    setGoals(draft)
    setEditing(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setDraft(d => ({ ...d, [name]: Number(value) }))
  }

  if (loading) return null

  return (
    <div className="goals-card">
      <div className="goals-header">
        <span className="goals-title">Weekly Goals</span>
        {!editing
          ? <button className="goals-edit-btn" onClick={() => setEditing(true)}>Edit</button>
          : <div className="goals-edit-actions">
              <button className="goals-cancel-btn" onClick={() => { setEditing(false); setDraft(goals) }}>Cancel</button>
              <button className="goals-save-btn" onClick={handleSave}>Save</button>
            </div>
        }
      </div>

      {editing ? (
        <div className="goals-form">
          <div className="goals-form-row">
            <label>Sessions / week</label>
            <input type="number" name="weekly_sessions" value={draft.weekly_sessions} onChange={handleChange} min="1" />
          </div>
          <div className="goals-form-row">
            <label>Balls / week</label>
            <input type="number" name="weekly_balls" value={draft.weekly_balls} onChange={handleChange} min="1" />
          </div>
          <div className="goals-form-row">
            <label>Minutes / week</label>
            <input type="number" name="weekly_minutes" value={draft.weekly_minutes} onChange={handleChange} min="1" />
          </div>
        </div>
      ) : (
        <div className="goals-list">
          <div className="goal-item">
            <span className="goal-item-label">Sessions</span>
            <ProgressBar value={weekSessions} target={goals.weekly_sessions} unit="sessions" />
          </div>
          <div className="goal-item">
            <span className="goal-item-label">Balls Hit</span>
            <ProgressBar value={weekBalls} target={goals.weekly_balls} unit="balls" />
          </div>
          <div className="goal-item">
            <span className="goal-item-label">Time</span>
            <ProgressBar value={weekMinutes} target={goals.weekly_minutes} unit="min" />
          </div>
        </div>
      )}
    </div>
  )
}
