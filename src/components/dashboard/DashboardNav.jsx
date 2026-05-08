import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ThemeToggle from '../ThemeToggle'

export default function DashboardNav() {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="dash-nav">
      <Link to="/" className="logo">
        <span className="logo-mark">
          <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="6" r="3.5" />
            <path d="M9 9.5v7" strokeLinecap="round" />
            <path d="M6 16.5h6" strokeLinecap="round" />
          </svg>
        </span>
        FairwayIQ
      </Link>
      <nav className="dash-nav-links">
        <Link to="/dashboard" className={`dash-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Sessions</Link>
        <Link to="/community" className={`dash-nav-link ${location.pathname === '/community' ? 'active' : ''}`}>Community</Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <ThemeToggle />
      <div className="dash-nav-user" ref={menuRef}>
        <button className="dash-avatar" onClick={() => setOpen(o => !o)}>
          {initials}
        </button>
        {open && (
          <div className="dash-dropdown">
            {user?.email && <p className="dash-dropdown-email">{user.email}</p>}
            <button className="dash-dropdown-item" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
      </div>
    </header>
  )
}
