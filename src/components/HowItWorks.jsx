import Reveal from './Reveal'

const steps = [
  {
    num: 1,
    title: 'Set your goals',
    desc: 'Tell us your handicap, what you want to improve, and how often you practice.',
    arrow: true,
  },
  {
    num: 2,
    title: 'Get your plan',
    desc: 'FairwayIQ builds a personalized drill plan tailored to your weaknesses and schedule.',
    arrow: true,
  },
  {
    num: 3,
    title: 'Log & improve',
    desc: 'After each session, log results in seconds. The AI adapts your next plan automatically.',
    arrow: false,
  },
]

export default function HowItWorks() {
  return (
    <div className="how-bg" id="how-it-works">
      <section className="section">
        <Reveal><p className="section-label">How it works</p></Reveal>
        <Reveal delay={100}>
          <h2 className="section-title">Three steps to better golf</h2>
        </Reveal>
        <div className="steps">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={100 + i * 120}>
              <div className="step">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {step.arrow && <span className="step-arrow">→</span>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
