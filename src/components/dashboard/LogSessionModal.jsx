import { useState } from 'react'

const CLUBS = ['Driver', '3-Wood', 'Hybrid', 'Irons', 'Wedges', 'Putter']

const DEFAULT_FORM = {
  date: new Date().toISOString().slice(0, 16),
  duration: '',
  clubs: [],
  balls: '',
  location: '',
  notes: '',
}

export default function LogSessionModal({ onClose, onSave }) {
  const [form, setForm] = useState(DEFAULT_FORM)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function toggleClub(club) {
    setForm(f => ({
      ...f,
      clubs: f.clubs.includes(club)
        ? f.clubs.filter(c => c !== club)
        : [...f.clubs, club],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      ...form,
      duration: Number(form.duration),
      balls: Number(form.balls),
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Log Practice Session</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date & Time</label>
              <input
                className="form-input"
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input
                className="form-input"
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 60"
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Balls Hit</label>
              <input
                className="form-input"
                type="number"
                name="balls"
                value={form.balls}
                onChange={handleChange}
                placeholder="e.g. 100"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className="form-input"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Topgolf, Local Range"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clubs Practiced</label>
            <div className="club-selector">
              {CLUBS.map(club => (
                <button
                  key={club}
                  type="button"
                  className={`club-option ${form.clubs.includes(club) ? 'selected' : ''}`}
                  onClick={() => toggleClub(club)}
                >
                  {club}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input form-textarea"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="What went well? What to work on next time?"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Session</button>
          </div>
        </form>
      </div>
    </div>
  )
}
