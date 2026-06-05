import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Scale, User, LogOut, FileText, Plus, X } from '../icons/Icons'
import Button from '../ui/Button'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-navy/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="text-bronze">
            <Scale size={22} strokeWidth={1.5} />
          </div>
          <span className="font-serif text-lg text-white tracking-wide">LegalAI</span>
          <span className="text-[10px] tracking-luxury uppercase text-bronze/70 border border-bronze/30 px-2 py-0.5 rounded-full">
            Canada
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/pricing"
            className={`text-sm transition-colors ${isActive('/pricing') ? 'text-bronze' : 'text-gray-400 hover:text-white'}`}
          >
            Pricing
          </Link>
          <Link
            to="/find-lawyer"
            className={`text-sm transition-colors ${isActive('/find-lawyer') ? 'text-bronze' : 'text-gray-400 hover:text-white'}`}
          >
            Find a Lawyer
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`text-sm transition-colors ${isActive('/dashboard') ? 'text-bronze' : 'text-gray-400 hover:text-white'}`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/contract/new">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Plus size={14} />
                  New Contract
                </Button>
              </Link>
              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                <div className="text-right">
                  <p className="text-xs text-white">{profile?.full_name || user.email}</p>
                  <p className="text-[10px] uppercase tracking-luxury text-bronze">
                    {profile?.plan || 'free'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-white transition-colors p-1.5 rounded hover:bg-white/5"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : (
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-navy-800 px-6 py-4 flex flex-col gap-4">
          <Link to="/pricing" className="text-sm text-gray-300" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link to="/find-lawyer" className="text-sm text-gray-300" onClick={() => setMenuOpen(false)}>Find a Lawyer</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/contract/new" className="text-sm text-bronze" onClick={() => setMenuOpen(false)}>New Contract</Link>
              <button onClick={handleSignOut} className="text-sm text-left text-gray-400">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
