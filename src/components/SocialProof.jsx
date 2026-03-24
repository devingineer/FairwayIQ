const stats = [
  { value: '4,200+', label: 'Active golfers' },
  { value: '2.4 strokes', label: 'Avg. handicap improvement' },
  { value: '18,000+', label: 'Sessions logged' },
  { value: '4.8 / 5', label: 'User rating' },
]

export default function SocialProof() {
  return (
    <div className="proof">
      <div className="proof-inner">
        {stats.map((stat, i) => (
          <span key={stat.label} style={{ display: 'contents' }}>
            <div className="proof-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
            {i < stats.length - 1 && <div className="proof-div" />}
          </span>
        ))}
      </div>
    </div>
  )
}