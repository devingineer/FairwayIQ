const features = [
  {
    title: 'Personalized practice plans',
    desc: 'AI-generated drill schedules based on your game data, goals, and available time each week.',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Fast session logging',
    desc: 'Log a full practice session in under 60 seconds. Quick taps, no typing required.',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Progress tracking',
    desc: "Visual dashboards show exactly what's improving and what needs more attention over time.",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Smart recommendations',
    desc: 'After each session, get prioritized suggestions on what to drill next based on your results.',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Lesson note capture',
    desc: "Snap a photo of instructor notes and we'll turn them into drills in your practice plan.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
  },
  {
    title: 'Playing partners',
    desc: 'Invite friends to compare stats and keep each other accountable between sessions.',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const drills = [
  { color: 'dot-green', name: '50-yard pitch control', meta: '15 min · Wedge accuracy', score: '8/10' },
  { color: 'dot-amber', name: 'Lag putting drill', meta: '10 min · Distance control', score: '6/10' },
  { color: 'dot-red', name: 'Bunker escape (flat lie)', meta: '10 min · Sand game', score: '4/10' },
]

function AppMockup() {
  return (
    <div className="mockup-wrap">
      <div className="mockup-copy">
        <h3>Your practice dashboard, always updated</h3>
        <p>See your current plan, recent results, and next recommended drills — all in one place.</p>
        <ul className="check-list">
          <li>Drill results tracked per session</li>
          <li>Weak areas flagged automatically</li>
          <li>Next plan adapts to your progress</li>
          <li>Works at the range or at home</li>
        </ul>
      </div>
      <div className="app-card">
        <div className="app-card-header">
          <h4>Today's session — Short game</h4>
          <span className="app-tag">3 drills</span>
        </div>
        {drills.map((d) => (
          <div className="drill-row" key={d.name}>
            <div className={`drill-dot ${d.color}`} />
            <div className="drill-info">
              <p>{d.name}</p>
              <span>{d.meta}</span>
            </div>
            <div className="drill-score">{d.score}</div>
          </div>
        ))}
        <div className="progress-bar-wrap">
          <div className="progress-label">
            <span>Weekly goal</span>
            <span>3 / 5 sessions</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Features() {
  return (
    <section className="section" id="features">
      <p className="section-label">Features</p>
      <h2 className="section-title">Everything you need to improve</h2>
      <p className="section-sub">
        Built for real golfers who want real results — without hiring a full-time coach.
      </p>
      <div className="features">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
      <AppMockup />
    </section>
  )
}