import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function DashboardNav() {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
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
        <span className="logo-mark" />
        FairwayIQ
      </Link>
      <nav className="dash-nav-links">
        <span className="dash-nav-link active">Sessions</span>
      </nav>
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
    </header>
  )
}
