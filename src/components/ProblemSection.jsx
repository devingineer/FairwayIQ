const problems = [
  {
    title: 'Unstructured sessions',
    desc: 'Most range visits turn into "hit balls until done" — no drills, no focus, no purpose.',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'No feedback loop',
    desc: "Without tracking, you can't see what's improving, what isn't, or what to prioritize next.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 12h4l3-8 4 16 3-8h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Lessons don't stick",
    desc: 'Expensive lessons come with notes that get lost — and the same mistakes repeat next session.',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10h8M8 14h5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function ProblemSection() {
  return (
    <section className="section">
      <p className="section-label">The problem</p>
      <h2 className="section-title">
        Most golfers practice hard.<br />Very few practice smart.
      </h2>
      <p className="section-sub">
        Without structure, feedback, or a clear plan, practice sessions don't translate
        to lower scores on the course.
      </p>
      <div className="problems">
        {problems.map((p) => (
          <div className="problem-card" key={p.title}>
            <div className="problem-icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}