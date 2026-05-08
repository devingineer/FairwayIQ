export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="badge">
        <span className="badge-dot" />
        AI-powered golf coaching
      </div>
      <h1>
        Practice smarter.<br />
        Shoot <span>lower scores</span>.
      </h1>
      <p>
        FairwayIQ builds a personalized practice plan, tracks your progress, and tells
        you exactly what to work on next — so every range session counts.
      </p>
      <div className="hero-ctas">
        <a className="btn-primary" href="/login">Start for free</a>
        <a className="btn-secondary" href="#how-it-works">See how it works</a>
      </div>
    </section>
  )
}