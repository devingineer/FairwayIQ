const testimonials = [
  {
    quote: 'Dropped 4 strokes in 6 weeks. I finally know what to work on instead of just beating balls.',
    initials: 'MK',
    name: 'Mike K.',
    result: '14 → 10 handicap',
  },
  {
    quote: "I take lessons once a month. FairwayIQ turns my instructor's notes into an actual plan I follow every week.",
    initials: 'SR',
    name: 'Sarah R.',
    result: '22 → 18 handicap',
  },
  {
    quote: 'Logging sessions takes 30 seconds. I actually do it now. The progress charts are honestly motivating.',
    initials: 'JL',
    name: 'James L.',
    result: '9 → 6 handicap',
  },
]

export default function Testimonials() {
  return (
    <div className="how-bg">
      <section className="section">
        <p className="section-label">Testimonials</p>
        <h2 className="section-title">Golfers who practice smarter</h2>
        <div className="testimonials">
          {testimonials.map((t) => (
            <div className="tcard" key={t.name}>
              <div className="stars">★★★★★</div>
              <p>"{t.quote}"</p>
              <div className="tcard-author">
                <div className="avatar">{t.initials}</div>
                <div className="author-info">
                  <strong>{t.name}</strong>
                  <span>{t.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}