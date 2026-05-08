import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function OnboardingModal({ onDone }) {
  const [handicap, setHandicap] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(value) {
    setSaving(true)
    await supabase.auth.updateUser({ data: { onboarded: true, handicap: value } })
    setSaving(false)
    onDone()
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header" style={{ padding: '24px 24px 0' }}>
          <h2 className="modal-title">One quick thing</h2>
        </div>
        <div className="modal-form">
          <p style={{ fontSize: 14, color: 'var(--grass)', lineHeight: 1.65, marginTop: -4 }}>
            What's your current handicap index? We'll use it to personalise your practice plan.
          </p>
          <div className="form-group">
            <label className="form-label">Handicap Index</label>
            <input
              className="form-input"
              type="number"
              min="-10"
              max="54"
              step="0.1"
              placeholder="e.g. 12.4"
              value={handicap}
              onChange={e => setHandicap(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: 14 }}
              onClick={() => save('skip')}
              disabled={saving}
            >
              Skip for now
            </button>
            <button
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: 14 }}
              onClick={() => save(handicap === '' ? 'skip' : parseFloat(handicap))}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
