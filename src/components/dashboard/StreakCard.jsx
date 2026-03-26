export default function StreakCard({ current, best }) {
  return (
    <div className="streak-card">
      <div className="streak-header">
        <span className="streak-title">Practice Streak</span>
        {best > 0 && <span className="streak-best">Best: {best}d</span>}
      </div>
      <div className="streak-body">
        <span className="streak-flame">🔥</span>
        <div className="streak-count-wrap">
          <span className="streak-count">{current}</span>
          <span className="streak-count-label">{current === 1 ? 'day' : 'days'}</span>
        </div>
      </div>
      <p className="streak-sub">
        {current === 0
          ? 'Log a session to start your streak'
          : current < 3
          ? 'Keep it going!'
          : current < 7
          ? 'You\'re on a roll!'
          : 'Incredible consistency!'}
      </p>
    </div>
  )
}
