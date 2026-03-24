import { useState } from 'react'

// ── Shared icon primitives ───────────────────────────────────────────────────

function CheckItem({ yes, children }) {
  return (
    <li>
      <span className={`check ${yes ? 'yes' : 'no'}`}>
        {yes ? (
          <svg viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" /></svg>
        ) : (
          <svg viewBox="0 0 8 2"><path d="M0 1h8" /></svg>
        )}
      </span>
      {yes ? children : <span style={{ color: 'var(--gray-muted)' }}>{children}</span>}
    </li>
  )
}

function DotCheck() {
  return (
    <span className="dot-check">
      <svg viewBox="0 0 10 8">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function DotDash() {
  return (
    <span className="dot-dash">
      <svg viewBox="0 0 8 2">
        <path d="M0 1h8" stroke="#888" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function CellValue({ value }) {
  if (value === true) return <DotCheck />
  if (value === false) return <DotDash />
  return value
}

// ── Data ─────────────────────────────────────────────────────────────────────

const plans = [
  {
    name: 'Free',
    desc: 'Get started with the basics. No credit card needed.',
    monthlyPrice: '$0',
    annualPrice: '$0',
    billedMonthly: '\u00a0',
    billedAnnually: '\u00a0',
    cta: { label: 'Get started free', style: 'outline' },
    featured: false,
    features: [
      { label: '2 sessions per week', included: true },
      { label: '3 drills per session', included: true },
      { label: 'Basic progress tracking', included: true },
      { label: 'Drill library (50 drills)', included: true },
      { label: 'AI recommendations', included: false },
      { label: 'Lesson note capture', included: false },
      { label: 'Playing partners', included: false },
    ],
  },
  {
    name: 'Pro',
    desc: 'The full FairwayIQ experience. For golfers serious about improving.',
    monthlyPrice: '$12',
    annualPrice: '$9',
    billedMonthly: 'Billed monthly',
    billedAnnually: 'Billed $108/year',
    cta: { label: 'Start 14-day free trial', style: 'solid' },
    featured: true,
    badge: 'Most popular',
    features: [
      { label: 'Unlimited sessions', included: true },
      { label: 'Unlimited drills', included: true },
      { label: 'Full progress dashboard', included: true },
      { label: 'Full drill library (300+)', included: true },
      { label: 'AI-powered recommendations', included: true },
      { label: 'Lesson note capture', included: true },
      { label: 'Up to 3 playing partners', included: true },
    ],
  },
  {
    name: 'Coach',
    desc: 'For golf instructors managing multiple students and practice plans.',
    monthlyPrice: '$39',
    annualPrice: '$29',
    billedMonthly: 'Billed monthly',
    billedAnnually: 'Billed $348/year',
    cta: { label: 'Contact sales', style: 'outline' },
    featured: false,
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Up to 20 student accounts', included: true },
      { label: 'Student progress reports', included: true },
      { label: 'Custom drill creation', included: true },
      { label: 'Assign plans to students', included: true },
      { label: 'Priority support', included: true },
      { label: 'Branded reports', included: true },
    ],
  },
]

const compareRows = [
  { cat: 'Practice sessions' },
  { feature: 'Sessions per week', free: '2', pro: 'Unlimited', coach: 'Unlimited' },
  { feature: 'Drills per session', free: '3', pro: 'Unlimited', coach: 'Unlimited' },
  { feature: 'Drill library access', free: '50 drills', pro: '300+ drills', coach: '300+ + custom' },
  { cat: 'AI & recommendations' },
  { feature: 'AI practice plans', free: false, pro: true, coach: true },
  { feature: 'Next-session recommendations', free: false, pro: true, coach: true },
  { feature: 'Lesson note capture', free: false, pro: true, coach: true },
  { cat: 'Tracking & social' },
  { feature: 'Progress dashboard', free: 'Basic', pro: 'Full', coach: 'Full' },
  { feature: 'Playing partners', free: false, pro: 'Up to 3', coach: 'Unlimited' },
  { cat: 'Coach features' },
  { feature: 'Student accounts', free: false, pro: false, coach: 'Up to 20' },
  { feature: 'Assign plans to students', free: false, pro: false, coach: true },
  { feature: 'Branded PDF reports', free: false, pro: false, coach: true },
]

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. Cancel from your account settings with one click. No questions asked, no cancellation fees.',
  },
  {
    q: 'What happens after my free trial?',
    a: "After 14 days, you'll be asked to choose a plan. If you don't upgrade, your account moves to the Free plan automatically.",
  },
  {
    q: 'Does the Coach plan include my own Pro access?',
    a: 'Yes. Your coach account includes full Pro features for your own practice, plus tools to manage up to 20 students.',
  },
  {
    q: 'Can I import notes from my instructor?',
    a: 'On Pro and Coach plans, you can photograph or upload notes and FairwayIQ will convert them into actionable drills automatically.',
  },
  {
    q: 'Is there a student discount?',
    a: 'Yes — college golf team members get 40% off Pro. Reach out to our team with your .edu email to redeem.',
  },
  {
    q: 'Do you offer refunds?',
    a: "We offer a full refund within 7 days of your first charge if FairwayIQ isn't the right fit. Just contact support.",
  },
]

// ── Components ────────────────────────────────────────────────────────────────

function PlanCard({ plan, annual }) {
  const price = annual ? plan.annualPrice : plan.monthlyPrice
  const billed = annual ? plan.billedAnnually : plan.billedMonthly

  return (
    <div className={`plan-card${plan.featured ? ' featured' : ''}`}>
      {plan.badge && <div className="plan-badge">{plan.badge}</div>}
      <div className="plan-name">{plan.name}</div>
      <div className="plan-desc">{plan.desc}</div>
      <div className="plan-price">
        <span className="amount">{price}</span>
        <span className="period">/mo</span>
      </div>
      <div className="plan-billed">{billed}</div>
      <a href="#" className={`plan-btn ${plan.cta.style}`}>{plan.cta.label}</a>
      <div className="divider" />
      <ul className="feature-list">
        {plan.features.map((f) => (
          <CheckItem key={f.label} yes={f.included}>{f.label}</CheckItem>
        ))}
      </ul>
    </div>
  )
}

function CompareTable() {
  return (
    <div className="compare-section">
      <div className="section-label">Compare plans</div>
      <div className="section-title">Everything side by side</div>
      <table className="compare-table">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Feature</th>
            <th style={{ width: '20%' }}>Free</th>
            <th style={{ width: '20%', color: 'var(--green)' }}>Pro</th>
            <th style={{ width: '20%' }}>Coach</th>
          </tr>
        </thead>
        <tbody>
          {compareRows.map((row, i) =>
            row.cat ? (
              <tr className="cat-row" key={i}>
                <td colSpan={4}>{row.cat}</td>
              </tr>
            ) : (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td><CellValue value={row.free} /></td>
                <td><CellValue value={row.pro} /></td>
                <td><CellValue value={row.coach} /></td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}

function FAQ() {
  return (
    <div className="faq-section">
      <div className="section-label">FAQ</div>
      <div className="section-title">Common questions</div>
      <div className="faq">
        {faqs.map((item) => (
          <div className="faq-item" key={item.q}>
            <h4>{item.q}</h4>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing">
      <div className="pricing-wrap">
        <div className="pricing-hero">
          <p className="section-label">Pricing</p>
          <h2>Simple, honest pricing</h2>
          <p>Start free, upgrade when you're ready. No hidden fees. Cancel anytime.</p>
          <div className="toggle-wrap">
            <span className={`toggle-label${!annual ? ' active' : ''}`}>Monthly</span>
            <button
              className={`toggle${annual ? ' annual' : ''}`}
              onClick={() => setAnnual((v) => !v)}
              aria-label="Toggle billing"
            >
              <div className="toggle-knob" />
            </button>
            <span className={`toggle-label${annual ? ' active' : ''}`}>
              Annual <span className="save-badge">Save 25%</span>
            </span>
          </div>
        </div>

        <div className="plans">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} annual={annual} />
          ))}
        </div>
      </div>

      <CompareTable />
      <FAQ />
    </section>
  )
}