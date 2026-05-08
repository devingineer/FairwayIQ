import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Nav() {
  return (
    <div className="nav-wrap">
    <nav>
      <a className="logo" href="#">
        <div className="logo-mark">
          <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="6" r="3.5" />
            <path d="M9 9.5v7" strokeLinecap="round" />
            <path d="M6 16.5h6" strokeLinecap="round" />
          </svg>
        </div>
        FairwayIQ
      </a>
      <div className="nav-links">
        <a href="#how-it-works">How it works</a>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <ThemeToggle />
        <Link className="btn-nav" to="/login">Log in / Sign up</Link>
      </div>
    </nav>
    </div>
  )
}